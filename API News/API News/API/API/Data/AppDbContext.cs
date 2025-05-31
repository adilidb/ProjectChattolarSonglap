using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Category> Categories { get; set; }
    public DbSet<NewsContent> NewsContents { get; set; }
    public DbSet<MediaStore> MediaStores { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<NewsContent>()
            .HasOne(n => n.Thumbnail)
            .WithMany()
            .HasForeignKey(n => n.ThumbnailId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<MediaStore>()
            .HasOne(m => m.NewsContent)
            .WithMany(n => n.MediaItems)
            .HasForeignKey(m => m.NewsContentId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
