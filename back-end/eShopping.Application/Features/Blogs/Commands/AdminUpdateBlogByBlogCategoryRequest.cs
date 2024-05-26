using eShopping.Common.Models;
using eShopping.Domain.Entities;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Blogs.Commands
{
    public class AdminUpdateBlogByBlogCategoryRequest : IRequest<BaseResponseModel>
    {
        public Guid BlogCategoryId { get; set; }
        public IEnumerable<Guid> BlogIds { get; set; }
    }
    public class AdminUpdateBlogByBlogCategoryRequestHandler : IRequestHandler<AdminUpdateBlogByBlogCategoryRequest, BaseResponseModel>
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;

        public AdminUpdateBlogByBlogCategoryRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }

        public async Task<BaseResponseModel> Handle(AdminUpdateBlogByBlogCategoryRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var blogCategory = await _unitOfWork.BlogCategories.Where(bc => bc.Id == request.BlogCategoryId).AsNoTracking().FirstOrDefaultAsync();
            if (blogCategory == null)
            {
                return BaseResponseModel.ReturnError("No blog category is found");
            }
            return await _unitOfWork.CreateExecutionStrategy().ExecuteAsync(async () =>
            {
                using var createTransaction = await _unitOfWork.BeginTransactionAsync();
                try
                {
                    var blogInCategory = _unitOfWork.BlogInCategories.Find(b => request.BlogIds.Any(bid => bid == b.BlogId) || b.BlogCategoryId == blogCategory.Id);
                    _unitOfWork.BlogInCategories.RemoveRange(blogInCategory);
                    var newBlogInCategory = new List<BlogInCategory>();
                    if (request.BlogIds != null && request.BlogIds.Any())
                    {

                        foreach (var id in request.BlogIds)
                        {
                            var newBlog = new BlogInCategory
                            {
                                BlogId = id,
                                BlogCategoryId = blogCategory.Id
                            };
                            newBlogInCategory.Add(newBlog);
                        }

                    }
                    _unitOfWork.BlogInCategories.AddRange(newBlogInCategory);
                    blogCategory.LastSavedUser = loggedUser.AccountId.Value;
                    blogCategory.LastSavedTime = DateTime.UtcNow;

                    await _unitOfWork.BlogCategories.UpdateAsync(blogCategory);
                    await _unitOfWork.SaveChangesAsync();
                    // Complete this transaction, data will be saved.
                    await createTransaction.CommitAsync(cancellationToken);

                }
                catch (Exception ex)
                {
                    // Data will be restored.
                    await createTransaction.RollbackAsync(cancellationToken);
                    return BaseResponseModel.ReturnError(ex.Message);
                }
                return BaseResponseModel.ReturnData();
            });
        }
    }
}
