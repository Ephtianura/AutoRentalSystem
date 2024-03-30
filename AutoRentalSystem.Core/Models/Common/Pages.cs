using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoRentalSystem.Core.Models.Common
{
    public class PagedResult<T>
    {
        public IEnumerable<T> Items { get; set; } = new List<T>();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }

        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    }
    public class PagedRequest
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;

        public string? SortBy { get; set; }   // имя свойства (например "PricePerDay")
        public SortDirection SortDirection { get; set; } = SortDirection.Asc;
    }

    public enum SortDirection
    {
        Asc,
        Desc
    }
}
