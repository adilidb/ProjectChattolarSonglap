
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class NewsContent
{
    public int NewsContentId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = "";

    [Required]
    public string Body { get; set; } = "";

    public DateTime PublishedDate { get; set; } = DateTime.UtcNow;

    // Foreign Key
    public int CategoryId { get; set; }

    // Navigation
    public Category? Category { get; set; }

    public int? ThumbnailId { get; set; }
    public MediaStore? Thumbnail { get; set; }

    public ICollection<MediaStore>? MediaItems { get; set; }
}
