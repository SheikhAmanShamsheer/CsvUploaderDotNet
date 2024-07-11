using System.Data;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Text.Json;
using api.Data;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Newtonsoft.Json;
using RabbitMQ.Client;


namespace api.Controllers
{
    [Route("api/user")]
    [ApiController]
    
    public class UserController : ControllerBase
    {

        private async Task<Salary> GetSalary(int id)
        {
            MySqlConnection connect = new MySqlConnection("Server=localhost;User=root;Password=zeus@123;Database=csv;AllowLoadLocalInfile=true");
            MySqlCommand cmd = new MySqlCommand($"SELECT * FROM salary WHERE userid={id}");
            cmd.CommandType = CommandType.Text;
            cmd.Connection = connect;
            connect.Open();
            try
            {
                MySqlDataReader dr;
                dr = cmd.ExecuteReader();
                while(dr.Read())
                {
                    Salary s = new Salary{
                        SalaryId=dr.GetInt32("userid"),
                        FY_2019_20=dr.GetInt64("fy_2019_20"),
                        FY_2020_21=dr.GetInt64("fy_2020_21"),
                        FY_2021_22=dr.GetInt64("fy_2021_22"),
                        UserId=dr.GetInt32("userid")
                    };
                    return s;
                }
                dr.Close();
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex);
            }
            finally
            {
                if(connect.State == ConnectionState.Open)
                {
                connect.Close();
                }
            }
            return new Salary();
        }
        [HttpGet]
        public async Task<IActionResult> GetALL()
        {
            MySqlConnection connect = new MySqlConnection("Server=localhost;User=root;Password=zeus@123;Database=csv;AllowLoadLocalInfile=true");
            MySqlCommand cmd = new MySqlCommand($"SELECT * FROM users LIMIT 20");
            MySqlCommand SalaryCmd = new MySqlCommand($"SELECT * FROM salary LIMIT 20");

            cmd.CommandType = CommandType.Text;
            cmd.Connection = connect;
            SalaryCmd.CommandType = CommandType.Text;
            SalaryCmd.Connection = connect;

            var userArray = new List<User>();
            connect.Open();
            try
            {
                MySqlDataReader dr;
                dr = cmd.ExecuteReader();
                while(dr.Read())
                {
                    User u = new User{
                        Id = dr.GetInt32("id"),
                        Name=dr.GetString("name"),
                        Email=dr.GetString("email"),
                        Country=dr.GetString("country"),
                        State=dr.GetString("state"),
                        City=dr.GetString("city"),
                        Telephone=dr.GetString("telephone"),
                        AddressLine1=dr.GetString("addressline1"),
                        AddressLine2=dr.GetString("addressline2"),
                        DateOfBirth=dr.GetDateTime("dateofbirth"),
                        Salary = await GetSalary(dr.GetInt32("id"))
                    };
                    userArray.Add(u);
                }
                dr.Close();
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex);
            }
            
