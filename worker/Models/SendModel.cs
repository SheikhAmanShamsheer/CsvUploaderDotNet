using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class SendModel
    {
        public byte[] bacthNo;

        public byte[]? fileBytes {get;set;}
        public Log log {get;set;}

    }
}