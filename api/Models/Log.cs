using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Log
    {
        public Boolean IsUploaded {get;set;}
        public Boolean IsReceivedByProcessor {get;set;}
        public int NoOfBatchesCreated {get;set;}
        public List<BatchUpload> BatchUploadedOrNot {get;set;}
        public Boolean IsReceivedByUploader {get;set;}
        public Boolean IsUploadedToDatabase {get;set;}
    }
}