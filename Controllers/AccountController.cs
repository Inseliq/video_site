using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using video_site.Models;
using video_site.Controllers.ViewModels;
using video_site.Data;

namespace video_site.Controllers
{
    public class AccountController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        // GET: /Account/Sign
        [HttpGet]
        public IActionResult Sign()
        {
            // Возвращаем обёртку SignViewModel с пустыми вложенными моделями
            return View(new SignViewModel());
        }

        // POST: /Account/Sign
        [HttpPost]
        [ActionName("Sign")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SignPost([FromForm] SignViewModel vm)
        {
            // mode приходит из скрытого поля формы: "login" или "register"
            var mode = (Request.Form["mode"].FirstOrDefault() ?? "").ToLowerInvariant();

            if (mode == "register")
            {
                // --- Собираем RegisterViewModel вручную (поддержка вариантов имён полей) ---
                var register = new RegisterViewModel
                {
                    FullName = Request.Form["Register.FullName"].FirstOrDefault() ?? Request.Form["FullName"].FirstOrDefault(),
                    Email = Request.Form["Register.Email"].FirstOrDefault() ?? Request.Form["Email"].FirstOrDefault(),
                    Password = Request.Form["Register.Password"].FirstOrDefault() ?? Request.Form["Password"].FirstOrDefault(),
                    ConfirmPassword = Request.Form["Register.ConfirmPassword"].FirstOrDefault() ?? Request.Form["ConfirmPassword"].FirstOrDefault()
                };

                // --- Удаляем ключи ModelState, относящиеся к Login, чтобы они не мешали ---
                var loginKeys = ModelState.Keys.Where(k => k.StartsWith("Login.", StringComparison.OrdinalIgnoreCase)).ToList();
                foreach (var key in loginKeys) ModelState.Remove(key);

                // --- Валидируем только Register (с префиксом "Register") ---
                TryValidateModel(register, "Register");
                if (!ModelState.IsValid)
                {
                    if (Request.IsAjaxRequest()) return Json(new { success = false, errors = ModelStateErrors() });
                    return View(vm);
                }

                // проверяем существование пользователя по email (используем register.Email)
                var existing = await _userManager.FindByEmailAsync(register.Email);
                if (existing != null)
                {
                    ModelState.AddModelError("Register.Email", "Email уже используется.");
                    if (Request.IsAjaxRequest()) return Json(new { success = false, message = "Email уже используется." });
                    return View(vm);
                }

                var user = new ApplicationUser
                {
                    FullName = register.FullName,
                    Email = register.Email,
                    UserName = register.Email
                };

                var createResult = await _userManager.CreateAsync(user, register.Password);
                if (!createResult.Succeeded)
                {
                    // Пробрасываем ошибки в ModelState с префиксами, чтобы отображались корректно в форме Register
                    foreach (var err in createResult.Errors)
                    {
                        var key = "Register";
                        if (err.Code?.ToLowerInvariant().Contains("password") == true)
                            key = "Register.Password";
                        ModelState.AddModelError(key, err.Description);
                    }
                    if (Request.IsAjaxRequest()) return Json(new { success = false, errors = ModelStateErrors() });
                    return View(vm);
                }

                await _signInManager.SignInAsync(user, isPersistent: false);

                HttpContext.Session.SetString("UserId", user.Id.ToString());
                HttpContext.Session.SetString("UserName", user.FullName ?? user.Email);

                if (Request.IsAjaxRequest())
                    return Json(new { success = true, redirectUrl = Url.Action("Index", "Home") });

                return RedirectToAction("Index", "Home");
            }
            else // login
            {
                // --- Собираем LoginViewModel вручную ---
                var login = new LoginViewModel
                {
                    Email = Request.Form["Login.Email"].FirstOrDefault() ?? Request.Form["Email"].FirstOrDefault(),
                    Password = Request.Form["Login.Password"].FirstOrDefault() ?? Request.Form["Password"].FirstOrDefault()
                };

                // --- Удаляем ключи ModelState, относящиеся к Register, чтобы они не мешали ---
                var registerKeys = ModelState.Keys.Where(k => k.StartsWith("Register.", StringComparison.OrdinalIgnoreCase)).ToList();
                foreach (var key in registerKeys) ModelState.Remove(key);

                // --- Валидируем только Login с префиксом "Login" ---
                TryValidateModel(login, "Login");
                if (!ModelState.IsValid)
                {
                    if (Request.IsAjaxRequest()) return Json(new { success = false, errors = ModelStateErrors() });
                    return View(vm);
                }

                var user = await _userManager.FindByEmailAsync(login.Email);
                if (user == null)
                {
                    ModelState.AddModelError(string.Empty, "Неверный логин или пароль.");
                    if (Request.IsAjaxRequest()) return Json(new { success = false, message = "Неверный логин или пароль." });
                    return View(vm);
                }

                // проверяем пароль через SignInManager (учтёт блокировки и т.д.)
                var signInResult = await _signInManager.CheckPasswordSignInAsync(user, login.Password, lockoutOnFailure: false);
                if (!signInResult.Succeeded)
                {
                    ModelState.AddModelError(string.Empty, "Неверный логин или пароль.");
                    if (Request.IsAjaxRequest()) return Json(new { success = false, message = "Неверный логин или пароль." });
                    return View(vm);
                }

                // При необходимости: установить cookie Identity
                await _signInManager.SignInAsync(user, isPersistent: false);

                HttpContext.Session.SetString("UserId", user.Id.ToString());
                HttpContext.Session.SetString("UserName", user.FullName ?? user.Email);

                if (Request.IsAjaxRequest())
                    return Json(new { success = true, redirectUrl = Url.Action("Index", "Home") });

                return RedirectToAction("Index", "Home");
            }
        }

        // POST: /Account/Logout
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            // sign out Identity cookie (если был)
            await _signInManager.SignOutAsync();

            // clear session as before
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
