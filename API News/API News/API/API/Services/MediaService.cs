using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using Microsoft.EntityFrameworkCore;

public class LocalFileUploadService : IMediaUploadService
{
    private readonly IWebHostEnvironment _env;
    private readonly IConfiguration _config;

    public LocalFileUploadService(IWebHostEnvironment env, IConfiguration config)
    {
        _env = env;
        _config = config;
    }

    public async Task<MediaStore> UploadFileAsync(IFormFile file, string? caption = null)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("File is empty");

        // Create uploads directory if it doesn't exist
        var uploadsDir = Path.Combine(_env.WebRootPath, "uploads");
        Directory.CreateDirectory(uploadsDir);

        // Generate unique filename
        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(uploadsDir, fileName);

        // Save file to disk
        await using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        // Return media information
        return new MediaStore
        {
            Url = $"/uploads/{fileName}",
            PublicId = filePath, // Storing full path for deletion
            Caption = caption
        };
    }

    public Task<bool> DeleteFileAsync(string filePath)
    {
        if (string.IsNullOrEmpty(filePath) || !File.Exists(filePath))
            return Task.FromResult(false);

        try
        {
            File.Delete(filePath);
            return Task.FromResult(true);
        }
        catch
        {
            return Task.FromResult(false);
        }
    }
}

public class NewsService : INewsService
{
    private readonly AppDbContext _context;
    private readonly IMediaUploadService _uploadService;

    public NewsService(AppDbContext context, IMediaUploadService uploadService)
    {
        _context = context;
        _uploadService = uploadService;
    }

    public async Task<NewsContent> CreateNewsAsync(NewsContent newsContent, IFormFile? thumbnail, List<IFormFile>? mediaItems)
    {
        // Upload thumbnail if exists
        if (thumbnail != null)
        {
            var thumbnailMedia = await _uploadService.UploadFileAsync(thumbnail);
            _context.MediaStores.Add(thumbnailMedia);
            await _context.SaveChangesAsync();

            newsContent.ThumbnailId = thumbnailMedia.MediaStoreId;
        }

        // Upload media items if exist
        if (mediaItems != null && mediaItems.Any())
        {
            newsContent.MediaItems = new List<MediaStore>();

            foreach (var mediaItem in mediaItems)
            {
                var media = await _uploadService.UploadFileAsync(mediaItem);
                media.NewsContentId = newsContent.NewsContentId;
                newsContent.MediaItems.Add(media);
            }
        }

        newsContent.PublishedDate = DateTime.UtcNow;
        _context.NewsContents.Add(newsContent);
        await _context.SaveChangesAsync();

        return newsContent;
    }

    public async Task<IEnumerable<NewsContent>> GetAllNewsAsync()
    {
        return await _context.NewsContents
            .Include(n => n.Category)
            .Include(n => n.Thumbnail)
            .Include(n => n.MediaItems)
            .OrderByDescending(n => n.PublishedDate)
            .ToListAsync();
    }

    public async Task<NewsContent> GetNewsByIdAsync(int id)
    {
        return await _context.NewsContents
            .Include(n => n.Category)
            .Include(n => n.Thumbnail)
            .Include(n => n.MediaItems)
            .FirstOrDefaultAsync(n => n.NewsContentId == id);
    }

    public async Task<NewsContent> UpdateNewsAsync(int id, NewsContent newsContent, IFormFile? thumbnail, List<IFormFile>? mediaItems)
    {
        var existingNews = await _context.NewsContents
            .Include(n => n.Thumbnail)
            .Include(n => n.MediaItems)
            .FirstOrDefaultAsync(n => n.NewsContentId == id);

        if (existingNews == null)
            throw new KeyNotFoundException("News not found");

        // Update basic properties
        existingNews.Title = newsContent.Title;
        existingNews.Body = newsContent.Body;
        existingNews.CategoryId = newsContent.CategoryId;

        // Handle thumbnail update
        if (thumbnail != null)
        {
            // Delete old thumbnail if exists
            if (existingNews.Thumbnail != null)
            {
                await _uploadService.DeleteFileAsync(existingNews.Thumbnail.PublicId);
                _context.MediaStores.Remove(existingNews.Thumbnail);
            }

            // Upload new thumbnail
            var thumbnailMedia = await _uploadService.UploadFileAsync(thumbnail);
            _context.MediaStores.Add(thumbnailMedia);
            await _context.SaveChangesAsync();

            existingNews.ThumbnailId = thumbnailMedia.MediaStoreId;
        }

        // Handle media items addition
        if (mediaItems != null && mediaItems.Any())
        {
            existingNews.MediaItems ??= new List<MediaStore>();

            foreach (var mediaItem in mediaItems)
            {
                var media = await _uploadService.UploadFileAsync(mediaItem);
                media.NewsContentId = existingNews.NewsContentId;
                existingNews.MediaItems.Add(media);
            }
        }

        _context.Entry(existingNews).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return existingNews;
    }

    public async Task<IEnumerable<NewsContent>> GetNewsByCategoryIdAsync(int categoryId)
    {
        return await _context.NewsContents
            .Include(n => n.Category)
            .Include(n => n.Thumbnail)
            .Include(n => n.MediaItems)
            .Where(n => n.CategoryId == categoryId)
            .OrderByDescending(n => n.NewsContentId)
            .ToListAsync();
    }


    public async Task<bool> DeleteNewsAsync(int id)
    {
        var news = await _context.NewsContents
            .Include(n => n.Thumbnail)
            .Include(n => n.MediaItems)
            .FirstOrDefaultAsync(n => n.NewsContentId == id);

        if (news == null)
            return false;

        try
        {
            // Delete thumbnail if exists
            if (news.Thumbnail != null)
            {
                var thumbDeleted = await _uploadService.DeleteFileAsync(news.Thumbnail.PublicId);
                if (thumbDeleted)
                {
                    _context.MediaStores.Remove(news.Thumbnail);
                }
            }

            // Delete media items if exist
            if (news.MediaItems != null && news.MediaItems.Any())
            {
                foreach (var media in news.MediaItems)
                {
                    var mediaDeleted = await _uploadService.DeleteFileAsync(media.PublicId);
                    if (mediaDeleted)
                    {
                        _context.MediaStores.Remove(media);
                    }
                }
            }

            _context.NewsContents.Remove(news);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error deleting news: {ex.Message}");
            return false;
        }
    }
}