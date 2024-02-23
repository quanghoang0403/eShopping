using eShopping.Common.Exceptions;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Commands
{
    public class DeleteProductCategoryByIdRequest : IRequest<bool>
    {
        public Guid Id { get; set; }
    }

    public class DeleteProductCategoryRequestHandler : IRequestHandler<DeleteProductCategoryByIdRequest, bool>
    {
        private readonly IMediator _mediator;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;

        public DeleteProductCategoryRequestHandler(
            IMediator mediator,
            IUnitOfWork unitOfWork,
            IUserProvider userProvider)
        {
            _mediator = mediator;
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }

        public async Task<bool> Handle(DeleteProductCategoryByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var productCategory = await _unitOfWork.Categories.Find(p => p.Id == request.Id)
                .FirstOrDefaultAsync(cancellationToken: cancellationToken);
            ThrowError.Against(productCategory == null, "Product category is not found");
            var accountId = loggedUser.AccountId.Value;
            productCategory.IsDeleted = true;
            productCategory.LastSavedUser = accountId;
            productCategory.LastSavedTime = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }
}
