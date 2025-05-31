
using Microsoft.AspNetCore.Http;

public interface IMediaUploadService
{
    Task<MediaStore> UploadFileAsync(IFormFile file, string? caption = null);
    Task<bool> DeleteFileAsync(string publicId);
}
