using processing;
using processing.Service;
namespace hello{
    public class Worker(){
        public static void Main(){
            ProcessingFile obj=new ProcessingFile(new SaveLog());
            obj.Start();
        }
    }
}