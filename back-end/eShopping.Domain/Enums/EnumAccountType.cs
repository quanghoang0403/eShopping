using System;
using System.ComponentModel;

namespace eShopping.Domain.Enums
{
    public enum EnumAccountType
    {
        /// <summary>
        /// Account type for customer, enduser
        /// </summary>
        [Description("USER")]
        Customer = 0,

        /// <summary>
        /// Account type for Admin, Manager, Staff, etc... of store, store's branch
        /// </summary>
        [Description("STAFF")]
        Staff = 1,
    }

    public static class EnumAccountTypeExtensions
    {
        public static Guid ToGuid(this EnumAccountType enums) => enums switch
        {
            EnumAccountType.Customer => new Guid("07DCC545-9822-489F-ABEC-69C1D210EA68"),
            EnumAccountType.Staff => new Guid("C3408968-2942-4085-959D-A0EC09BB3952"),
            _ => new Guid("00000000-0000-0000-0000-000000000000")
        };
    }
}
