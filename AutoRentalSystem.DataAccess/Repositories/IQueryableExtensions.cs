using AutoRentalSystem.Core.Models.Common;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace AutoRentalSystem.DataAccess.Repositories
{

    // 🔹 Расширение для пагинации и сортировки
    public static class IQueryableExtensions
    {
        public static async Task<PagedResult<T>> PaginateAsync<T>(this IQueryable<T> query, PagedRequest request)
        {
            if (!string.IsNullOrWhiteSpace(request.SortBy))
            {
                var param = Expression.Parameter(typeof(T));
                var property = Expression.Property(param, request.SortBy);
                var lambda = Expression.Lambda(property, param);

                string method = request.SortDirection == SortDirection.Asc ? "OrderBy" : "OrderByDescending";
                var result = typeof(Queryable).GetMethods()
                    .First(m => m.Name == method && m.GetParameters().Length == 2)
                    .MakeGenericMethod(typeof(T), property.Type)
                    .Invoke(null, new object[] { query, lambda }) as IQueryable<T>;

                query = result!;
            }

            int total = await query.CountAsync();
            var items = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            return new PagedResult<T>
            {
                Items = items,
                TotalCount = total,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };
        }
    }
}
