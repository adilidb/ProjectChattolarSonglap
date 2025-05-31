public interface INewsService
{
    Task<NewsContent> CreateNewsAsync(NewsContent newsContent, IFormFile? thumbnail, List<IFormFile>? mediaItems);
    Task<NewsContent> GetNewsByIdAsync(int id);
    Task<IEnumerable<NewsContent>> GetAllNewsAsync();
    Task<NewsContent> UpdateNewsAsync(int id, NewsContent newsContent, IFormFile? thumbnail, List<IFormFile>? mediaItems);
    Task<IEnumerable<NewsContent>> GetNewsByCategoryIdAsync(int categoryId);

    Task<bool> DeleteNewsAsync(int id);
}