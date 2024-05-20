using eShopping.Common.Models;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Blogs.Commands
{
    public class AdminDeleteBlogCategoryRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }
    }
    public class AdminDeleteBlogCategoryRequestHandler : IRequestHandler<AdminDeleteBlogCategoryRequest, BaseResponseModel>
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;

        public AdminDeleteBlogCategoryRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider)
        {

            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }
        public async Task<BaseResponseModel> Handle(AdminDeleteBlogCategoryRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var blogCategory = await _unitOfWork.BlogCategories.Find(bc => bc.Id == request.Id).FirstOrDefaultAsync();
            if (blogCategory == null)
            {
                return BaseResponseModel.ReturnError("No blog category is found");
            }
            blogCategory.IsDeleted = true;
            blogCategory.LastSavedUser = loggedUser.AccountId.Value;
            blogCategory.LastSavedTime = DateTime.Now;
            await _unitOfWork.SaveChangesAsync();
            return BaseResponseModel.ReturnData();
        }
    }
}
