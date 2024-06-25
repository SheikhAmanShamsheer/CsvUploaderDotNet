using System.Security.Cryptography.X509Certificates;
using api.Controllers;
using api.Data;
using api.Mappers;
using api.Models;
// using api.Repository;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers().AddNewtonsoftJson(options =>{
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
});


builder.Services.AddDbContext<ApplicationDBContext>(options =>{
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection")));
    options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);

});
builder.Services.AddMySqlDataSource(builder.Configuration.GetConnectionString("DefaultConnection")!);



var app = builder.Build();
// app.MapGet("/api/blog/{id}", async ([FromServices] MySqlDataSource db, int id) =>
// {
//     var repository = new CRUDRepository(db);
//     var result = await repository.FindOneAsync(id);
//     return result is null ? Results.NotFound() : Results.Ok(result.ToUserDto());
// });
// app.MapPost("/api/blog", async ([FromServices] MySqlDataSource db, [FromBody] User body) =>
// {
//     var repository = new CRUDRepository(db);
//     await repository.InsertAsync(body);
//     return body;
// });
// app.MapPost("/api/blog/upload", async ([FromServices] MySqlDataSource db, [FromBody] List<IFormFile> files,IWebHostEnvironment _env, HttpContext ctx) =>
// {
//     var repository = new CRUDRepository(db);
//     await repository.OnPostUploadAsync(files);
//     return "uploaded";
// });
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();


app.Run();