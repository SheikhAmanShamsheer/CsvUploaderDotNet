using System.Data;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using api.Data;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using Newtonsoft.Json;

namespace api.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly
        ApplicationDBContext _context;
        public UserController(ApplicationDBContext context)
        {
            _context = context;
        }

        private async Task<Salary> GetSalary(int id)
        {
            MySqlConnection connect = new MySqlConnection("Server=localhost;User=root;Password=zeus@123;Database=csv");
            MySqlCommand cmd = new MySqlCommand($"SELECT * FROM salary WHERE userid={id}");
            cmd.CommandType = CommandType.Text;
            cmd.Connection = connect;
            connect.Open();
            try
            {
                MySqlDataReader dr;
                dr = cmd.ExecuteReader();
                Console.WriteLine("count: ",dr.FieldCount.ToString());
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
            // var user = await _context.Users.ToListAsync();
            // var userDto = user.Select(s => s.ToUserDto());
            // return Ok(userDto);
            // using var connection = new MySqlConnection("Server=localhost;User=root;Password=zeus@123;Database=csv");
            // await connection.OpenAsync();
            // using var command = connection.CreateCommand();
            // // command.CommandText = @"INSERT INTO `Users` (`Name`,`Email`, `Country`,`State`,`City`,`Telephone`,`AddressLine1`,`AddressLine2`,`DateOfBirth`) VALUES (@name,@email, @country,@state,@city,@telephone,@addressline1,@addressline2,@dateofbirth);";
            // command.CommandText = $"SELECT * FROM Users;";
            // int response = await command.ExecuteNonQueryAsync();
            // return Ok(response);
            MySqlConnection connect = new MySqlConnection("Server=localhost;User=root;Password=zeus@123;Database=csv");
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
        [HttpGet("page")]
        public async Task<IActionResult> GetPage([FromRoute] int start)
        {
            // var user = await _context.Users.ToListAsync();
            // var userDto = user.Select(s => s.ToUserDto());
            // return Ok(userDto);
            // using var connection = new MySqlConnection("Server=localhost;User=root;Password=zeus@123;Database=csv");
            // await connection.OpenAsync();
            // using var command = connection.CreateCommand();
            // // command.CommandText = @"INSERT INTO `Users` (`Name`,`Email`, `Country`,`State`,`City`,`Telephone`,`AddressLine1`,`AddressLine2`,`DateOfBirth`) VALUES (@name,@email, @country,@state,@city,@telephone,@addressline1,@addressline2,@dateofbirth);";
            // command.CommandText = $"SELECT * FROM Users;";
            // int response = await command.ExecuteNonQueryAsync();
            // return Ok(response);
            Console.WriteLine(start);
            MySqlConnection connect = new MySqlConnection("Server=localhost;User=root;Password=zeus@123;Database=csv");
            MySqlCommand cmd = new MySqlCommand($"SELECT * FROM users LIMIT 20 OFFSET {start}");
            cmd.CommandType = CommandType.Text;
            cmd.Connection = connect;
            // Console.WriteLine("Command created");
            // SalaryCmd.CommandType = CommandType.Text;
            // SalaryCmd.Connection = connect;

            var userArray = new List<User>();
            connect.Open();
            try
            {
                MySqlDataReader dr;
                dr = cmd.ExecuteReader();
                // Console.WriteLine("Command executer started");

                while(dr.Read())
                {
                    // Console.WriteLine("New user created");

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
                    // Console.WriteLine(u.Name);
                    userArray.Add(u);
                }
                dr.Close();
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex);
            }
            Console.WriteLine(userArray.Count);
            return userArray.Count > 0 ? Ok(userArray) : NoContent();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            // var stock = await _context.Users.FirstOrDefaultAsync(i => i.Id == id);
            // if (stock == null)
            // {
            //     return NotFound();
            // }
            // return Ok(stock.ToUserDto());
            MySqlConnection connect = new MySqlConnection("Server=localhost;User=root;Password=zeus@123;Database=csv");
            MySqlCommand cmd = new MySqlCommand($"SELECT * FROM users WHERE ID={id}");
            cmd.CommandType = CommandType.Text;
            cmd.Connection = connect;
            connect.Open();
            try
            {
                MySqlDataReader dr;
                dr = cmd.ExecuteReader();
                // Console.WriteLine("count: ",dr.FieldCount.ToString());
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
                    return Ok(u);
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
            return NoContent();
        }

        [HttpPost]
        public async Task<IActionResult> InsertAsync([FromBody] User user)
        {
            using var connection = new MySqlConnection("Server=localhost;User=root;Password=zeus@123;Database=csv;AllowUserVariables=True;UseAffectedRows=False");
            await connection.OpenAsync();
            using var command = connection.CreateCommand();
            // command.CommandText = @"INSERT INTO `Users` (`Name`,`Email`, `Country`,`State`,`City`,`Telephone`,`AddressLine1`,`AddressLine2`,`DateOfBirth`) VALUES (@name,@email, @country,@state,@city,@telephone,@addressline1,@addressline2,@dateofbirth);";
            command.CommandText = $"INSERT INTO Users (Name,Email,Country,State,City,Telephone,AddressLine1,AddressLine2,DateOfBirth) VALUES ('{user.Name}','{user.Email}', '{user.Country}','{user.State}','{user.City}','{user.Telephone}','{user.AddressLine1}','{user.AddressLine2}','{user.DateOfBirth.ToString("yyyy-MM-dd")}');";
            int response = await command.ExecuteNonQueryAsync();
            return Ok("Posted");
        }

        [HttpGet("count")]
        public  async Task<int> GetCount(){
            using var connection = new MySqlConnection("Server=localhost;User=root;Password=zeus@123;Database=csv;AllowUserVariables=True;UseAffectedRows=False");
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
                        Console.Write("ran......");
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
        public  async Task<IActionResult> OnPostUploadAsync(List<IFormFile> files)
        {

            
            var watch = System.Diagnostics.Stopwatch.StartNew();
            // var ObjectArray = new List<User>();
            using var connection = new MySqlConnection("Server=localhost;User=root;Password=zeus@123;Database=csv;AllowUserVariables=True;UseAffectedRows=False");
            await connection.OpenAsync();
            using var commandCount = connection.CreateCommand();
            // command.CommandText = @"INSERT INTO `Users` (`Name`,`Email`, `Country`,`State`,`City`,`Telephone`,`AddressLine1`,`AddressLine2`,`DateOfBirth`) VALUES (@name,@email, @country,@state,@city,@telephone,@addressline1,@addressline2,@dateofbirth);";
            int start = await GetCount();
            start++;
            // using var command = connection.CreateCommand();
            // command.CommandText = "INSERT INTO Users (Name,EmaiL, Country,State,City,Telephone,AddressLine1,AddressLine2,DateOfBirth) VALUES";
            StringBuilder command = new StringBuilder("INSERT INTO Users (ID,Name,EmaiL,Country,State,City,Telephone,AddressLine1,AddressLine2,DateOfBirth) VALUES");
            StringBuilder SalaryCommand = new StringBuilder("INSERT IGNORE INTO salary (SalaryId,FY_2019_20,FY_2020_21,FY_2021_22,UserId) VALUES");
            foreach (var file in files)
            {
                var result = "";
                using (var reader = new StreamReader(file.OpenReadStream()))
                {   
                    try{
                        while(reader.Peek() >= 0){
                            result = await reader.ReadLineAsync();
                            var a = result?.Split(",");
                            // Console.WriteLine($"'{start}','{a[0]}','{a[1]}', '{a[2]}','{a[3]}','{a[4]}','{a[5]}','{a[6]}','{a[7]}','{a[9]}','{a[10]}','{a[11]}'");
                            string add = $" ('{start}','{a[0]}','{a[1]}', '{a[2]}','{a[3]}','{a[4]}','{a[5]}','{a[6]}','{a[7]}','{DateTime.Parse(a[8]).ToString("yyyy-MM-dd")}'),";
                            string salaryAdd = $" ('{start                                                                                                                                                                                                    }','{a[9]}','{a[10]}','{a[11]}','{start}'),";
                            command.Append(add);
                            SalaryCommand.Append(salaryAdd);
                            start++;
                        }                                                       
                        string cmd = command.ToString();
                        string salaryCmd = SalaryCommand.ToString();
                        cmd = cmd.Remove(cmd.Length-1);
                        cmd += " ON DUPLICATE KEY UPDATE NAME=VALUES(NAME),COUNTRY=VALUES(COUNTRY),STATE=VALUES(STATE),CITY=VALUES(CITY),TELEPHONE=VALUES(TELEPHONE),AddressLine1=VALUES(AddressLine1),AddressLine2=VALUES(AddressLine2),DateOfBirth=VALUES(DateOfBirth);";
                        // 
                        salaryCmd = salaryCmd.Remove(salaryCmd.Length-1);
                        salaryCmd += " ON DUPLICATE KEY UPDATE FY_2019_20=VALUES(FY_2019_20),FY_2020_21=VALUES(FY_2020_21),FY_2021_22=VALUES(FY_2021_22);";
                        // 
                        // Console.WriteLine(cmd);
                        // Console.WriteLine(salaryCmd);

                        using (MySqlCommand myCmd = new MySqlCommand(cmd, connection))
                        {
                            myCmd.CommandType = CommandType.Text;
                            myCmd.ExecuteNonQuery();
                            Console.WriteLine("User querey executed.");
                        }
                        using (MySqlCommand myCmd = new MySqlCommand(salaryCmd, connection))
                        {
                            myCmd.CommandType = CommandType.Text;
                            myCmd.ExecuteNonQuery();
                            Console.WriteLine("Salary querey executed.");

                        }
                    }catch(Exception e){
                        Console.Write("Error: "+e);
                    }
                    
                }
            }
            watch.Stop();
            var elapsedMs = watch.ElapsedMilliseconds;
            Console.WriteLine($"Time takes: {elapsedMs/1000}s");
            return Ok("Uploaded");
        }
    }
}
// ON DUPLICATE KEY UPDATE FY_2019_20='{a[9]}',FY_2020_21='{a[10]}',FY_2021_22='{a[11]}
//  ON DUPLICATE KEY UPDATE NAME='{a[0]}',EMAIL='{a[1]}', COUNTRY='{a[2]}',STATE='{a[3]}',CITY='{a[4]}',TELEPHONE='{a[5]}',ADDRESSLINE1='{a[6]}',ADDRESSLINE2='{a[7]}',DateOfBirth='{DateTime.Parse(a[8]).ToString("yyyy-MM-dd")}'