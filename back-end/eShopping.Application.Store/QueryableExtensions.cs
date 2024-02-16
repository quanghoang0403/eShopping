using Microsoft.EntityFrameworkCore.Query.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using Thinktecture.EntityFrameworkCore;

namespace eShopping.Application.Store
{
    public static class QueryableExtensions
    {
        private static readonly MethodInfo _asQueryableMethodInfo
                 = typeof(Queryable)
                     .GetMethods(BindingFlags.Public | BindingFlags.Static)
                     .Single(m => m.Name == nameof(Queryable.AsQueryable)
                                  && m.IsGenericMethod);

        public static IQueryable<T> WhereIf<T>(this IQueryable<T> query, bool condition, Expression<Func<T, bool>> predicate)
        {
            return condition
                ? query.Where(predicate)
                : query;
        }
        public static IQueryable<T> WhereIf<T>(this IQueryable<T> query, bool condition, Expression<Func<T, int, bool>> predicate)
        {
            return condition
                ? query.Where(predicate)
                : query;
        }
    }
}
