using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dto.User
{
    public class UserDto
    {
        public int Id {get;set;}
        public string? Name {get;set;}
        public string? Email {get;set;}
        public string? Country {get;set;}
        public string? State {get;set;}
        public string? City {get;set;}
        public string? Telephone {get;set;}
        public string? AddressLine1 {get;set;}
        public string? AddressLine2 {get;set;}
        public DateTime DateOfBirth {get;set;}
    }
}

// public async Task<IActionResult> UploadCsvFile(IFormFile file)
//         {
//             Console.WriteLine("Main idhar hun file");
//             // var res = false;
 
//                   async Task BulkToMySQLAsync(List<CsvModel> models)
//                 {
//                     // string ConnectionString = "server=192.168.1xxx";
//                     StringBuilder sCommand = new StringBuilder("REPLACE INTO csvdata (Id,EmailId,Name,Country,State,City,TelephoneNumber,AddressLine1,AddressLine2,DateOfBirth,FY2019_20,FY2020_21,FY2021_22,FY2022_23,FY2023_24) VALUES ");          
//                     String sCommand2 = sCommand.ToString();
//                     Console.WriteLine("Command is written");
//                     using (MySqlConnection mConnection = new MySqlConnection("server=localhost;port=3306;database=csvhandle;user=root;password=password;AllowUserVariables=true"))
//                     {
//                         Console.WriteLine("Connection is made1");
//                         List<string> Rows = new List<string>();
//                         for (int i = 0; i < 100000; i++)
//                         {
//                        Rows.Add(string.Format("('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}','{12}','{13}','{14}')",
//                         models[i].Id,
//                         MySqlHelper.EscapeString(models[i].EmailId),
//                         MySqlHelper.EscapeString(models[i].Name),
//                         MySqlHelper.EscapeString(models[i].Country),
//                         MySqlHelper.EscapeString(models[i].State),
//                         MySqlHelper.EscapeString(models[i].City),
//                         MySqlHelper.EscapeString(models[i].TelephoneNumber),
//                         MySqlHelper.EscapeString(models[i].AddressLine1),
//                         MySqlHelper.EscapeString(models[i].AddressLine2),
//                         models[i].DateOfBirth.ToString("yyyy-MM-dd"), // Assuming DateOfBirth is a DateTime
//                         models[i].FY2019_20,
//                         models[i].FY2020_21,
//                         models[i].FY2021_22,
//                         models[i].FY2022_23,
//                         models[i].FY2023_24
//                     ));
 
//                         }
//                         Console.WriteLine("Connection is made2");
//                         mConnection.Open();
//                     for(int i=0;i<Rows.Count;i+=BatchSize){
//                         sCommand.Append(string.Join(",", Rows.Skip(i).Take(BatchSize)));
//                         sCommand.Append(';');
//                         // Console.WriteLine("Connection is made3");
//                         // Console.WriteLine(sCommand.ToString());
//                         using (MySqlCommand myCmd = new(sCommand.ToString(), mConnection))
//                         {
//                             // Console.WriteLine("Connection is made4");
//                             myCmd.CommandType = CommandType.Text;
 
//                             // Console.WriteLine("Connection is made5");
//                             try{
//                                 await myCmd.ExecuteNonQueryAsync();
//                                 sCommand = new StringBuilder(sCommand2);
//                             }
//                             catch(Exception e){
//                                 Console.WriteLine(e.Message);
//                             }
//                             // Console.WriteLine("Command ran");
//                         }
                       
//                        int Progress = (int)((i/(double)BatchSize) + 1);
//                         await SendProgress(Progress);
 
//                     }
//                     }
//                 }
 
//             if (file == null || file.Length == 0)
//             {
//                 return BadRequest("No file uploaded.");
//             }
 
//             var filePath = Path.GetTempFileName();
 
//             try
//             {
//                 var stream = new MemoryStream();
//                 await file.CopyToAsync(stream);
//                 stream.Position = 0; // Reset the stream position to the beginning
 
 
//                 var models = new List<CsvModel>();
//                 // using StreamReader reader = new(file.OpenReadStream(), Encoding.UTF8);
 
//                 using (var reader = new StreamReader(stream))
//                 {
//                     string line;
//                     bool isHeader = true;
 
//                     while ((line = reader.ReadLine()) != null)
//                     {
//                         if (isHeader)
//                         {
//                             isHeader = false;
//                             continue;
//                         }
//                         try
//                         {
//                             models.Add(line.ToCsvData());
//                         }
//                         catch (Exception ex)
//                         {
//                             // Log the error and continue processing other lines
//                             Console.WriteLine($"Error parsing line: {line}. Exception: {ex.Message}");
//                         }
//                     }
//                 }
               
 
//                 int totalRecords = models.Count;
//                 Stopwatch st = new Stopwatch();
//                 st.Start();
             
//                     // const options = new Action<BulkConfig>();
 
//                     // await _context.BulkInsertAsync(models, options => options.BatchSize=5000);
//                     Console.WriteLine("I'm in the outer of Database");
//                     await BulkToMySQLAsync(models);                
//                 Console.WriteLine(st.Elapsed);
 
//                 return Ok(new { file.ContentType, file.Length, file.FileName });
//             }
//             catch (Exception ex)
//             {
//                 Console.WriteLine(ex.StackTrace);
//                 return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
//             }
//             finally
//             {
//                 if (System.IO.File.Exists(filePath))
//                 {
//                     System.IO.File.Delete(filePath);
//                 }
//             }
//         }
//     }
// }