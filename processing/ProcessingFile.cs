using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
// using System.Text.Json;
using System.Threading.Tasks;
using api.Models;
using Microsoft.Extensions.Logging;
using MySqlConnector;
using Newtonsoft.Json;
using processing.Service;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
namespace processing
{
    public class ProcessingFile{
        ConnectionFactory factory;
        private readonly SaveLog _savelog;
        public ProcessingFile(SaveLog saveLog){
            factory = new ConnectionFactory { HostName = "localhost" };
            _savelog = saveLog;
        }


    public void Start(){
        var connection = factory.CreateConnection();
        var channel = connection.CreateModel();
        channel.QueueDeclare(queue: "process_queue",
            durable: false,
            exclusive: false,
            autoDelete: false,
            arguments: null);

        channel.BasicQos(prefetchSize: 0, prefetchCount: 1, global: false);

        Console.WriteLine(" [*] Waiting for file to Come");

        var consumer = new EventingBasicConsumer(channel);
        consumer.Received += async (model, ea) =>
        {
            Console.WriteLine("File Processing");
            var fileBytes = ea.Body.ToArray();
            var m = Encoding.UTF8.GetString(fileBytes);
            SendModel sm = System.Text.Json.JsonSerializer.Deserialize<SendModel>(m)!;
            using MemoryStream memoryStream = new MemoryStream(sm.fileBytes);
            using StreamReader reader = new StreamReader(memoryStream, Encoding.UTF8);
            await ParseFile(reader,sm.log);
        };
        channel.BasicConsume(queue: "process_queue",
                autoAck: true,
                consumer: consumer);

        Console.WriteLine(" Press [enter] to exit.");
        Console.ReadLine();
    }
    private async Task<bool> ParseFile(StreamReader reader,Log log){
        StringBuilder command = new StringBuilder("INSERT INTO Users (Name,EmaiL,Country,State,City,Telephone,AddressLine1,AddressLine2,DateOfBirth,FY_2019_20,FY_2020_21,FY_2021_22) VALUES");
        string startCmd = "INSERT INTO Users (Name,EmaiL,Country,State,City,Telephone,AddressLine1,AddressLine2,DateOfBirth,FY_2019_20,FY_2020_21,FY_2021_22) VALUES";

        const int batchSize = 1000;
        var added = 0;
        var batches = 0;
        while(reader.Peek() >= 0){
            // Console.WriteLine(reader.Peek());
            var result = await reader.ReadLineAsync();
            // Console.WriteLine(result+" ");
            var a = result?.Split(",");
            bool hasNullOrEmpty = a!.Any(string.IsNullOrEmpty);
            
            if(!hasNullOrEmpty && result?.Length > 0){
                // var a = result?.Split(",");
                string add = $" ('{MySqlHelper.EscapeString(a![0])}','{MySqlHelper.EscapeString(a[1])}', '{MySqlHelper.EscapeString(a[2])}','{MySqlHelper.EscapeString(a[3])}','{MySqlHelper.EscapeString(a[4])}','{MySqlHelper.EscapeString(a[5])}','{MySqlHelper.EscapeString(a[6])}','{MySqlHelper.EscapeString(a[7])}','{DateTime.Parse(a[8]).ToString("yyyy-MM-dd")}','{a[9]}','{a[10]}','{a[11]}'),";
                // string salaryAdd = $" ('{start}','{a[9]}','{a[10]}','{a[11]}','{start}'),";
                command.Append(add);
                // SalaryCommand.Append(salaryAdd);
                added++;
            }
            if(added == batchSize || reader.Peek() <= 0){
                // Console.WriteLine($"batch {added}");
                added = 0;
                string cmd = command.ToString();
                // string salaryCmd = SalaryCommand.ToString();
                // string  send = cmd+':'+salaryCmd;
                command = new StringBuilder("INSERT INTO Users (Name,EmaiL,Country,State,City,Telephone,AddressLine1,AddressLine2,DateOfBirth,FY_2019_20,FY_2020_21,FY_2021_22) VALUES");
                // SalaryCommand = new StringBuilder("INSERT IGNORE INTO salary (SalaryId,FY_2019_20,FY_2020_21,FY_2021_22,UserId) VALUES");
                // Console.WriteLine($"Batch {batches++} send");
                batches++;
                // if(cmd != startCmd){
                if(reader.Peek() <= 0){
                    // log.totalNumberOfBatchesCreated = batches;
                    cmd = $"{cmd}|{batches}";
                }
                DatabaseSend(cmd,log);
                // }else{
                //     Console.WriteLine("Nothing To send");
                // }
            }
        }   
        Console.WriteLine("Complete Data Proceesed");
        return true;
    }
    private void DatabaseSend(string send){
        // Console.WriteLine("data send");
        var connection = factory.CreateConnection();
        var channel = connection.CreateModel();
        channel.QueueDeclare(queue: "database_queue",
            durable: false,
            exclusive: false,
            autoDelete: false,
            arguments: null);
        var body = Encoding.UTF8.GetBytes(send);
        
        channel.BasicPublish(exchange: string.Empty,
                            routingKey: "database_queue",
                            body: body);
        
    }
    private void DatabaseSend(string send,Log log){
        // Console.WriteLine("data send");
        var connection = factory.CreateConnection();
        var channel = connection.CreateModel();
        channel.QueueDeclare(queue: "database_queue",
            durable: false,
            exclusive: false,
            autoDelete: false,
            arguments: null);
        var body = Encoding.UTF8.GetBytes(send);
        SendModel sdm = new SendModel{
            fileBytes = body,
            log = log
        };
        var message = JsonConvert.SerializeObject(sdm);
        var obj = Encoding.UTF8.GetBytes(message);
        channel.BasicQos(prefetchSize: 0, prefetchCount: 1, global: false);
        
        channel.BasicPublish(exchange: string.Empty,
                            routingKey: "database_queue",
                            body: obj);
        
    }
    }
    
}