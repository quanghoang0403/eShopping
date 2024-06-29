using eShopping.Common.Models;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Blogs.Commands
{
    public class AdminUpdateBlogActiveStatusRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }
    }
    public class AdminUpdateBlogActiveStatusRequestHandler : IRequestHandler<AdminUpdateBlogActiveStatusRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        public AdminUpdateBlogActiveStatusRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }
        public async Task<BaseResponseModel> Handle(AdminUpdateBlogActiveStatusRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var blog = await _unitOfWork.Blogs.Where(b => b.Id == request.Id).FirstOrDefaultAsync(cancellationToken);
            if (blog == null)
            {
                return BaseResponseModel.ReturnError("Cannot find blog");
            }
            blog.IsActive = !blog.IsActive;
            blog.LastSavedUser = loggedUser.AccountId.Value;
            blog.LastSavedTime = DateTime.Now;
            await _unitOfWork.Blogs.UpdateAsync(blog);
            return BaseResponseModel.ReturnData();
        }
    }
}
