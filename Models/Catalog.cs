using System.ComponentModel.DataAnnotations;

namespace video_site.Models
{
    public class Category
    {
        public int Id { get; set; }

        [Required, StringLength(100)]
        public string Name { get; set; }

        [Required, StringLength(100)]
        public string Slug { get; set; }
    }
}
