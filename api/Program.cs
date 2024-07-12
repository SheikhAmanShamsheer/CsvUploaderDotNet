
using api;
using api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MySqlConnector;
using worker.Service;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<LogDatabaseSetting>();
builder.Services.Configure<LogDatabaseSetting>(builder.Configuration.GetSection("LogDatabaseSettings"));

builder.Services.AddSingleton<LogDatabaseSetting>(sp =>
    sp.GetRequiredService<IOptions<LogDatabaseSetting>>().Value);
builder.Services.AddSingleton<LogService>();
builder.Logging.AddLog4Net("logs/log4net.config");
builder.Services.AddControllers().AddNewtonsoftJson(options =>{
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
});


builder.Services.AddDbContext<ApplicationDBContext>(options =>{
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection")));
    options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);

});

builder.Services.AddMySqlDataSource(builder.Configuration.GetConnectionString("DefaultConnection")!);


// if(args.Length!=0 &&  args[0] == "worker")
// {
//     UploadService obj=new UploadService();
//     Console.WriteLine("Inside worker if ");
//     await obj.uploadData();
// }
// else{
var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

    // app.UseHttpsRedirection();
app.MapControllers();
app.Run();
// }
// var app = builder.Build();
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
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

// app.UseHttpsRedirection();
// app.MapControllers();


// app.Run();