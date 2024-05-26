using AutoMapper;
using eShopping.Common.Helpers;
using eShopping.Common.Models;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
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
    public class AdminCreateBlogCategoryRequest : IRequest<BaseResponseModel>
    {
        public string Name { get; set; }

        public int Priority { get; set; }

        public string Content { get; set; }

        public string KeywordSEO { get; set; }

        public string TitleSEO { get; set; }

        public string DescriptionSEO { get; set; }

        public string Description { get; set; }
        public EnumColorCategory Color { get; set; }
        public List<BlogSelectModel> Blogs { get; set; }
    }

    public class BlogSelectModel
    {
        public Guid Id { get; set; }
        public int Position { get; set; }
    }
    public class AdminCreateBlogCategoryRequestHandler : IRequestHandler<AdminCreateBlogCategoryRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;

        public AdminCreateBlogCategoryRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
        }
        public async Task<BaseResponseModel> Handle(AdminCreateBlogCategoryRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            if (RequestValidation(request) != null)
            {
                return RequestValidation(request);
            }
            var existedBlogCategoryName = await _unitOfWork.BlogCategories.Where(b => b.Name.ToLower().Trim().ToLower().Equals(request.Name.Trim().ToLower())).FirstOrDefaultAsync();
            if (existedBlogCategoryName != null)
            {
                return BaseResponseModel.ReturnError("This blog category name name has already existed");
            }
            return await _unitOfWork.CreateExecutionStrategy().ExecuteAsync(async () =>
            {
                using var createTransaction = await _unitOfWork.BeginTransactionAsync();
                try
                {
                    var newBlogCategory = _mapper.Map<BlogCategory>(request);
                    var accountId = loggedUser.AccountId.Value;
                    newBlogCategory.CreatedUser = accountId;
                    newBlogCategory.CreatedTime = DateTime.Now;
                    newBlogCategory.UrlSEO = newBlogCategory.Name.UrlEncode();
                    var blogIds = request.Blogs.Select(b => b.Id);
                    var blogInCategory = _unitOfWork.BlogInCategories.Find(b => blogIds.Any(bid => bid == b.BlogId));
                    if (request.Blogs != null && request.Blogs.Any())
                    {
                        newBlogCategory.BlogInCategories = new List<BlogInCategory>();
                        request.Blogs.ForEach(b =>
                        {
                            var blogCategory = new BlogInCategory()
                            {
                                BlogId = b.Id,
                                BlogCategoryId = newBlogCategory.Id
                            };

                            newBlogCategory.BlogInCategories.Add(blogCategory);
                        });
                    }
                    _unitOfWork.BlogCategories.Add(newBlogCategory);
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
        private static BaseResponseModel RequestValidation(AdminCreateBlogCategoryRequest request)
        {
            if (string.IsNullOrEmpty(request.Name))
            {
                return BaseResponseModel.ReturnError("Please enter blog category name");
            }
            return null;
        }
    }
}
