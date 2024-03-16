using eShopping.Common.Exceptions;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Promotions.Commands
{
    public class AdminStopPromotionByIdRequest : IRequest<bool>
    {
        public Guid Id { get; set; }
    }

    public class AdminStopPromotionByIdRequestHandler : IRequestHandler<AdminStopPromotionByIdRequest, bool>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;

        public AdminStopPromotionByIdRequestHandler(
            IUserProvider userProvider,
           IUnitOfWork unitOfWork)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
        }

        public async Task<bool> Handle(AdminStopPromotionByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var promotion = await _unitOfWork.Promotions.Find(p => p.Id == request.Id).FirstOrDefaultAsync();
            ThrowError.Against(promotion == null, "Cannot find promotion information");

            promotion.IsStopped = true;
            promotion.LastSavedUser = loggedUser.AccountId.Value;
            promotion.LastSavedTime = DateTime.UtcNow;

            await _unitOfWork.Promotions.UpdateAsync(promotion);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }
    }
}