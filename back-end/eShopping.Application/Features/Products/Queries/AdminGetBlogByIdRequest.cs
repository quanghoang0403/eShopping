using AutoMapper;
using eShopping.Domain.Entities;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Queries
{
    public class AdminGetBlogByIdRequest : IRequest<AdminGetBlogByIdResponse>
    {
        public Guid Id { get; set; }
    }

    public class AdminGetBlogByIdResponse
    {
        public Blog Blog { get; set; }
    }
    public class AdminGetBlogByIdRequestHandler : IRequestHandler<AdminGetBlogByIdRequest, AdminGetBlogByIdResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        private readonly IUserProvider _userProvider;
        private readonly MapperConfiguration _mapperConfiguration;
        private readonly IMapper _mapper;
        public AdminGetBlogByIdRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            MapperConfiguration mapperConfiguration,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapperConfiguration = mapperConfiguration;
            _mapper = mapper;
        }
        public async Task<AdminGetBlogByIdResponse> Handle(AdminGetBlogByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var blog = await _unitOfWork.Blogs.Find(b => b.Id == request.Id).AsNoTracking().FirstOrDefaultAsync(cancellationToken);
            return new AdminGetBlogByIdResponse
            {
                Blog = blog
            };
        }
    }
}
