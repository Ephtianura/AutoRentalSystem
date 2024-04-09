using AutoRentalSystem.Core.Contracts;
using AutoRentalSystem.Core.Models;

namespace AutoRentalSystem.Application.Services
{

    // ================== AUDIT LOGS ==================
    public class AuditLogService
    {
        private readonly IAuditLogRepository _logs;

        public AuditLogService(IAuditLogRepository logs) => _logs = logs;

        public async Task LogAction(int userId, string action, string details)
        {
            var log = new AuditLog
            {
                UserId = userId,
                Action = action,
                Details = details,
                Date = DateTime.UtcNow
            };
            await _logs.AddAsync(log);
        }
    }
}
