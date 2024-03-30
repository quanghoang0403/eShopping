using eShopping.Domain.Entities;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Queries
{
    public class AdminGetAllBlogRequest : IRequest<AdminGetAllBlogResponse>
    {
    }
    public class AdminGetAllBlogResponse
    {
        public IEnumerable<Blog> AllBlogs { get; set; }
    }
    public class AdminGetAllBlogRequestHandler : IRequestHandler<AdminGetAllBlogRequest, AdminGetAllBlogResponse>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        public AdminGetAllBlogRequestHandler(IUnitOfWork unitOfWork, IUserProvider userProvider)
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }
        public async Task<AdminGetAllBlogResponse> Handle(AdminGetAllBlogRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var allBlogs = await _unitOfWork.Blogs.GetAll().AsNoTracking().ToListAsync(cancellationToken: cancellationToken);
            var response = new AdminGetAllBlogResponse
            {
                AllBlogs = allBlogs
            };
            return response;

        }
    }
}
