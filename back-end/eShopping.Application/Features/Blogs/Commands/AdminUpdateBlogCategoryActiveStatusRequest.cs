using eShopping.Common.Models;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Blogs.Commands
{
    public class AdminUpdateBlogCategoryActiveStatusRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }
    }
    public class AdminUpdateBlogCategoryActiveStatusRequestHandler : IRequestHandler<AdminUpdateBlogCategoryActiveStatusRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        public AdminUpdateBlogCategoryActiveStatusRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }
        public async Task<BaseResponseModel> Handle(AdminUpdateBlogCategoryActiveStatusRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var blogCategory = await _unitOfWork.BlogCategories.Where(bc => bc.Id == request.Id).FirstOrDefaultAsync(cancellationToken);
            if (blogCategory == null)
            {
                return BaseResponseModel.ReturnError("Cannot find blog category");
            }
            blogCategory.IsActive = !blogCategory.IsActive;
            blogCategory.LastSavedUser = loggedUser.AccountId.Value;
            blogCategory.LastSavedTime = DateTime.Now;
            await _unitOfWork.BlogCategories.UpdateAsync(blogCategory);
            return BaseResponseModel.ReturnData();
        }
    }
}
