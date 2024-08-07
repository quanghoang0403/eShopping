﻿using AutoMapper;
using eShopping.Common.Extensions;
using eShopping.Common.Models;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Models.Blog;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using static eShopping.Common.Extensions.PagingExtensions;

namespace eShopping.Application.Features.Blogs.Queries
{
    public class AdminGetBlogCategoriesRequest : IRequest<BaseResponseModel>
    {
        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public string KeySearch { get; set; }

        public EnumColorCategory Color { get; set; }
    }

    public class AdminGetBlogCategoriesRequestHandler : IRequestHandler<AdminGetBlogCategoriesRequest, BaseResponseModel>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AdminGetBlogCategoriesRequestHandler(
            IUserProvider userProvider,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<BaseResponseModel> Handle(AdminGetBlogCategoriesRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var blogCategory = _unitOfWork.BlogCategories.GetAll();
            var allBlogCategories = await blogCategory
                .AsNoTracking()
                .Include(b => b.BlogInCategories)
                .ThenInclude(bl => bl.Blog)
                .OrderBy(b => b.CreatedTime)
                .ToPaginationAsync(request.PageNumber, request.PageSize);

            var pageResult = allBlogCategories.Result;
            var allBlogCategoriesResponse = _mapper.Map<List<AdminBlogCategoryModel>>(pageResult);
            if (!string.IsNullOrEmpty(request.KeySearch))
            {
                string keysearch = request.KeySearch.Trim().ToLower();
                allBlogCategoriesResponse = allBlogCategoriesResponse.Where(bc => bc.Name.Contains(keysearch)).ToList();
            }
            allBlogCategoriesResponse.ForEach(b =>
            {
                var blogInCategory = pageResult.Where(bic => b.Id == bic.Id).FirstOrDefault();
                b.No = allBlogCategoriesResponse.IndexOf(b) + ((request.PageNumber - 1) * request.PageSize) + 1;
                b.Blogs = _mapper.Map<List<AdminBlogModel>>(blogInCategory.BlogInCategories.Select(b => b.Blog));

            });
            var response = new PagingResult<AdminBlogCategoryModel>(allBlogCategoriesResponse, allBlogCategories.Paging);
            return BaseResponseModel.ReturnData(response);
        }
    }
}
