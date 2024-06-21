using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto.User;
using api.Models;

namespace api.Mappers
{
    public static class UserMappers
    {
        public static UserDto ToUserDto(this User user){
            return new UserDto{
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Country = user.Country,
                State = user.State,
                City = user.City,
                Telephone = user.Telephone,
                AddressLine1 = user.AddressLine1,
                AddressLine2 = user.AddressLine2,
                DateOfBirth = user.DateOfBirth
            };
        }
    }
}