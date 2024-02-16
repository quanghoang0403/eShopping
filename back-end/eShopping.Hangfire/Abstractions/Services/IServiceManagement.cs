namespace eShopping.Hangfire.Abstractions.Services
{
    public interface IServiceManagement
    {
        ITokenService TokenService { get; }
    }
}