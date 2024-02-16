using System;

namespace eShopping.Common.Attributes
{
    public class ExcelColumnAttribute : Attribute
    {
        public ExcelColumnAttribute(string excelColumn)
        {
            ExcelColumn = excelColumn;
        }

        public virtual string ExcelColumn { get; }
    }
}
