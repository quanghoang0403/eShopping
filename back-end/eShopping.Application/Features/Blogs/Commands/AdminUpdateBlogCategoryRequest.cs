using AutoMapper;
using eShopping.Common.Exceptions;
using eShopping.Common.Helpers;
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
    public class AdminUpdateBlogCategoryRequest : IRequest<bool>
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public int Priority { get; set; }

        public string Content { get; set; }

        public string KeywordSEO { get; set; }

        public string UrlSEO { get; set; }

        public string TitleSEO { get; set; }

        public string DescriptionSEO { get; set; }

        public string Description { get; set; }


        public List<AdminBlogSelectModel> Blogs { get; set; }
    }

    public class AdminBlogSelectModel
    {
        public Guid Id { get; set; }
        public int Position { get; set; }
    }
    public class AdminUpdateBlogCategoryRequestHandler : IRequestHandler<AdminUpdateBlogCategoryRequest, bool>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;

        public AdminUpdateBlogCategoryRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
        }
        public async Task<bool> Handle(AdminUpdateBlogCategoryRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var blogCategory = await _unitOfWork.BlogCategories.Where(bc => bc.Id == request.Id).AsNoTracking().FirstOrDefaultAsync();
            ThrowError.Against(blogCategory == null, "No blog category is found");
            var blogCategoryNameExisted = await _unitOfWork.BlogCategories
                .Where(bc => bc.Id == request.Id && bc.Name.ToLower().Trim().Equals(request.Name.Trim().ToLower())).AsNoTracking().FirstOrDefaultAsync();
            ThrowError.Against(blogCategoryNameExisted != null, "Blog category name has already existed");
            using var createTransaction = await _unitOfWork.BeginTransactionAsync();
            try
            {
                var blogIds = request.Blogs.Select(b => b.Id);
                var blogInCategory = _unitOfWork.BlogInCategories.Find(b => blogIds.Any(bid => bid == b.blogId) || b.categoryId == blogCategory.Id);
                _unitOfWork.BlogInCategories.RemoveRange(blogInCategory);
                var newBlogInCategory = new List<BlogInCategory>();
                if (request.Blogs != null && request.Blogs.Any())
                {
                    request.Blogs.ForEach(b =>
                    {
                        var newBlog = new BlogInCategory
                        {
                            blogId = b.Id,
                            categoryId = blogCategory.Id
                        };
                        newBlogInCategory.Add(newBlog);
                    });
                    _unitOfWork.BlogInCategories.AddRange(newBlogInCategory);
                }
                var modifiedBlogCategory = _mapper.Map<BlogCategory>(request);
                modifiedBlogCategory.LastSavedUser = loggedUser.AccountId.Value;
                modifiedBlogCategory.LastSavedTime = DateTime.Now;
                modifiedBlogCategory.UrlSEO = StringHelpers.UrlEncode(modifiedBlogCategory.Name);

                await _unitOfWork.BlogCategories.UpdateAsync(modifiedBlogCategory);
                await _unitOfWork.SaveChangesAsync();
                // Complete this transaction, data will be saved.
                await createTransaction.CommitAsync(cancellationToken);

            }
            catch (Exception ex)
            {
                // Data will be restored.
                await createTransaction.RollbackAsync(cancellationToken);
                return false;
            }
            return true;
        }
    }
}
