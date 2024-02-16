using eShopping.Common.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;

namespace eShopping.Common.Extensions
{
    public static class ExcelImportColumnExtensions
    {
        public static string GetColumnLabel(this Type type, string attributeName)
        {
            var props = type.GetProperties();
            Dictionary<string, string> propertyColumns = new();
            foreach (var prop in props)
            {
                object[] attrs = prop.GetCustomAttributes(true);
                foreach (object attr in attrs)
                {
                    if (attr is ExcelColumnAttribute excelColumnAttr)
                    {
                        string propName = prop.Name;
                        string excelColumn = excelColumnAttr.ExcelColumn;
                        propertyColumns.Add(propName, excelColumn);
                    }
                }
            }

            var column = propertyColumns.FirstOrDefault(p => p.Key == attributeName);

            return column.Value ?? string.Empty; ;
        }
    }
}
