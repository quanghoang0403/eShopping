using eShopping.Common.Models;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Blogs.Commands
{
    public class AdminDeleteBlogRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }
    }
    public class AdminDeleteBlogRequestHandler : IRequestHandler<AdminDeleteBlogRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        public AdminDeleteBlogRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider)
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }
        public async Task<BaseResponseModel> Handle(AdminDeleteBlogRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var blog = await _unitOfWork.Blogs.Find(b => b.Id == request.Id).FirstOrDefaultAsync(cancellationToken);
            if (blog == null)
            {
                return BaseResponseModel.ReturnError("No blog is found");
            }
            var blogInCategory = _unitOfWork.BlogInCategories.Where(bic => bic.BlogId == blog.Id);
            await _unitOfWork.BlogInCategories.RemoveRangeAsync(blogInCategory);

            blog.IsDeleted = true;
            blog.LastSavedUser = loggedUser.AccountId.Value;
            blog.LastSavedTime = DateTime.Now;
            await _unitOfWork.SaveChangesAsync();
            return BaseResponseModel.ReturnData();
        }
    }
}
