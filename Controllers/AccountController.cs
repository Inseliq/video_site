using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using video_site.Models;
using video_site.Controllers.ViewModels;
using video_site.Controllers.Data;

namespace video_site.Controllers
{
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IPasswordHasher<ApplicationUser> _passwordHasher;

        public AccountController(ApplicationDbContext context, IPasswordHasher<ApplicationUser> passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        // GET: /Account/Sign
        [HttpGet]
        public IActionResult Sign()
        {
            // возвращаем страницу, где обе формы — login и register
            return View();
        }

        // POST: /Account/Sign - теперь метод называется SignPost, но внешне имеет ActionName "Sign"
        [HttpPost]
        [ActionName("Sign")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SignPost()
        {
            var mode = (Request.Form["mode"].FirstOrDefault() ?? "").ToLowerInvariant();

            if (mode == "register")
            {
                var register = new RegisterViewModel
                {
                    FullName = Request.Form["FullName"],
                    Email = Request.Form["Email"],
                    Password = Request.Form["Password"],
                    ConfirmPassword = Request.Form["ConfirmPassword"]
                };

                TryValidateModel(register);
                if (!ModelState.IsValid)
                {
                    if (Request.IsAjaxRequest()) return Json(new { success = false, errors = ModelStateErrors() });
                    return View(register);
                }

                var exists = await _context.Users.AnyAsync(u => u.Email == register.Email);
                if (exists)
                {
                    ModelState.AddModelError(nameof(register.Email), "Email уже используется.");
                    if (Request.IsAjaxRequest()) return Json(new { success = false, message = "Email уже используется." });
                    return View(register);
                }

                var user = new ApplicationUser
                {
                    FullName = register.FullName,
                    Email = register.Email
                };
                user.PasswordHash = _passwordHasher.HashPassword(user, register.Password);

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Авто-вход
                HttpContext.Session.SetString("UserId", user.Id.ToString());
                HttpContext.Session.SetString("UserName", user.FullName);

                if (Request.IsAjaxRequest())
                    return Json(new { success = true, redirectUrl = Url.Action("Index", "Home") });

                return RedirectToAction("Index", "Home");
            }
            else // login
            {
                var login = new LoginViewModel
                {
                    Email = Request.Form["Email"],
                    Password = Request.Form["Password"]
                };

                TryValidateModel(login);
                if (!ModelState.IsValid)
                {
                    if (Request.IsAjaxRequest()) return Json(new { success = false, errors = ModelStateErrors() });
                    return View(login);
                }

                var user = await _context.Users
                    .Where(u => u.Email == login.Email)
                    .FirstOrDefaultAsync();

                if (user == null)
                {
                    ModelState.AddModelError(string.Empty, "Неверный логин или пароль.");
                    if (Request.IsAjaxRequest()) return Json(new { success = false, message = "Неверный логин или пароль." });
                    return View(login);
                }

                var verify = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, login.Password);
                if (verify == PasswordVerificationResult.Failed)
                {
                    ModelState.AddModelError(string.Empty, "Неверный логин или пароль.");
                    if (Request.IsAjaxRequest()) return Json(new { success = false, message = "Неверный логин или пароль." });
                    return View(login);
                }

                HttpContext.Session.SetString("UserId", user.Id.ToString());
                HttpContext.Session.SetString("UserName", user.FullName);

                if (Request.IsAjaxRequest())
                    return Json(new { success = true, redirectUrl = Url.Action("Index", "Home") });

                return RedirectToAction("Index", "Home");
            }
        }

        // POST: /Account/Logout
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Index", "Home");
        }

        #region helpers
        private object ModelStateErrors()
        {
            var errors = ModelState
                .Where(kvp => kvp.Value.Errors.Count > 0)
                .ToDictionary(
                    kvp => kvp.Key,
                    kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToArray()
                );
            return errors;
        }
        #endregion
    }

    // AJAX detection
    public static class HttpRequestExtensions
    {
        public static bool IsAjaxRequest(this Microsoft.AspNetCore.Http.HttpRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));
            return request.Headers["X-Requested-With"] == "XMLHttpRequest" ||
                   request.Headers["Accept"].ToString().Contains("application/json");
        }
    }
}
