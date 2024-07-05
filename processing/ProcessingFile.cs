using System;
using System.Collections.Generic;
using System.Linq;
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
        Log post;
        channel.QueueDeclare(queue: "process_queue",
            durable: false,
            exclusive: false,
            autoDelete: false,
            arguments: null);
        
        channel.QueueDeclare(queue: "object_queue",
            durable: false,
            exclusive: false,
            autoDelete: false,
            arguments: null);

        channel.BasicQos(prefetchSize: 0, prefetchCount: 1, global: false);

        Console.WriteLine(" [*] Waiting for file to Come");

        var consumer2 = new EventingBasicConsumer(channel);
        consumer2.Received +=  (model, ea) =>
        {
            Console.WriteLine("Object Recived");
            var fileBytes = ea.Body.ToArray();
            // Console.WriteLine(fileBytes);
            var postJson = Encoding.UTF8.GetString(fileBytes);
            post = System.Text.Json.JsonSerializer.Deserialize<Log>(postJson);
            _savelog.SetLog(post);
            Console.WriteLine(post?.IsUploaded);
        };
        channel.BasicConsume(queue: "object_queue",
                autoAck: true,
                consumer: consumer2);

        var consumer = new EventingBasicConsumer(channel);
        consumer.Received += async (model, ea) =>
        {
            Console.WriteLine("File Processing");
            var fileBytes = ea.Body.ToArray();
            // Console.WriteLine(fileBytes);
            using MemoryStream memoryStream = new MemoryStream(fileBytes);
            using StreamReader reader = new StreamReader(memoryStream, Encoding.UTF8);
            // Console.WriteLine(reader);
            await ParseFile(reader,_savelog.GetLog());
        };
        channel.BasicConsume(queue: "process_queue",
                autoAck: true,
                consumer: consumer);



        Console.WriteLine(" Press [enter] to exit.");
        Console.ReadLine();
    }
    private async Task<bool> ParseFile(StreamReader reader,Log log){
        StringBuilder command = new StringBuilder("INSERT INTO Users (Name,EmaiL,Country,State,City,Telephone,AddressLine1,AddressLine2,DateOfBirth,FY_2019_20,FY_2020_21,FY_2021_22) VALUES");
        // StringBuilder SalaryCommand = new StringBuilder("INSERT IGNORE INTO salary (SalaryId,FY_2019_20,FY_2020_21,FY_2021_22,UserId) VALUES");
        string startCmd = "INSERT INTO Users (Name,EmaiL,Country,State,City,Telephone,AddressLine1,AddressLine2,DateOfBirth,FY_2019_20,FY_2020_21,FY_2021_22) VALUES";

        
        const int batchSize = 1000;
        var added = 0;
        var batches = 0;
        while(reader.Peek() >= 0){
            // Console.WriteLine(reader.Peek());
            var result = await reader.ReadLineAsync();
            // Console.WriteLine(result+" ");
            var a = result?.Split(",");
            bool hasNullOrEmpty = a.Any(string.IsNullOrEmpty);
            
            if(!hasNullOrEmpty && result?.Length > 0){
                // var a = result?.Split(",");
                string add = $" ('{MySqlHelper.EscapeString(a[0])}','{MySqlHelper.EscapeString(a[1])}', '{MySqlHelper.EscapeString(a[2])}','{MySqlHelper.EscapeString(a[3])}','{MySqlHelper.EscapeString(a[4])}','{MySqlHelper.EscapeString(a[5])}','{MySqlHelper.EscapeString(a[6])}','{MySqlHelper.EscapeString(a[7])}','{DateTime.Parse(a[8]).ToString("yyyy-MM-dd")}','{a[9]}','{a[10]}','{a[11]}'),";
                // string salaryAdd = $" ('{start}','{a[9]}','{a[10]}','{a[11]}','{start}'),";
                command.Append(add);
                // SalaryCommand.Append(salaryAdd);
                added++;
            }
            if(added == batchSize || reader.Peek() <= 0){
                added = 0;
                string cmd = command.ToString();
                // string salaryCmd = SalaryCommand.ToString();
                // string  send = cmd+':'+salaryCmd;
                command = new StringBuilder("INSERT INTO Users (Name,EmaiL,Country,State,City,Telephone,AddressLine1,AddressLine2,DateOfBirth,FY_2019_20,FY_2020_21,FY_2021_22) VALUES");
                // SalaryCommand = new StringBuilder("INSERT IGNORE INTO salary (SalaryId,FY_2019_20,FY_2020_21,FY_2021_22,UserId) VALUES");
                // Console.WriteLine($"Batch {batches++} send");
                batches++;
                if(cmd != startCmd){
                    if(reader.Peek() <= 0){
                        log.NoOfBatchesCreated = batches;
                        log.IsReceivedByProcessor = true;
                        DatabaseSend(cmd,log);
                    }else{
                        DatabaseSend(cmd);
                    }
                }else{
                    Console.WriteLine("Nothing To send");
                }
            }
        }   
        Console.WriteLine("Complete Data Proceesed");
        // string cmd = command.ToString();
        // string salaryCmd = SalaryCommand.ToString();
        // string  send = cmd+':'+salaryCmd;
        // Console.WriteLine(send);
        // DatabaseSend(send);
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
        var message = JsonConvert.SerializeObject(log);
        var obj = Encoding.UTF8.GetBytes(message);

        channel.QueueDeclare(queue: "database_object_queue",
                durable: false,
                exclusive: false,
                autoDelete: false,
                arguments: null);
        
        channel.BasicQos(prefetchSize: 0, prefetchCount: 1, global: false);
        
        channel.BasicPublish(exchange: string.Empty,
                            routingKey: "database_queue",
                            body: body);
        channel.BasicPublish(exchange: string.Empty,
                            routingKey: "database_object_queue",
                            body: obj);
        
    }
    }
    
}