using AutoMapper;
using Microsoft.AspNetCore.Mvc;



[ApiController]
[Route("api/[controller]")]
public class NewsController : ControllerBase
{
    private readonly INewsService _newsService;
    private readonly IMapper _mapper;
    private readonly ILogger<NewsController> _logger;

    public NewsController(
        INewsService newsService,
        IMapper mapper,
        ILogger<NewsController> logger)
    {
        _newsService = newsService;
        _mapper = mapper;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<NewsResponseDto>>> GetAllNews()
    {
        var news = await _newsService.GetAllNewsAsync();
        return Ok(_mapper.Map<IEnumerable<NewsResponseDto>>(news));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<NewsResponseDto>> GetNewsById(int id)
    {
        var news = await _newsService.GetNewsByIdAsync(id);
        if (news == null)
            return NotFound();

        return Ok(_mapper.Map<NewsResponseDto>(news));
    }


    [HttpPost]
    public async Task<ActionResult<NewsResponseDto>> CreateNews([FromForm] CreateNewsDto createNewsDto)
    {
        try
        {
            var newsContent = _mapper.Map<NewsContent>(createNewsDto);

            var createdNews = await _newsService.CreateNewsAsync(
                newsContent,
                createNewsDto.Thumbnail,
                createNewsDto.MediaItems?.ToList());

            var result = _mapper.Map<NewsResponseDto>(createdNews);
            return CreatedAtAction(nameof(GetNewsById), new { id = result.NewsContentId }, result);
        }
        catch (AutoMapperMappingException ex)
        {
            _logger.LogError(ex, "Mapping failed in CreateNews");
            return BadRequest("Invalid data format");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating news");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("category/{categoryId}")]
    public async Task<ActionResult<IEnumerable<NewsResponseDto>>> GetNewsByCategory(int categoryId)
    {
        var newsList = await _newsService.GetNewsByCategoryIdAsync(categoryId);
        if (newsList == null || !newsList.Any())
            return NotFound($"No news found for category ID {categoryId}");

        return Ok(_mapper.Map<IEnumerable<NewsResponseDto>>(newsList));
    }


    [HttpPut("{id}")]
    public async Task<ActionResult<NewsResponseDto>> UpdateNews(int id, [FromForm] UpdateNewsDto updateNewsDto)
    {
        try
        {
            var newsContent = _mapper.Map<NewsContent>(updateNewsDto);

            var updatedNews = await _newsService.UpdateNewsAsync(
                id,
                newsContent,
                updateNewsDto.Thumbnail,
                updateNewsDto.MediaItems?.ToList());

            if (updatedNews == null)
            {
                _logger.LogWarning("News with ID {Id} not found for update", id);
                return NotFound();
            }

            return Ok(_mapper.Map<NewsResponseDto>(updatedNews));
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogError(ex, "News not found during update");
            return NotFound();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating news with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNews(int id)
    {
        try
        {
            var result = await _newsService.DeleteNewsAsync(id);
            if (!result)
            {
                _logger.LogWarning("News with ID {Id} not found for deletion", id);
                return NotFound();
            }

            _logger.LogInformation("News with ID {Id} deleted successfully", id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting news with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }
}