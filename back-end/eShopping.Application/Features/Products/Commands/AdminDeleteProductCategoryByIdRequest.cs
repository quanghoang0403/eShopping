using eShopping.Common.Exceptions;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Commands
{
    public class AdminDeleteProductCategoryByIdRequest : IRequest<bool>
    {
        public Guid Id { get; set; }
    }

    public class AdminDeleteProductCategoryRequestHandler : IRequestHandler<AdminDeleteProductCategoryByIdRequest, bool>
    {
        private readonly IMediator _mediator;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;

        public AdminDeleteProductCategoryRequestHandler(
            IMediator mediator,
            IUnitOfWork unitOfWork,
            IUserProvider userProvider)
        {
            _mediator = mediator;
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }

        public async Task<bool> Handle(AdminDeleteProductCategoryByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var productCategory = await _unitOfWork.ProductCategories.Find(p => p.Id == request.Id)
                .FirstOrDefaultAsync(cancellationToken: cancellationToken);
            ThrowError.Against(productCategory == null, "Product category is not found");

            productCategory.IsDeleted = true;
            productCategory.LastSavedUser = loggedUser.AccountId.Value;
            productCategory.LastSavedTime = DateTime.Now;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }
}
