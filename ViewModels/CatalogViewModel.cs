using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using video_site.ViewModels;

namespace video_site.ViewModels
{
    public class CatalogViewModel
    {
        public List<ProductViewModel> Products { get; set; } = new List<ProductViewModel>();
        public string CurrentCategory { get; set; } = "all";
        public string CurrentSort { get; set; } = "popular";
        public string SearchQuery { get; set; } = "";

        public int TotalProducts { get; set; } = 0;
        public int CurrentPage { get; set; } = 1;
        public int PageSize { get; set; } = 12;
        public int TotalPages => (int)Math.Ceiling((double)TotalProducts / PageSize);
        public bool HasMoreProducts => CurrentPage < TotalPages;

        // Для фильтров
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public double? MinRating { get; set; }
        public bool? InStock { get; set; }
    }
}