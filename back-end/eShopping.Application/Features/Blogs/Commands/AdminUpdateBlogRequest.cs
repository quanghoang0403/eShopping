using AutoMapper;
using eShopping.Common.Exceptions;
using eShopping.Common.Helpers;
using eShopping.Domain.Entities;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Blogs.Commands
{
    public class AdminUpdateBlogRequest : IRequest<bool>
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
        public List<Guid> BlogCategoryId { get; set; }
    }
    public class AdminUpdateBlogHandler : IRequestHandler<AdminUpdateBlogRequest, bool>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;

        public AdminUpdateBlogHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
        }
        public async Task<bool> Handle(AdminUpdateBlogRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            RequestValidation(request);
            var blog = await _unitOfWork.Blogs.Where(b => b.Id == request.Id).AsNoTracking().FirstOrDefaultAsync();
            ThrowError.Against(blog == null, "Cannot find specific blog");
            var existedBlogName = await _unitOfWork.Blogs.Where(b => b.Name.ToLower().Trim().ToLower().Equals(request.Name.Trim().ToLower()) && b.Id == request.Id).AsNoTracking().FirstOrDefaultAsync();
            ThrowError.Against(existedBlogName != null, new JObject()
            {
                { $"{nameof(request.Name)}", "This blog name has already existed" },
            });

            var modifiedBlog = _mapper.Map<Blog>(request);
            modifiedBlog.LastSavedUser = loggedUser.AccountId.Value;
            modifiedBlog.LastSavedTime = DateTime.Now;
            modifiedBlog.UrlSEO = StringHelpers.UrlEncode(modifiedBlog.Name);
            var result = await _unitOfWork.Blogs.UpdateBlogAsync(modifiedBlog, request.BlogCategoryId, cancellationToken);
            ThrowError.Against(result == null, "Error updating Blog");


            return true;
        }
        private static void RequestValidation(AdminUpdateBlogRequest request)
        {
            ThrowError.Against(string.IsNullOrEmpty(request.Name), "Please enter product name");

        }
    }
}
