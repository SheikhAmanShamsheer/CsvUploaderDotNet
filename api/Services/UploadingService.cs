using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using api.Models;
using MySqlConnector;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace api.Services
{
    public class UploadService
    {
        public async Task<bool> uploadData(){
            var watch = System.Diagnostics.Stopwatch.StartNew();

            using var connection = new MySqlConnection("Server=localhost;User=root;Password=zeus@123;Database=csv;AllowUserVariables=True;UseAffectedRows=False");
            await connection.OpenAsync();
            var factory = new ConnectionFactory { HostName = "localhost" };
            using var RabbitMQconnection = factory.CreateConnection();
            using var channel = RabbitMQconnection.CreateModel();

            
            channel.QueueDeclare(queue: "hello",
                                durable: false,
                                exclusive: false,
                                autoDelete: false,
                                arguments: null);

            Console.WriteLine(" [*] Waiting for messages.");

            var consumer = new EventingBasicConsumer(channel);
            consumer.Received += (model, ea) => {  
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);
                // Console.WriteLine(message);
                var cmds = message.Split(':');
                var cmd = cmds[0];
                var salaryCmd = cmds[1];
                // Console.Write($"message recived: {cmd}");
                cmd = cmd.Remove(cmd.Length-1);
                cmd += " ON DUPLICATE KEY UPDATE NAME=VALUES(NAME),COUNTRY=VALUES(COUNTRY),STATE=VALUES(STATE),CITY=VALUES(CITY),TELEPHONE=VALUES(TELEPHONE),AddressLine1=VALUES(AddressLine1),AddressLine2=VALUES(AddressLine2),DateOfBirth=VALUES(DateOfBirth);";
                salaryCmd = salaryCmd.Remove(salaryCmd.Length-1);
                salaryCmd += " ON DUPLICATE KEY UPDATE FY_2019_20=VALUES(FY_2019_20),FY_2020_21=VALUES(FY_2020_21),FY_2021_22=VALUES(FY_2021_22);";
                // Console.WriteLine(cmd);
                // Console.WriteLine(salaryCmd);
                using (MySqlCommand myCmd = new MySqlCommand(cmd, connection))
                {
                    Console.WriteLine("User querey started.");
                    myCmd.CommandType = CommandType.Text;
                    myCmd.ExecuteNonQuery();
                    Console.WriteLine("User querey executed.");
                }
                using (MySqlCommand myCmd = new MySqlCommand(salaryCmd, connection))
                {
                    Console.WriteLine("Salary querey executed.");
                    myCmd.CommandType = CommandType.Text;
                    myCmd.ExecuteNonQuery();
                    Console.WriteLine("Salary querey executed.");
                }
                Console.WriteLine($"Uploaded");
            };
            channel.BasicConsume(queue: "hello",
                                autoAck: true,
                                consumer: consumer);
            Console.ReadLine();
            watch.Stop();
            var elapsedMs = watch.ElapsedMilliseconds;
            Console.WriteLine($"Time takes: {elapsedMs/1000}s");
            return true;
        }
    }
}