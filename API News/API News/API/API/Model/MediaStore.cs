using System.ComponentModel.DataAnnotations;

public class MediaStore
{
    public int MediaStoreId { get; set; }

    [Required]
    public string Url { get; set; } = "";

    public string? PublicId { get; set; }

    public string? Caption { get; set; }

    // Foreign Key to NewsContent
    public int? NewsContentId { get; set; }
    public NewsContent? NewsContent { get; set; }
}
