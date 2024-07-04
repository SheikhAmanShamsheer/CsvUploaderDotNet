using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace processing.Service
{
    public interface ISaveLog
    {
        void SetLog(Log log);
        Log GetLog();
    }
}