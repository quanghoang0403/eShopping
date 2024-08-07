﻿using AutoMapper;
using eShopping.Common.Helpers;
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
    public class AdminUpdateBlogRequest : IRequest<BaseResponseModel>
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
        public List<Guid> BlogCategoryIds { get; set; }
        public string Author { get; set; }
        public string Thumbnail { get; set; }
        public bool isActive { get; set; }
    }
    public class AdminUpdateBlogHandler : IRequestHandler<AdminUpdateBlogRequest, BaseResponseModel>
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
        public async Task<BaseResponseModel> Handle(AdminUpdateBlogRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            if (RequestValidation(request) != null)
            {
                return RequestValidation(request);
            }
            var blog = await _unitOfWork.Blogs.Where(b => b.Id == request.Id).Include(b => b.BlogInCategories).AsNoTracking().FirstOrDefaultAsync();
            if (blog == null)
            {
                return BaseResponseModel.ReturnError("Cannot find specific blog");
            }
            var existedBlogName = await _unitOfWork.Blogs.Where(b => b.Name.ToLower().Trim().ToLower().Equals(request.Name.Trim().ToLower()) && b.Id != request.Id).AsNoTracking().FirstOrDefaultAsync();
            if (existedBlogName != null)
            {
                return BaseResponseModel.ReturnError("This blog name has already existed");
            }
            var modifiedBlog = _mapper.Map<Blog>(request);
            modifiedBlog.LastSavedUser = loggedUser.AccountId.Value;
            modifiedBlog.LastSavedTime = DateTime.Now;
            modifiedBlog.UrlSEO = StringHelpers.UrlEncode(modifiedBlog.Name);
            List<Guid> newBlogCategoryIds = new List<Guid>(blog.BlogInCategories.Select(b => b.BlogCategoryId));
            foreach (var blogCategory in request.BlogCategoryIds)
            {
                var isBlogCategoryExisted = newBlogCategoryIds.Contains(blogCategory);
                if (!isBlogCategoryExisted)
                {
                    newBlogCategoryIds.Add(blogCategory);
                }
            }
            var result = await _unitOfWork.Blogs.UpdateBlogAsync(modifiedBlog, newBlogCategoryIds, cancellationToken);
            if (result == null)
                return BaseResponseModel.ReturnError("Error updating Blog");

            return BaseResponseModel.ReturnData();
        }
        private static BaseResponseModel RequestValidation(AdminUpdateBlogRequest request)
        {
            if (string.IsNullOrEmpty(request.Name))
            {
                return BaseResponseModel.ReturnError("Please enter blog name");
            }
            return null;
        }
    }
}
