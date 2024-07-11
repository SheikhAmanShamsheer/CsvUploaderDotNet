using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Log
    {
        public string fileName {get;set;}
        public string fileId {get;set;}
        public string status {get;set;}
        public int NoOfBatchesCreated {get;set;}
        public int totalNumberOfBatchesCreated {get;set;}
        public List<BatchUpload> BatchUploadedOrNot {get;set;} = new List<BatchUpload>();
    }
}