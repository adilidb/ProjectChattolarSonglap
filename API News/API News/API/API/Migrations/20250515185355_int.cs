using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class @int : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.CategoryId);
                });

            migrationBuilder.CreateTable(
                name: "MediaStores",
                columns: table => new
                {
                    MediaStoreId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PublicId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Caption = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NewsContentId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MediaStores", x => x.MediaStoreId);
                });

            migrationBuilder.CreateTable(
                name: "NewsContents",
                columns: table => new
                {
                    NewsContentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Body = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PublishedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    ThumbnailId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NewsContents", x => x.NewsContentId);
                    table.ForeignKey(
                        name: "FK_NewsContents_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "CategoryId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NewsContents_MediaStores_ThumbnailId",
                        column: x => x.ThumbnailId,
                        principalTable: "MediaStores",
                        principalColumn: "MediaStoreId",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MediaStores_NewsContentId",
                table: "MediaStores",
                column: "NewsContentId");

            migrationBuilder.CreateIndex(
                name: "IX_NewsContents_CategoryId",
                table: "NewsContents",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_NewsContents_ThumbnailId",
                table: "NewsContents",
                column: "ThumbnailId");

            migrationBuilder.AddForeignKey(
                name: "FK_MediaStores_NewsContents_NewsContentId",
                table: "MediaStores",
                column: "NewsContentId",
                principalTable: "NewsContents",
                principalColumn: "NewsContentId",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MediaStores_NewsContents_NewsContentId",
                table: "MediaStores");

            migrationBuilder.DropTable(
                name: "NewsContents");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "MediaStores");
        }
    }
}
