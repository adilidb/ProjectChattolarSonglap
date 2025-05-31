using System.ComponentModel.DataAnnotations;

public class CreateNewsDto
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = "";

    [Required]
    public string Body { get; set; } = "";

    [Required]
    public int CategoryId { get; set; }

    public IFormFile? Thumbnail { get; set; }
    public List<IFormFile>? MediaItems { get; set; }
}

public class UpdateNewsDto
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = "";

    [Required]
    public string Body { get; set; } = "";

    [Required]
    public int CategoryId { get; set; }

    public IFormFile? Thumbnail { get; set; }
    public List<IFormFile>? MediaItems { get; set; }
}

public class NewsResponseDto
{
    public int NewsContentId { get; set; }
    public string Title { get; set; } = "";
    public string Body { get; set; } = "";
    public DateTime PublishedDate { get; set; }
    public int CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public MediaResponseDto? Thumbnail { get; set; }
    public List<MediaResponseDto>? MediaItems { get; set; }
}

public class MediaResponseDto
{
    public int MediaStoreId { get; set; }
    public string Url { get; set; } = "";
    public string? Caption { get; set; }
}