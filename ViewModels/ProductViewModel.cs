using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace video_site.ViewModels
{
    public class ProductViewModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string FormattedPrice => Price.ToString("C", new System.Globalization.CultureInfo("ru-RU"));
        public string ImageUrl { get; set; }
        public string Badge { get; set; }

        public double Rating { get; set; }
        public int ReviewsCount { get; set; }
        public int ViewCount { get; set; }
        public int Stock { get; set; }
        public bool InStock => Stock > 0;

        public string CategoryName { get; set; }
        public string CategorySlug { get; set; }

        public DateTime CreatedAt { get; set; }
        public bool IsNew => (DateTime.Now - CreatedAt).TotalDays <= 30;
    }
}