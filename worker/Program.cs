using processing.Service;
using worker;
namespace hello{
    public class Worker(){
        public static void Main(){
            Upload obj=new Upload(new SaveLog());
            obj.Start();
        }
    }
}






// using var connection = new MySqlConnection("Server=localhost;User=root;Password=zeus@123;Database=csv;AllowLoadLocalInfile=true;Connection Timeout=30");

// var factory = new ConnectionFactory { HostName = "localhost" };

