using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace YourApp.Models
{
    public class ProfileViewModel
    {
        public string Id { get; set; }

        [Display(Name = "Имя")]
        [Required, MaxLength(100)]
        public string FullName { get; set; }

        [Display(Name = "Электронная почта")]
        [Required, EmailAddress]
        public string Email { get; set; }

        [Display(Name = "Телефон")]
        [Phone]
        public string Phone { get; set; }

        [Display(Name = "Адрес")]
        public string Address { get; set; }

        [Display(Name = "Аватар")]
        public string AvatarPath { get; set; }

        // Для загрузки нового аватара
        [Display(Name = "Загрузить аватар")]
        public IFormFile AvatarFile { get; set; }
    }
}