            return userArray.Count > 0 ? Ok(userArray) : NoContent();
        }
        [HttpGet("{start:int}")]
        public async Task<IActionResult> GetPage([FromRoute] int start)
        {
            MySqlConnection connect = new MySqlConnection("Server=localhost;User=root;Password=zeus@123;Database=csv;AllowLoadLocalInfile=true");
            MySqlCommand cmd = new MySqlCommand($"SELECT * FROM users LIMIT 11 OFFSET {start-1}");
            cmd.CommandType = CommandType.Text;
            cmd.Connection = connect;

            var userArray = new List<User>();
            connect.Open();
            try
            {
                MySqlDataReader dr;
                dr = cmd.ExecuteReader();
                while(dr.Read())
                {
                    User u = new User{
                        Id = dr.GetInt32("id"),
                        Name=dr.GetString("name"),
                        Email=dr.GetString("email"),
                        Country=dr.GetString("country"),
                        State=dr.GetString("state"),
                        City=dr.GetString("city"),
                        Telephone=dr.GetString("telephone"),
                        AddressLine1=dr.GetString("addressline1"),
                        AddressLine2=dr.GetString("addressline2"),
                        DateOfBirth=dr.GetDateTime("dateofbirth"),
                        Salary = await GetSalary(dr.GetInt32("id"))
                    };
                    userArray.Add(u);
                }
                dr.Close();
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex);
            }
            return userArray.Count > 0 ? Ok(userArray) : BadRequest("No Data found");
        }

        [HttpGet("id/{id}")]
        public async Task<User> GetById([FromRoute] int id)
        {
            MySqlConnection connect = new MySqlConnection("Server=localhost;User=root;Password=zeus@123;Database=csv;AllowLoadLocalInfile=true");
            MySqlCommand cmd = new MySqlCommand($"SELECT * FROM users WHERE ID={id}");
            cmd.CommandType = CommandType.Text;
            cmd.Connection = connect;
            connect.Open();
            try
            {
                MySqlDataReader dr;
                dr = cmd.ExecuteReader();
                while(dr.Read())
                {
                    User u = new User{
                        Id = dr.GetInt32("id"),
                        Name=dr.GetString("name"),
                        Email=dr.GetString("email"),
                        Country=dr.GetString("country"),
                        State=dr.GetString("state"),
                        City=dr.GetString("city"),
                        Telephone=dr.GetString("telephone"),
                        AddressLine1=dr.GetString("addressline1"),
                        AddressLine2=dr.GetString("addressline2"),
                        DateOfBirth=dr.GetDateTime("dateofbirth"),
                        Salary=await GetSalary(dr.GetInt32("id"))
                    };
                    return u;
                }
                dr.Close();
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex);
            }
            finally
            {
                if(connect.State == ConnectionState.Open)
                {
                connect.Close();
                }
            }
            return new Models.User();
        }

        [HttpPost]
        public async Task<IActionResult> InsertAsync([FromBody] User user)
        {
            using var connection = new MySqlConnection("Server=localhost;User=root;Password=zeus@123;Database=csv;AllowLoadLocalInfile=true");
            await connection.OpenAsync();
            int count = await GetCount();
            count++;
            using var command = connection.CreateCommand();
            command.CommandText = $"INSERT INTO Users  VALUES ('{count}','{user.Name}','{user.Email}', '{user.Country}','{user.State}','{user.City}','{user.Telephone}','{user.AddressLine1}','{user.AddressLine2}','{user.DateOfBirth.ToString("yyyy-MM-dd")}');";
            int response = await command.ExecuteNonQueryAsync();
            return Ok("Posted");
        }
        // (Id,Name,Email,Country,State,City,Telephone,AddressLine1,AddressLine2,DateOfBirth)

        [HttpGet("count")]
        public  async Task<int> GetCount(){
            using var connection = new MySqlConnection("Server=localhost;User=root;Password=zeus@123;Database=csv;;AllowLoadLocalInfile=true");
            await connection.OpenAsync();
            var connStr = "Server=localhost;User=root;Password=zeus@123;Database=csv;AllowUserVariables=True;UseAffectedRows=False";
            string stmt = $"SELECT COUNT(*) FROM users";
            var count = 0;
            try
            {
                using (MySqlConnection thisConnection = new MySqlConnection(connStr))
                {
                    using (MySqlCommand cmdCount = new MySqlCommand(stmt, thisConnection))
                    {
                        thisConnection.Open();
                        count = Convert.ToInt32(cmdCount.ExecuteScalar());
                    }
                }
                return count;
            }
            catch (Exception ex)
            {
                Console.Write(ex);
                return 0;
            }
        }

        [HttpPost("upload-file")]
        public  IActionResult OnPostUploadAsync(List<IFormFile> files)
        {

            var factory = new ConnectionFactory { HostName = "localhost" };
            using var RabbitMQconnection = factory.CreateConnection();
            using var channel = RabbitMQconnection.CreateModel();
            // using Send.Models;
            channel.QueueDeclare(queue: "process_queue",
                    durable: false,
                    exclusive: false,
                    autoDelete: false,
                    arguments: null);
            
            channel.BasicQos(prefetchSize: 0, prefetchCount: 1, global: false);
            var NotUploaded = 0;
            var totalFiles = 0;
            foreach (var file in files){
                totalFiles++;
                if(file.ContentType == "text/csv"){
                    using var memoryStream = new MemoryStream();
                    file.CopyTo(memoryStream);
                    var name = file.FileName;
                    Console.WriteLine(name);
                    Log l = new Log{
                        fileName = file.FileName,
                        fileId = Guid.NewGuid().ToString(),
                        status = "Uploading"
                    };
                    
                    var fileBytes = memoryStream.ToArray();
                    SendModel sm = new SendModel{
                        fileBytes = fileBytes,
                        log = l,
                    };

                    var message = JsonConvert.SerializeObject(sm);
                    var body = Encoding.UTF8.GetBytes(message);
                    channel.BasicPublish(exchange: string.Empty,
                                            routingKey: "process_queue",
                                            body: body);
                }else{
                    NotUploaded++;
                }
                

            }
            if(NotUploaded > 0){
                return Ok($"{totalFiles-NotUploaded} Uploaded Out of {totalFiles}");
            }
            return Ok(files);
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateAsync([FromBody] User user){
            User u = await GetById(user.Id);
            
            return Ok("done");
        }

    }
}


// Sean Brown,norriskatherine@example.com,Djibouti,Iowa,Melissahaven,562-778-7503x9127,2969 Megan Common Apt. 530,Suite 544,2001-12-20,49462.41,32540.82,38040.07
// Vanessa Williams,mcmillanlarry@example.com,Syrian Arab Republic,Kentucky,New Cynthiachester,863-959-2616,50105 Parker Groves,Suite 529,1959-10-18,78860.45,54183.62,53372.1
// Michael Horn,fsantana@example.org,Vanuatu,Maine,North Kimberly,+1-701-530-1157x72780,0453 Williamson Drive Apt. 065,Apt. 117,1947-06-04,38139.95,98981.32,82054.88
// Daniel Herrera,hcampbell@example.org,Albania,Nebraska,Stephenborough,340-242-7794x478,1502 Deborah Route Apt. 824,Apt. 781,2001-07-17,57358.8,36918.79,82363.12
// Peter Kelley,showell@example.org,Syrian Arab Republic,Louisiana,Francismouth,686.964.9494,7774 Diaz Harbor Suite 871,Apt. 541,1962-04-09,68149.63,76914.31,79272.59
// Sheena Wilson,cliffordsmith@example.com,Kuwait,Kansas,Flemingland,+1-832-226-7632x9323,13694 Jasmine Crest Apt. 460,Apt. 471,1952-01-06,23675.92,85163.41,65273.73
// Brenda Anderson,rchan@example.com,Saint Helena,Indiana,Lindseyburgh,+1-393-653-5748x375,10757 Jones Ridges Suite 435,Suite 739,1979-06-08,73243.84,49111.33,26021.62
// Amy Clark,yboyle@example.net,Cocos (Keeling) Islands,West Virginia,East Cindybury,+1-618-238-5676x86706,7185 Joann Mount,Apt. 719,2004-06-26,99892.05,55205.06,36384.33
// Taylor Smith,nmcbride@example.net,Bangladesh,Connecticut,Finleyview,null,48309 Henry Mountains Suite 125,Apt. 903,2002-10-10,46805.73,40686.54,36620.0