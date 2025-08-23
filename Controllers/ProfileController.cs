using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;
using video_site.Data;
using video_site.Models;

namespace video_site.Controllers
{
    public class ProfileController : Controller
    {
        private readonly IWebHostEnvironment _env;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public ProfileController(
            IWebHostEnvironment env,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager)
        {
            _env = env;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        private async Task<ApplicationUser> GetCurrentUserAsync()
        {
            if (User?.Identity?.IsAuthenticated == true)
            {
                var byPrincipal = await _userManager.GetUserAsync(User);
                if (byPrincipal != null) return byPrincipal;

                // на всякий случай: попробовать взять Claim NameIdentifier или "sub"
                var claimId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                              ?? User.FindFirst("sub")?.Value
                              ?? User.Identity.Name;
                if (!string.IsNullOrEmpty(claimId))
                {
                    var byClaim = await _userManager.FindByIdAsync(claimId);
                    if (byClaim != null) return byClaim;
                }
            }

            return null;
        }

        // GET: /Profile
        public async Task<IActionResult> Index()
        {
            var user = await GetCurrentUserAsync();
            if (user == null) return RedirectToAction("Sign", "Account");

            var profile = new ProfileViewModel
            {
                Id = user.Id.ToString(),
                FullName = user.FullName,
                Email = user.Email,
                Phone = user.Phone,
                Address = user.Address,
                AvatarPath = user.AvatarPath
            };

            return View(profile);
        }

        // GET: /Profile/Edit
        public async Task<IActionResult> Edit()
        {
            var user = await GetCurrentUserAsync();
            if (user == null) return RedirectToAction("Sign", "Account");

            var model = new ProfileViewModel
            {
                Id = user.Id.ToString(),
                FullName = user.FullName,
                Email = user.Email,
                Phone = user.Phone,
                Address = user.Address,
                AvatarPath = user.AvatarPath
            };

            return View(model);
        }

        // POST: /Profile/Edit
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(ProfileViewModel model)
        {

            // Получаем пользователя: сначала по Id из модели, иначе - по текущему User
            ApplicationUser user = null;
            if (!string.IsNullOrEmpty(model.Id))
                user = await _userManager.FindByIdAsync(model.Id);

            if (user == null)
                user = await _userManager.GetUserAsync(User);

            if (user == null)
                return RedirectToAction("Sign", "Account"); // или return Unauthorized();

            // Если email поменялся — проверьте уникальность
            var newEmail = model.Email?.Trim();
            if (!string.Equals(user.Email ?? string.Empty, newEmail ?? string.Empty, StringComparison.OrdinalIgnoreCase))
            {
                var existing = await _userManager.FindByEmailAsync(newEmail ?? "");
                if (existing != null && existing.Id != user.Id)
                {
                    ModelState.AddModelError(nameof(model.Email), "Email уже используется.");
                    return View(model);
                }

                user.Email = newEmail;
                user.UserName = newEmail; // если в вашем проекте UserName = Email
            }

            // Обработка аватара
            if (model.AvatarFile != null && model.AvatarFile.Length > 0)
            {
                var uploads = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
                if (!Directory.Exists(uploads))
                    Directory.CreateDirectory(uploads);

                var ext = Path.GetExtension(model.AvatarFile.FileName);
                var fileName = $"{Guid.NewGuid():N}{ext}";
                var filePath = Path.Combine(uploads, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.AvatarFile.CopyToAsync(stream);
                }

                // Опционально: удалить старый аватарный файл (если нужно)
                // if (!string.IsNullOrEmpty(user.AvatarPath)) { delete old file... }

                user.AvatarPath = $"/uploads/{fileName}";
            }

            // Обновляем остальные поля
            user.FullName = model.FullName;
            user.Phone = model.Phone;
            user.Address = model.Address;

            // Сохраняем через UserManager
            var updateResult = await _userManager.UpdateAsync(user);

            // --- Диагностика: если неудача — покажем ошибки и НЕ редиректим ---
            if (!updateResult.Succeeded)
            {
                foreach (var err in updateResult.Errors)
                    ModelState.AddModelError(string.Empty, err.Description);

                // логирование можно добавить здесь (ILogger), но для простоты просто вернём view с ошибками
                return View(model);
            }

            // Обновляем авторизационные cookie/claims (если нужно)
            await _signInManager.RefreshSignInAsync(user);

            // Обновляем сессию (как у вас ранее)
            HttpContext.Session.SetString("UserId", user.Id.ToString());
            HttpContext.Session.SetString("UserName", user.FullName ?? user.Email);

            TempData["ProfileSaved"] = "Данные профиля успешно сохранены.";
            return RedirectToAction("Index");
        }
    }
}
