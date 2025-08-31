// Controllers/CatalogController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;
using video_site.Data;
using video_site.ViewModels;

namespace video_site.Controllers
{
    [Authorize]
    public class CatalogController : Controller
    {
        private readonly ILogger<CatalogController> _logger;
        private readonly ApplicationDbContext _db;

        public CatalogController(ILogger<CatalogController> logger, ApplicationDbContext db)
        {
            _logger = logger;
            _db = db;
        }

        public async Task<IActionResult> Index(string category = "all", string sort = "popular", string query = "", int page = 1, int pageSize = 12)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 12;

            var productsQuery = _db.Products
                .Include(p => p.Category)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(query))
            {
                productsQuery = productsQuery.Where(p => p.Title.Contains(query) || p.Description.Contains(query));
            }

            if (!string.IsNullOrWhiteSpace(category) && category != "all")
            {
                productsQuery = productsQuery.Where(p => p.Category != null && p.Category.Slug == category);
            }

            productsQuery = sort switch
            {
                "price-low" => productsQuery.OrderBy(p => p.Price),
                "price-high" => productsQuery.OrderByDescending(p => p.Price),
                "rating" => productsQuery.OrderByDescending(p => p.Rating),
                "new" => productsQuery.OrderByDescending(p => p.CreatedAt),
                _ => productsQuery.OrderByDescending(p => p.Rating).ThenByDescending(p => p.CreatedAt)
            };

            var total = await productsQuery.CountAsync();
            var items = await productsQuery
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProductViewModel
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    Price = p.Price,
                    ImageUrl = p.ImageUrl,
                    Badge = p.Badge,
                    Rating = p.Rating,
                    ReviewsCount = 0,
                    CategoryName = p.Category != null ? p.Category.Name : "",
                    CategorySlug = p.Category != null ? p.Category.Slug : "",
                    CreatedAt = p.CreatedAt
                })
                .ToListAsync();

            var model = new CatalogViewModel
            {
                Products = items,
                TotalProducts = total,
                CurrentPage = page,
                PageSize = pageSize,
                CurrentCategory = category ?? "all",
                CurrentSort = sort ?? "popular",
                SearchQuery = query ?? string.Empty
            };

            return View(model);
        }

        [HttpGet]
        public IActionResult Search(string query)
        {
            return RedirectToAction(nameof(Index), new { query });
        }

        [HttpGet]
        public async Task<IActionResult> GetProductJson(int id)
        {
            var p = await _db.Products
                .Include(x => x.Category)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (p == null) return NotFound();

            var dto = new ProductViewModel
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                Price = p.Price,
                ImageUrl = p.ImageUrl,
                Badge = p.Badge,
                Rating = p.Rating,
                ReviewsCount = 0,
                CategoryName = p.Category?.Name,
                CategorySlug = p.Category?.Slug,
                CreatedAt = p.CreatedAt
            };

            return Json(dto);
        }

        public async Task<IActionResult> Wishlist()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View("Error");
        }
    }
}
