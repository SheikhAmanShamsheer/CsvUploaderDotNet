using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.VisualBasic;
namespace worker.Models
{
    public class User
    {
        public  int Id {get;set;}
        public  string Name {get;set;}
        public  string Email {get;set;}
        public  string Country {get;set;}
        public  string State {get;set;}
        public  string City {get;set;}
        public  string Telephone {get;set;}
        public  string AddressLine1 {get;set;}
        public  string AddressLine2 {get;set;}

        public  DateTime DateOfBirth {get;set;}
        public Salary Salary {get;set;}
    }
}


// "Logging": {
    // "LogLevel": {
    //   "Default": "Information",
    //   "Microsoft.AspNetCore": "Warning"
    // }
//   },