
using System;

namespace eShopping.Domain.Enums
{
    public enum EnumPermissionGroup
    {
        Admin,

        Product,

        ProductCategory,

        Customer,

        Staff,

        Order,

        Blog,

        StoreWeb

    }

    public static class EnumPermissionGroupExtensions
    {
        public static Guid ToGuid(this EnumPermissionGroup enums) => enums switch
        {
            EnumPermissionGroup.Admin => new Guid("6C626154-5065-7265-6D69-937300000001"),
            EnumPermissionGroup.Product => new Guid("6C626154-5065-7265-6D69-937300000002"),
            EnumPermissionGroup.ProductCategory => new Guid("6C626154-5065-7265-6D69-937300000003"),
            EnumPermissionGroup.Customer => new Guid("6C626154-5065-7265-6D69-937300000004"),
            EnumPermissionGroup.Staff => new Guid("6C626154-5065-7265-6D69-937300000005"),
            EnumPermissionGroup.Order => new Guid("6C626154-5065-7265-6D69-937300000006"),
            EnumPermissionGroup.Blog => new Guid("6C626154-5065-7265-6D69-937300000007"),
            EnumPermissionGroup.StoreWeb => new Guid("6C626154-5065-7265-6D69-937300000100"),
            _ => new Guid("00000000-0000-0000-0000-000000000000")
        };
    }
}
