using eShopping.Common.Models;
using eShopping.Interfaces;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Commands
{
    public class AdminDeleteProductByIdRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }
    }

    public class AdminDeleteProductByIdRequestHandler : IRequestHandler<AdminDeleteProductByIdRequest, BaseResponseModel>
    {
        private readonly IMediator _mediator;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;

        public AdminDeleteProductByIdRequestHandler(
            IMediator mediator,
            IUnitOfWork unitOfWork,
            IUserProvider userProvider
        )
        {
            _mediator = mediator;
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }

        public async Task<BaseResponseModel> Handle(AdminDeleteProductByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var product = await _unitOfWork.Products.GetProductByIdAsync(request.Id);
            if (product == null)
            {
                return BaseResponseModel.ReturnError("Product is not found");
            }

            product.IsDeleted = true;
            product.LastSavedUser = loggedUser.AccountId.Value;
            product.LastSavedTime = DateTime.Now;
            await _unitOfWork.SaveChangesAsync();
            return BaseResponseModel.ReturnData();
        }
    }
}
