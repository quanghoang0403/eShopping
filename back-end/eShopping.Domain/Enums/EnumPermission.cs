
using System;

namespace eShopping.Domain.Enums
{
    public enum EnumPermission
    {
        ADMIN,

        VIEW_PRODUCT,
        CREATE_PRODUCT,
        EDIT_PRODUCT,

        VIEW_PRODUCT_CATEGORY,
        CREATE_PRODUCT_CATEGORY,
        EDIT_PRODUCT_CATEGORY,

        VIEW_CUSTOMER,
        CREATE_CUSTOMER,
        EDIT_CUSTOMER,

        VIEW_STAFF,
        CREATE_STAFF,
        EDIT_STAFF,

        VIEW_PROMOTION,
        CREATE_PROMOTION,
        EDIT_PROMOTION,

        VIEW_ORDER,
        CREATE_ORDER,
        EDIT_ORDER,

        VIEW_BLOG,
        CREATE_BLOG,
        EDIT_BLOG,

        STORE_WEB
    }

    public static class EnumPermissionExtensions
    {
        public static Guid ToGuid(this EnumPermission enums) => enums switch
        {
            EnumPermission.ADMIN => new Guid("6C626154-5065-7265-6D69-737300000001"),
            EnumPermission.VIEW_PRODUCT => new Guid("6C626154-5065-7265-6D69-737300000002"),
            EnumPermission.CREATE_PRODUCT => new Guid("6C626154-5065-7265-6D69-737300000003"),
            EnumPermission.EDIT_PRODUCT => new Guid("6C626154-5065-7265-6D69-737300000004"),

            EnumPermission.VIEW_PRODUCT_CATEGORY => new Guid("6C626154-5065-7265-6D69-737300000005"),
            EnumPermission.CREATE_PRODUCT_CATEGORY => new Guid("6C626154-5065-7265-6D69-737300000006"),
            EnumPermission.EDIT_PRODUCT_CATEGORY => new Guid("6C626154-5065-7265-6D69-737300000007"),

            EnumPermission.VIEW_CUSTOMER => new Guid("6C626154-5065-7265-6D69-737300000008"),
            EnumPermission.CREATE_CUSTOMER => new Guid("6C626154-5065-7265-6D69-737300000009"),
            EnumPermission.EDIT_CUSTOMER => new Guid("6C626154-5065-7265-6D69-73730000000A"),

            EnumPermission.VIEW_STAFF => new Guid("6C626154-5065-7265-6D69-73730000000B"),
            EnumPermission.CREATE_STAFF => new Guid("6C626154-5065-7265-6D69-73730000000C"),
            EnumPermission.EDIT_STAFF => new Guid("6C626154-5065-7265-6D69-73730000000D"),

            EnumPermission.VIEW_PROMOTION => new Guid("6C626154-5065-7265-6D69-73730000000E"),
            EnumPermission.CREATE_PROMOTION => new Guid("6C626154-5065-7265-6D69-73730000000F"),
            EnumPermission.EDIT_PROMOTION => new Guid("6C626154-5065-7265-6D69-737300000010"),

            EnumPermission.VIEW_ORDER => new Guid("6C626154-5065-7265-6D69-737300000011"),
            EnumPermission.CREATE_ORDER => new Guid("6C626154-5065-7265-6D69-737300000012"),
            EnumPermission.EDIT_ORDER => new Guid("6C626154-5065-7265-6D69-737300000013"),

            EnumPermission.VIEW_BLOG => new Guid("6C626154-5065-7265-6D69-737300000014"),
            EnumPermission.CREATE_BLOG => new Guid("6C626154-5065-7265-6D69-737300000015"),
            EnumPermission.EDIT_BLOG => new Guid("6C626154-5065-7265-6D69-737300000016"),

            EnumPermission.STORE_WEB => new Guid("6C626154-5065-7265-6D69-737300000100"),

            _ => new Guid("00000000-0000-0000-0000-000000000000"),

        };
    }
}
