using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.VisualBasic;

namespace api.Models
{
    public class User
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public  int Id {get;set;}
        public required string Name {get;set;}
        public required string Email {get;set;}
        public required string Country {get;set;}
        public required string State {get;set;}
        public required string City {get;set;}
        public required string Telephone {get;set;}
        public required string AddressLine1 {get;set;}
        public required string AddressLine2 {get;set;}

        public required DateTime DateOfBirth {get;set;}
        public  Salary Salary {get;set;}
    }
}


// "Logging": {
    // "LogLevel": {
    //   "Default": "Information",
    //   "Microsoft.AspNetCore": "Warning"
    // }
//   },