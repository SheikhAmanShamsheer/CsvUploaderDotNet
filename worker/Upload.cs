using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using worker.Models;
using MySqlConnector;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Polly;
using processing.Service;
using api.Models;

namespace worker
{
    public class Upload
    {
        ConnectionFactory factory ;
        private readonly SaveLog _savelog;
        public Upload(SaveLog saveLog)
        {
            factory = new ConnectionFactory { HostName = "localhost" };
            _savelog = saveLog;
        }

        public void Start(){
            using var RabbitMQconnection = factory.CreateConnection();
            using var channel = RabbitMQconnection.CreateModel();
            channel.QueueDeclare(queue: "database_object_queue",
                                durable: false,
                                exclusive: false,
                                autoDelete: false,
                                arguments: null);
            channel.QueueDeclare(queue: "database_queue",
                                durable: false,
                                exclusive: false,
                                autoDelete: false,
                                arguments: null);
            
            channel.BasicQos(prefetchSize: 0, prefetchCount: 1, global: false);
            Console.WriteLine(" [*] Waiting for messages.");
            var _retryPolicy = Policy
                .Handle<Exception>()
                .WaitAndRetryAsync(3, retryAttempt => {
                        var timeToWait = TimeSpan.FromSeconds(10);
                        Console.WriteLine($"Waiting {timeToWait.TotalSeconds} seconds");
                        return timeToWait;
                        });
            var consumer2 = new EventingBasicConsumer(channel);
            consumer2.Received += (model, ea) =>
            {
                Console.WriteLine("Object Recived");
                var fileBytes = ea.Body.ToArray();
                // Console.WriteLine(fileBytes);
                var postJson = Encoding.UTF8.GetString(fileBytes);
                var post = System.Text.Json.JsonSerializer.Deserialize<Log>(postJson);
                // _savelog.SetLog(post);
                Console.WriteLine("worker "+post?.NoOfBatchesCreated);
            };
            

            var consumer = new EventingBasicConsumer(channel);
            consumer.Received += async (model, ea) => {  
                var watch = System.Diagnostics.Stopwatch.StartNew();
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);
                // var cmds = message.Split(':');
                var cmd = message;
                // var salaryCmd = cmds[1];
                // string name = cmds[2];
                // Console.WriteLine($"message recived");
                cmd = cmd.Remove(cmd.Length-1);
                cmd += " ON DUPLICATE KEY UPDATE NAME=VALUES(NAME),COUNTRY=VALUES(COUNTRY),STATE=VALUES(STATE),CITY=VALUES(CITY),TELEPHONE=VALUES(TELEPHONE),AddressLine1=VALUES(AddressLine1),AddressLine2=VALUES(AddressLine2),DateOfBirth=VALUES(DateOfBirth),FY_2019_20=VALUES(FY_2019_20),FY_2020_21=VALUES(FY_2020_21),FY_2021_22=VALUES(FY_2021_22);";
                // salaryCmd = salaryCmd.Remove(salaryCmd.Length-1);
                // salaryCmd += " ON DUPLICATE KEY UPDATE FY_2019_20=VALUES(FY_2019_20),FY_2020_21=VALUES(FY_2020_21),FY_2021_22=VALUES(FY_2021_22);";
                // Console.WriteLine(cmd);
                await _retryPolicy.ExecuteAsync(async () => {
                    using(var connection = new MySqlConnection("Server=localhost;User=root;Password=zeus@123;Database=uploader;AllowLoadLocalInfile=true;Allow User Variables=true;Connection TImeout=150;MaxPoolSize=20")){
                        connection.Open();
                            using (MySqlCommand myCmd = new MySqlCommand(cmd, connection)){
                            // Console.WriteLine("User querey started.");
                                myCmd.CommandType = CommandType.Text;
                                try{
                                    
                                        await myCmd.ExecuteNonQueryAsync();
                                    
                                    // channel.BasicAck(ea.DeliveryTag,false);
                                }catch(Exception e){
                                    Console.WriteLine(e.Message);
                                    // throw;
                                }
                            }
                        connection.Close();
                    }
                });  
                watch.Stop();
                var elapsedMs = watch.ElapsedMilliseconds;
                Console.WriteLine($"Time takes: {elapsedMs/1000}s");
                
            };
            // Console.WriteLine("Data Uploaded Successfully");
            channel.BasicConsume(queue: "database_object_queue",
                    autoAck: true,
                    consumer: consumer2);
                    
            channel.BasicConsume(queue: "database_queue",
                                autoAck: true,
                                consumer: consumer);

            Console.ReadLine();
        }
        private void RepublishMessage(IModel channel, string queueName, byte[] body){
            try{
                channel.BasicPublish(exchange: string.Empty,
                            routingKey: queueName,
                            body: body);
            }catch(Exception e){
                Console.WriteLine(e.Message);
            }
            
        }
    }
}

// try{
                                    //     Console.WriteLine("Requeued");
                                    //     channel.BasicPublish(exchange: string.Empty,
                                    //                 routingKey: "database_queue",
                                    //                 body: body);
                                    // }catch(Exception ex){
                                    //     Console.WriteLine(ex.Message);
                                    // }
                                    // channel.BasicAck(ea.DeliveryTag, false);