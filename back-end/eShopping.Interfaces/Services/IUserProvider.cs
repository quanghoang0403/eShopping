using eShopping.Common.Models.User;

namespace eShopping.Interfaces
{
    public interface IUserProvider : IProvider<LoggedUserModel>
    {
        LoggedUserModel Provide();

        LoggedUserModel GetLoggedUserModelFromJwt(string token);
    }
}
