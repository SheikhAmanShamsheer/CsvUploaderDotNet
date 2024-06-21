using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(){}
        public ApplicationDBContext(DbContextOptions dbContextOptions) :base(dbContextOptions)
        // public ApplicationDBContext(DbContextOptions dbContextOptions) 
        {
            
        }

        public DbSet<User> Users{get;set;}

        public DbSet<Salary> Salaries{get;set;}
    }
}