// using processing;
// using processing.Service;
// namespace hello{
//     public class Worker(){
//         public static void Main(){
//             ProcessingFile obj=new ProcessingFile(new SaveLog());
//             obj.Start();
//         }
//     }
// }

using Microsoft.Extensions.DependencyInjection;
using api;
using processing.Service;
using worker;
using worker.Service;
using processing;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;

public class Program
{
    public static async Task Main(string[] args)
    {
        var host = CreateHostBuilder(args).Build();

        // Resolve the Upload service and start it
        var uploadService = host.Services.GetRequiredService<ProcessingFile>();
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
                services.AddSingleton<ProcessingFile>();

                services.AddSingleton<LogService>(sp =>
                {
                    var settings = sp.GetRequiredService<IOptions<LogDatabaseSetting>>().Value;
                    return new LogService(settings);
                });
            });
            // .ConfigureLogging(builder =>{
            //     builder.AddLog4Net("logs/log4net.config");
            // });
}