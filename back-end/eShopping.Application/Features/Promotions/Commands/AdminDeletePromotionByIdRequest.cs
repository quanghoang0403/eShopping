using eShopping.Common.Exceptions;
using eShopping.Interfaces;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Promotions.Commands
{
    public class AdminDeletePromotionByIdRequest : IRequest<bool>
    {
        public Guid Id { get; set; }
    }

    public class AdminDeletePromotionRequestHandler : IRequestHandler<AdminDeletePromotionByIdRequest, bool>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;

        public AdminDeletePromotionRequestHandler(
            IUserProvider userProvider,
            IUnitOfWork unitOfWork)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
        }

        public async Task<bool> Handle(AdminDeletePromotionByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var promotion = await _unitOfWork.Promotions.GetPromotionByIdAsync(request.Id);
            ThrowError.Against(promotion == null, "Promotion is not found");

            promotion.IsDeleted = true;
            promotion.LastSavedUser = loggedUser.AccountId.Value;
            promotion.LastSavedTime = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync();

            return true;
        }
    }

}
