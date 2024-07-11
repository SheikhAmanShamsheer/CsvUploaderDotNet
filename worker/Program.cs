// using api;
// using Microsoft.AspNetCore.Builder;
// using Microsoft.Extensions.DependencyInjection;
// using processing.Service;
// using worker;
// using worker.Service;


// // Add services to the container.

// namespace hello{
//     public class Worker(){
//         public static void Main(){
//             Upload obj=new Upload(new SaveLog(), new LogService(new LogDatabaseSetting()));
//             obj.Start();
//         }
//     }
// }






// // using var connection = new MySqlConnection("Server=localhost;User=root;Password=zeus@123;Database=csv;AllowLoadLocalInfile=true;Connection Timeout=30");

// // var factory = new ConnectionFactory { HostName = "localhost" };

using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using api;
using processing.Service;
using worker;
using worker.Service;
using Microsoft.Extensions.Options;

public class Program
{
    public static async Task Main(string[] args)
    {
        var host = CreateHostBuilder(args).Build();

        // Resolve the Upload service and start it
        var uploadService = host.Services.GetRequiredService<Upload>();
        uploadService.Start();

        // Keep the host running
        await host.RunAsync();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureServices((context, services) =>
            {
                services.Configure<LogDatabaseSetting>(context.Configuration.GetSection("LogDatabaseSettings"));

                services.AddSingleton<SaveLog>();
                services.AddSingleton<LogService>();
                services.AddSingleton<Upload>();

                services.AddSingleton<LogService>(sp =>
                {
                    var settings = sp.GetRequiredService<IOptions<LogDatabaseSetting>>().Value;
                    return new LogService(settings);
                });
            });
}

