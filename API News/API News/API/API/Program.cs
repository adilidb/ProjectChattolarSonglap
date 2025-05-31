using CloudinaryDotNet;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder => builder
            .WithOrigins("http://localhost:3000", "http://localhost:3001")
            .AllowAnyMethod()
            .AllowAnyHeader());
});

// DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Services
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IMediaUploadService, LocalFileUploadService>();
builder.Services.AddScoped<INewsService, NewsService>();

//Automapper
builder.Services.AddAutoMapper(typeof(Program));

builder.Services.AddHttpContextAccessor();

builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);

// Cloudinary config
var cloudinarySettings = builder.Configuration.GetSection("CloudinarySettings");
builder.Services.Configure<CloudinarySettings>(cloudinarySettings);
builder.Services.AddSingleton(x =>
{
    var acc = new Account(
        cloudinarySettings["CloudName"],
        cloudinarySettings["ApiKey"],
        cloudinarySettings["ApiSecret"]
    );
    return new Cloudinary(acc);
});

var app = builder.Build();

app.UseCors("AllowReactApp");
app.UseStaticFiles(); // This should already be there
app.UseSwagger();
app.UseSwaggerUI();
app.UseAuthorization();
app.MapControllers();
app.Run();
