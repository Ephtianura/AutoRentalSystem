namespace AutoRentalSystem.Application.Contracts
{
    public interface IAuditLogService
    {
        Task LogAction(int userId, string action, string details);
    }
}