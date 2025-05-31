using AutoMapper;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // NewsContent mappings
        CreateMap<CreateNewsDto, NewsContent>()
            .ForMember(dest => dest.MediaItems, opt => opt.Ignore()) // Will be handled separately
            .ForMember(dest => dest.Thumbnail, opt => opt.Ignore()); // Will be handled separately

        CreateMap<UpdateNewsDto, NewsContent>()
            .ForMember(dest => dest.MediaItems, opt => opt.Ignore())
            .ForMember(dest => dest.Thumbnail, opt => opt.Ignore());

        // ✅ Corrected Mapping (Only once)
        CreateMap<NewsContent, NewsResponseDto>()
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name));

        // Response mappings
        CreateMap<MediaStore, MediaResponseDto>();
    }
}
