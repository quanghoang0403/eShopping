using AutoMapper;
using eShopping.Common.Exceptions;
using eShopping.Common.Helpers;
using eShopping.Domain.Entities;
using eShopping.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Blogs.Commands
{
    public class AdminCreateBlogRequest : IRequest<bool>
    {
        public string Name { get; set; }

        public int Priority { get; set; }

        public string Content { get; set; }

        public string KeywordSEO { get; set; }

        public string TitleSEO { get; set; }

        public string DescriptionSEO { get; set; }

        public string Description { get; set; }
        public string Thumbnail { get; set; }
        public List<Guid> BlogCategoryIds { get; set; }
    }
    public class AdminCreateBlogRequestHandler : IRequestHandler<AdminCreateBlogRequest, bool>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;

        public AdminCreateBlogRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
        }
        public async Task<bool> Handle(AdminCreateBlogRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            RequestValidation(request);
            using var createTransaction = _unitOfWork.BeginTransactionAsync();
            var newBlog = _mapper.Map<Blog>(request);
            var accountId = loggedUser.AccountId.Value;
            newBlog.CreatedUser = accountId;
            newBlog.CreatedTime = DateTime.Now;
            newBlog.UrlSEO = StringHelpers.UrlEncode(newBlog.Name);
            try
            {
                await _unitOfWork.Blogs.AddAsync(newBlog);
                List<BlogInCategory> blogInCategories = new();
                foreach (var id in request.BlogCategoryIds)
                {
                    BlogInCategory map = new()
                    {
                        blogId = newBlog.Id,
                        categoryId = id,
                    };
                    blogInCategories.Add(map);
                }
                await _unitOfWork.BlogInCategories.AddRangeAsync(blogInCategories);
                await _unitOfWork.SaveChangesAsync();
                // Complete this transaction, data will be saved.
                await createTransaction.Result.CommitAsync();
            }
            catch (Exception ex)
            {
                // Data will be restored.
                await createTransaction.Result.RollbackAsync(cancellationToken);
                return false;
            }
            return true;
        }
        private static void RequestValidation(AdminCreateBlogRequest request)
        {
            ThrowError.Against(string.IsNullOrEmpty(request.Name), "Please enter Blog name");

        }
    }
}
