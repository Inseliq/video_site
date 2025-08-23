using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace video_site.Models
{
    public class ApplicationUser : IdentityUser
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(200)]
        [Display(Name = "Полное имя")]
        public string FullName { get; set; }

        [Required]
        [MaxLength(256)]
        [EmailAddress]
        [Display(Name = "Электронная почта")]
        public string Email { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Phone]
        [MaxLength(50)]
        [Display(Name = "Телефон")]
        public string? Phone { get; set; }

        [MaxLength(500)]
        [Display(Name = "Адрес")]
        public string? Address { get; set; }

        [MaxLength(300)]
        [Display(Name = "Путь к аватару")]
        public string? AvatarPath { get; set; }
    }
}
