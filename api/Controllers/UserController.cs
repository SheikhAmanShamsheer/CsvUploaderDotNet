using System.Text;
using api.Data;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace api.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        public UserController(ApplicationDBContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<IActionResult> GetALL()
        {
            var user = await _context.Users.ToListAsync();
            var userDto = user.Select(s => s.ToUserDto());
            return Ok(userDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var stock = await _context.Users.FirstOrDefaultAsync(i => i.Id == id);
            // Console.WriteLine("stock"+stock.CompanyName);
            if (stock == null)
            {
                return NotFound();
            }
            return Ok(stock.ToUserDto());
        }

        public class UserA{
            public User ReturnUser(string result){
                var a = result?.Split(",");
                // for(int i=0;i<a?.Length;i++){
                DateTime enteredDate = DateTime.Parse(a[8]);
                User u = new User
                {
                    Name = a[0],
                    Email = a[1],
                    Country = a[2],
                    State = a[3],
                    City = a[4],
                    Telephone = a[5],
                    AddressLine1 = a[6],
                    AddressLine2 = a[7],
                    DateOfBirth = enteredDate
                };
                return u;
            }
        }
        
                // result.Append(await reader.ReadLineAsync())

        [HttpPost("upload-file")]
        public  async Task<IActionResult> OnPostUploadAsync(List<IFormFile> files)
        {
            
            var watch = System.Diagnostics.Stopwatch.StartNew();
            var ObjectArray = new List<User>();
            foreach (var file in files)
            {
                // var result = new StringBuilder();
                var result = "";
                // using (FileStream fs = File.Open(path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
                // using (BufferedStream bs = new BufferedStream(fs))
                // using (var reader = new StreamReader(new FileStream(file.FileName, FileMode.Open, FileAccess.Read, FileShare.Read, 4096, FileOptions.Asynchronous)))
                using (var reader = new StreamReader(file.OpenReadStream()))
                {
                    while(reader.Peek() >= 0){
                        result = await reader.ReadLineAsync();
                        var a = result?.Split(",");
                        DateTime enteredDate = DateTime.Parse(a[8]);
                        User u = new User
                        {
                            Name = a[0],
                            Email = a[1],
                            Country = a[2],
                            State = a[3],
                            City = a[4],
                            Telephone = a[5],
                            AddressLine1 = a[6],
                            AddressLine2 = a[7],
                            DateOfBirth = enteredDate
                        };
                        ObjectArray.Add(u);                        
                    }
                    await _context.Users.BulkInsertAsync(ObjectArray);
                    await _context.SaveChangesAsync();
                }
                // var data = result.ToString().Split('\n');
                // var ObjectArray = new List<User>();
                // Console.WriteLine(data.Length);
                // for (int i = 0; i < data.Length - 1; i++)
                // {
                //     var a = data[i].Split(",");
                //     // Console.WriteLine($"Running... {i}");
                //     // Console.WriteLine($" {a[0]} {a[1]} {a[2]} {a[3]} {a[4]} {a[5]} {a[6]} {a[7]} {a[8]}");
                //     DateTime enteredDate = DateTime.Parse(a[8]);
                //     User u = new User
                //     {
                //         Name = a[0],
                //         Email = a[1],
                //         Country = a[2],
                //         State = a[3],
                //         City = a[4],
                //         Telephone = a[5],
                //         AddressLine1 = a[6],
                //         AddressLine2 = a[7],
                //         DateOfBirth = enteredDate
                //     };
                //     ObjectArray.Add(u);
                // }
                // Parallel.For(0,data.Length-1,i=>{
                //     var a = data[i].Split(",");
                //     // Console.WriteLine($"Running... {i}");
                //     // Console.WriteLine($" {a[0]} {a[1]} {a[2]} {a[3]} {a[4]} {a[5]} {a[6]} {a[7]} {a[8]}");
                //     DateTime enteredDate = DateTime.Parse(a[8]);
                //     User u = new User
                //     {
                //         Name = a[0],
                //         Email = a[1],
                //         Country = a[2],
                //         State = a[3],
                //         City = a[4],
                //         Telephone = a[5],
                //         AddressLine1 = a[6],
                //         AddressLine2 = a[7],
                //         DateOfBirth = enteredDate
                //     };
                //     ObjectArray.Add(u);
                // });
            }
            watch.Stop();
            var elapsedMs = watch.ElapsedMilliseconds;
            Console.WriteLine($"Total time taken: {elapsedMs/1000}s");
            return Ok("Uploaded");
        }
    }
}