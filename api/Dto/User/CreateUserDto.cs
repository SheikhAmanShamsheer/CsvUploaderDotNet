using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dto.User
{
    public class CreateUserDto
    {
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