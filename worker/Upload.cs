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
using Polly.Retry;
using api;
using worker.Service;
using Microsoft.AspNetCore.Mvc;
using System.Numerics;

namespace worker
{
    public class Upload
    {
        ConnectionFactory factory ;
        private readonly SaveLog _savelog;
        private readonly LogService _logService;

        public Upload(SaveLog saveLog,LogService logService)
        {
            factory = new ConnectionFactory { HostName = "localhost" };
            _savelog = saveLog;
            _logService = logService ?? throw new ArgumentNullException(nameof(logService));;
        }

        public async void Start(){
            using var RabbitMQconnection = factory.CreateConnection();
            using var channel = RabbitMQconnection.CreateModel();
            channel.QueueDeclare(queue: "database_queue",
                                durable: false,
                                exclusive: false,
                                autoDelete: false,
                                arguments: null);
            
            channel.BasicQos(prefetchSize: 0, prefetchCount: 1, global: false);
            Console.WriteLine(" [*] Waiting for messages.");
            // var _retryPolicy = Policy
            //     .Handle<Exception>()
            //     .WaitAndRetryAsync(8, retryAttempt => {
            //             var timeToWait = TimeSpan.FromSeconds(6+1);
            //             Console.WriteLine($"Waiting {timeToWait.TotalSeconds} seconds");
            //             return timeToWait;
            //             });
            List<String>NotUploadedBatches = new List<string>();
            List<BatchUpload>Batches = new List<BatchUpload>();

            var _retryPolicy = Policy
                .Handle<Exception>()
                .WaitAndRetryAsync(8, retryAttempt => {
                        var timeToWait = TimeSpan.FromSeconds(7);
                        Console.WriteLine($"Waiting {timeToWait.TotalSeconds} seconds");
                        return timeToWait;
                        });
            var fallbackPolicy = Policy
            .Handle<Exception>()
            .FallbackAsync(async (context,ct) =>
            {
                if(context.ContainsKey("FallbackData")){
                    string fallbackData= context["FallbackData"] as string;
                    NotUploadedBatches.Add(fallbackData);
                }
            },async (exception, context) =>
            {
                Console.WriteLine($"Exception for fallback: {exception.Message}");
            });

            var _policyWrap = Policy.WrapAsync(fallbackPolicy, _retryPolicy);
            Log log = new();
            // var tcs = new TaskCompletionSource<Log>();
            var i =0;
            var consumer = new EventingBasicConsumer(channel);
            consumer.Received += async (model, ea) => {  
                var watch = System.Diagnostics.Stopwatch.StartNew();
                var body = ea.Body.ToArray();
                // Console.WriteLine(body);
                var m = Encoding.UTF8.GetString(body);
                var cmd = "";
                int totalNumberOfBatchesCreated = 0;
                // try{
                
                SendModel sm = System.Text.Json.JsonSerializer.Deserialize<SendModel>(m)!;
                cmd = Encoding.UTF8.GetString(sm.fileBytes);
                try{
                    var s = cmd.Split("|");
                    totalNumberOfBatchesCreated = Convert.ToInt32(s[1]);
                    Console.WriteLine($"All batches received {totalNumberOfBatchesCreated}");
                    cmd = s[0];
                }catch{

                }
                log = sm.log;
                // }catch(Exception e){
                //     cmd = m;
                // }
                cmd = cmd.Remove(cmd.Length-1);
                cmd += " ON DUPLICATE KEY UPDATE NAME=VALUES(NAME),COUNTRY=VALUES(COUNTRY),STATE=VALUES(STATE),CITY=VALUES(CITY),TELEPHONE=VALUES(TELEPHONE),AddressLine1=VALUES(AddressLine1),AddressLine2=VALUES(AddressLine2),DateOfBirth=VALUES(DateOfBirth),FY_2019_20=VALUES(FY_2019_20),FY_2020_21=VALUES(FY_2020_21),FY_2021_22=VALUES(FY_2021_22);";
                var contextData = new Context();
                // var cancellationToken = new CancellationTokenSource();
                await _policyWrap.ExecuteAsync(async (context) => {
                    
                    using(var connection = new MySqlConnection("Server=localhost;User=root;Password=zeus@123;Database=uploader;AllowLoadLocalInfile=true;Allow User Variables=true;Connection TImeout=150;MaxPoolSize=20")){
                        connection.Open();
                        // using var transaction = await connection.BeginTransactionAsync();
                            using (MySqlCommand myCmd = new MySqlCommand(cmd, connection)){
                                myCmd.CommandType = CommandType.Text;
                                int executedOrNot = await myCmd.ExecuteNonQueryAsync();
                                if(executedOrNot > 0){
                                    Batches.Add(new BatchUpload{
                                        isUploaded = true,
                                        BatchNumber = i++
                                    });
                                }
                            }
                        connection.Close();
                    }
                },contextData);
                // tcs.SetResult(log);
                logData(log,Batches,NotUploadedBatches,totalNumberOfBatchesCreated);
                watch.Stop();
                var elapsedMs = watch.ElapsedMilliseconds;
                Console.WriteLine($"Time takes: {elapsedMs/1000}s");
            };
            Console.WriteLine("Uploaded");
            

            channel.BasicConsume(queue: "database_queue",
                                autoAck: true,
                                consumer: consumer);

            Console.ReadLine();
        }

        private async void logData(Log log,List<BatchUpload>batches,List<String>NotUploadedBatches, int totalNumberOfBatchesCreated)
        {
            Console.WriteLine("Data Logging Started");
            Log? f = await _logService.GetAsync(log.fileId);
            if(f == null){
                Console.WriteLine("Inside if");
                log.NoOfBatchesCreated = 1;
                
                // log.BatchData.Add(new BatchUpload{
                //     isUploaded = true,
                //     BatchNumber = 1
                // });
                log.BatchData = batches;
                if(totalNumberOfBatchesCreated== log.NoOfBatchesCreated) {
                    Console.WriteLine("Inside");
                    log.status = "Uploaded";
                }
                log.NotUploaded = NotUploadedBatches;
                await _logService.CreateAsync(log);
            }else{
                Console.WriteLine("Inside else");
                // Console.WriteLine(log.NoOfBatchesCreated);
                // f.BatchData.Add(new BatchUpload{
                //     isUploaded = true,
                //     BatchNumber = f.BatchData.Count+1
                // });
                Log temp = new Log{
                    fileId = f.fileId,
                    fileName = f.fileName,
                    status = f.status,
                    totalNumberOfBatchesCreated = f.totalNumberOfBatchesCreated,
                    NoOfBatchesCreated = f.BatchData.Count,
                    BatchData = batches
                };
                // Console.WriteLine(temp.totalNumberOfBatchesCreated);
                // Console.WriteLine(temp.NoOfBatchesCreated);
                if(temp.totalNumberOfBatchesCreated == temp.NoOfBatchesCreated) {
                    Console.WriteLine("Inside");
                    temp.status = "Uploaded";
                }
                temp.NotUploaded = NotUploadedBatches;
                await _logService.UpdateAsync(log.fileName,temp);
            }
            Console.WriteLine("Data Logged");
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