using eShopping.Interfaces;
using System;

namespace eShopping.Services
{
    public class DateTimeService : IDateTimeService
    {
        public DateTime NowUtc => DateTime.UtcNow;
    }
}
