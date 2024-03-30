using eShopping.Common.Exceptions;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Commands
{
    public class AdminDeleteBlogRequest : IRequest<bool>
    {
        public Guid Id { get; set; }
    }
    public class AdminDeleteBlogRequestHandler : IRequestHandler<AdminDeleteBlogRequest, bool>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        public AdminDeleteBlogRequestHandler(
            IMediator mediator,
            IUnitOfWork unitOfWork,
            IUserProvider userProvider)
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }
        public async Task<bool> Handle(AdminDeleteBlogRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var blog = await _unitOfWork.Blogs.Find(b => b.Id == request.Id).FirstOrDefaultAsync(cancellationToken);
            ThrowError.Against(blog == null, "No Blog is found");
            blog.IsDeleted = true;
            blog.LastSavedUser = loggedUser.AccountId.Value;
            blog.LastSavedTime = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }
}
