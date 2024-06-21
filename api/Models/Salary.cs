using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Salary
    {
        public int SalaryId {get;set;}
        public long FY_2019_20 {get;set;}
        public long FY_2020_21 {get;set;}
        public long FY_2021_22 {get;set;}
        public long FY_2022_23 {get;set;}
        public int UserId {get;set;}
    }
}