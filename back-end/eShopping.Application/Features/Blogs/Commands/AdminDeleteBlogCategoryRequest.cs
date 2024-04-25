using eShopping.Common.Exceptions;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Blogs.Commands
{
    public class AdminDeleteBlogCategoryRequest : IRequest<bool>
    {
        public Guid Id { get; set; }
    }
    public class AdminDeleteBlogCategoryRequestHandler : IRequestHandler<AdminDeleteBlogCategoryRequest, bool>
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
        public async Task<bool> Handle(AdminDeleteBlogCategoryRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var blogCategory = await _unitOfWork.BlogCategories.Find(bc => bc.Id == request.Id).FirstOrDefaultAsync();
            ThrowError.Against(blogCategory == null, "Couldn't found blog category");
            blogCategory.IsDeleted = true;
            blogCategory.LastSavedUser = loggedUser.AccountId.Value;
            blogCategory.LastSavedTime = DateTime.Now;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }
}
