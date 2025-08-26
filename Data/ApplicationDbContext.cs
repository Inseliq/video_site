using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using video_site.Models;

namespace video_site.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>

    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Электроника", Slug = "electronics" },
                new Category { Id = 2, Name = "Одежда", Slug = "fashion" },
                new Category { Id = 3, Name = "Дом и сад", Slug = "home" },
                new Category { Id = 4, Name = "Спорт", Slug = "sports" },
                new Category { Id = 5, Name = "Книги", Slug = "books" }
            );

            modelBuilder.Entity<Product>().HasData(
                new Product
                {
                    Id = 1,
                    Title = "MacBook Pro 16\" (M2 Pro) — 1TB",
                    Description = "Профессиональный ноутбук Apple с чипом M2 Pro и 16\" Liquid Retina XDR — для серьёзной работы и креатива.",
                    Price = 329999.00m,
                    Rating = 4.90d,
                    ImageUrl = "https://img.mvideo.ru/Big/30066832bb.jpg",
                    CategoryId = 1,
                    CreatedAt = new DateTime(2025, 1, 1),
                    Badge = "Премиум"
                },
                new Product
                {
                    Id = 2,
                    Title = "iPhone 15 Pro Max — 512GB",
                    Description = "Флагманский смартфон Apple с лучшей камерой, производительностью и долговечностью.",
                    Price = 149999.00m,
                    Rating = 4.85d,
                    ImageUrl = "https://c.dns-shop.ru/thumb/st1/fit/500/500/70f179e1d08dc5a9cb371beb210399b0/1e3d6dc283feae1a340a1d1fbdb7a9411a9ba77beb798b5b19d40762feaa2944.jpg.webp",
                    CategoryId = 1,
                    CreatedAt = new DateTime(2025, 2, 2),
                    Badge = "Хит"
                },
                new Product
                {
                    Id = 3,
                    Title = "Sony Alpha A7 IV — комплект",
                    Description = "Беззеркальная камера высокого класса для фото- и видеосъёмки профессионального уровня.",
                    Price = 219999.00m,
                    Rating = 4.75d,
                    ImageUrl = "https://c.dns-shop.ru/thumb/st4/fit/500/500/245cb6b1aad2b268891019dab7d36412/3e180b155d0b3dd098bde773e65715eacb96ef07ad50686c036e42bef286fbc0.jpg.webp",
                    CategoryId = 1,
                    CreatedAt = new DateTime(2025, 1, 25),
                    Badge = "Топ"
                },
                new Product
                {
                    Id = 4,
                    Title = "Samsung S95C OLED 65\"",
                    Description = "Премиум OLED-телевизор с отличной цветопередачей и поддержкой современных HDR-форматов.",
                    Price = 219999.00m,
                    Rating = 4.70d,
                    ImageUrl = "https://c.dns-shop.ru/thumb/st1/fit/500/500/1e5337e4bda6dfddf05b07f6b278d500/5c04f2305fc5c6194722b4e8d56a68b499bd5bacdc951ed79194ebd8c2cf12cb.jpg.webp",
                    CategoryId = 1,
                    CreatedAt = new DateTime(2025, 3, 5),
                    Badge = "Премиум"
                },
                new Product
                {
                    Id = 5,
                    Title = "Samsung Galaxy Watch Ultra",
                    Description = "Надёжные смарт-часы для активного образа жизни, увеличенное время автономной работы и продвинутая навигация.",
                    Price = 64999.00m,
                    Rating = 4.60d,
                    ImageUrl = "https://c.dns-shop.ru/thumb/st1/fit/500/500/9def0c924f1297bd2280a9d225c9746a/498a3ee5e22031e549c242c9580f665a097149f9f1b46768095106e78e24b0d2.jpg.webp",
                    CategoryId = 1,
                    CreatedAt = new DateTime(2025, 4, 12),
                    Badge = "Лидер продаж"
                },
                new Product
                {
                    Id = 6,
                    Title = "Moncler Maya — пуховая куртка (мужская)",
                    Description = "Легендарная пуховая куртка Moncler — сочетание стиля, тёплости и долговечности.",
                    Price = 69999.00m,
                    Rating = 4.50d,
                    ImageUrl = "https://st-cdn.tsum.com/sig/45cd14cfebc1f8aafa69ece8d45f036c/width/763/i/d5/2e/bc/7e/acb6626e-ab8f-4230-ab8b-857578ae86b6.jpg",
                    CategoryId = 2,
                    CreatedAt = new DateTime(2025, 2, 5),
                    Badge = "Премиум"
                },
                new Product
                {
                    Id = 7,
                    Title = "Посудомоечная машина Miele G 7000 Built-In",
                    Description = "Встраиваемая посудомоечная машина премиум-класса от Miele — экономия воды, тихая работа и долговечность.",
                    Price = 119999.00m,
                    Rating = 4.85d,
                    ImageUrl = "https://avatars.mds.yandex.net/get-mpic/16889250/2a00000198653f06a007333c357ff3adc22a/optimize",
                    CategoryId = 3,
                    CreatedAt = new DateTime(2025, 3, 12),
                    Badge = "Надёжно"
                },
                new Product
                {
                    Id = 8,
                    Title = "Dyson V15 Detect Absolute",
                    Description = "Мощный беспроводной пылесос с интеллектуальной системой очистки и отличной автономностью.",
                    Price = 49999.00m,
                    Rating = 4.75d,
                    ImageUrl = "https://dyson-official.ru/upload/iblock/fa5/ade1h3j7eu0xryh2y2o8wyg4ku0d10c8.png",
                    CategoryId = 3,
                    CreatedAt = new DateTime(2025, 5, 3),
                    Badge = "Хит"
                }
            );
        }

    }
}