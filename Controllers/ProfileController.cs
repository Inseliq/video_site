using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;
using video_site.Extensions;
using video_site.Models;
using YourApp.Models;

namespace YourApp.Controllers
{
    public class ProfileController : Controller
    {
        private readonly IWebHostEnvironment _env;
        private readonly IHttpContextAccessor _hca;
        private const string SessionKeyProfile = "UserProfile";

        public ProfileController(IWebHostEnvironment env, IHttpContextAccessor hca)
        {
            _env = env;
            _hca = hca;
        }

        // GET: /Profile
        public IActionResult Index()
        {
            var session = HttpContext.Session;
            var profile = session.GetObject<ProfileViewModel>(SessionKeyProfile);

            if (profile == null)
            {
                // если профиля нет — создаём заглушку (реально — запрос к БД)
                profile = new ProfileViewModel
                {
                    Id = HttpContext.Session.GetString("UserId") ?? Guid.NewGuid().ToString(),
                    FullName = HttpContext.Session.GetString("UserName") ?? "Новый пользователь",
                    Email = HttpContext.Session.GetString("UserEmail") ?? "user@example.com",
                    Phone = HttpContext.Session.GetString("UserPhone") ?? "",
                    Address = HttpContext.Session.GetString("UserAddress") ?? "",
                    AvatarPath = Url.Content("~/assets/img/default-avatar.png")
                };
                session.SetObject(SessionKeyProfile, profile);
            }

            return View(profile);
        }

        // GET: /Profile/Edit
        public IActionResult Edit()
        {
            var session = HttpContext.Session;
            var profile = session.GetObject<ProfileViewModel>(SessionKeyProfile) ?? new ProfileViewModel
            {
                Id = HttpContext.Session.GetString("UserId") ?? Guid.NewGuid().ToString(),
                FullName = HttpContext.Session.GetString("UserName") ?? "Новый пользователь",
                Email = HttpContext.Session.GetString("UserEmail") ?? "user@example.com",
                AvatarPath = Url.Content("~/assets/img/default-avatar.png")
            };

            return View(profile);
        }

        // POST: /Profile/Edit
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(ProfileViewModel model)
        {
            if (!ModelState.IsValid)
                return View(model);

            // Обработка аватара
            if (model.AvatarFile != null && model.AvatarFile.Length > 0)
            {
                var uploads = Path.Combine(_env.WebRootPath, "uploads");
                if (!Directory.Exists(uploads))
                    Directory.CreateDirectory(uploads);

                var ext = Path.GetExtension(model.AvatarFile.FileName);
                var fileName = $"{Guid.NewGuid():N}{ext}";
                var filePath = Path.Combine(uploads, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.AvatarFile.CopyToAsync(stream);
                }

                model.AvatarPath = $"/uploads/{fileName}";

                // Сохраняем путь аватара также в сессию для показа в layout
                HttpContext.Session.SetString("UserAvatar", model.AvatarPath);
            }

            // Сохраняем профиль в сессии (подмените на БД)
            HttpContext.Session.SetObject(SessionKeyProfile, model);

            // (Опционально) сохраняем некоторые поля в сессии
            HttpContext.Session.SetString("UserName", model.FullName ?? "");
            HttpContext.Session.SetString("UserEmail", model.Email ?? "");
            HttpContext.Session.SetString("UserPhone", model.Phone ?? "");
            HttpContext.Session.SetString("UserAddress", model.Address ?? "");

            TempData["ProfileSaved"] = "Данные профиля успешно сохранены.";
            return RedirectToAction("Index");
        }
    }
}
