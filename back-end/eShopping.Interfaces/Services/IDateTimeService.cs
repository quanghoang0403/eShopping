using System;

namespace eShopping.Interfaces
{
    public interface IDateTimeService
    {
        DateTime NowUtc { get; }
    }
}
