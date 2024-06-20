using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eShopping.Common.Extensions
{
    public static class PagingExtensions
    {
        public static PagingResult<T> ToPagination<T>(this IList<T> query, int currentPage, int pageSize)
        {
            if (currentPage == 0) currentPage = PageSetting.FirstPage;
            if (pageSize == 0) pageSize = PageSetting.PageSize;

            int skip = (currentPage - 1) * pageSize;
            var items = query.Skip(skip).Take(pageSize).ToList();
            var totalRecord = query.Count;
            return new PagingResult<T>(items, totalRecord, currentPage, pageSize);
        }
        public static IQueryable<T> PageBy<T>(this IQueryable<T> source, int pageSize, int pageIndex) => pageIndex < 1 ? source.Skip(0).Take(pageSize) : source.Skip(pageSize * (pageIndex - 1)).Take(pageSize);

        public static async Task<PagingResult<T>> ToPaginationAsync<T>(this IQueryable<T> query, int currentPage, int pageSize)
        {
            if (currentPage == 0) currentPage = PageSetting.FirstPage;
            if (pageSize == 0) pageSize = PageSetting.PageSize;

            int skip = (currentPage - 1) * pageSize;
            var items = await query.Skip(skip).Take(pageSize).ToListAsync();
            var totalRecord = await query.CountAsync();
            return new PagingResult<T>(items, totalRecord, currentPage, pageSize);
        }

        public class Paging
        {
            public int PageIndex { get; set; }

            public int PageSize { get; set; }

            public int PageCount { get; set; }

            public int Total { get; set; }
        }

        public class PagingResult<T>
        {
            public PagingResult(IEnumerable<T> result, int total, int pageIndex, int pageSize)
            {
                Result = result;
                Paging = new Paging()
                {
                    Total = total,
                    PageIndex = pageIndex,
                    PageSize = pageSize,
                    PageCount = (int)Math.Ceiling((double)total / pageSize)
                };
            }
            public PagingResult(IEnumerable<T> result, Paging paging)
            {
                Result = result;
                Paging = paging;
            }
            public IEnumerable<T> Result { get; set; }
            public Paging Paging { get; set; }
        }

        public static class PageSetting
        {
            public static int FirstPage { get; set; } = 1;

            public static int PageSize { get; set; } = 12;
        }
    }
}
