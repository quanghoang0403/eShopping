using eShopping.Common.Models;

namespace eShopping.Interfaces
{
    public interface IUserProvider : IProvider<LoggedUserModel>
    {
        LoggedUserModel Provide();

        LoggedUserModel GetLoggedUserModelFromJwt(string token);
    }
}
