using AutoMapper;
using DocumentFormat.OpenXml.VariantTypes;
using eShopping.Common.Models;
using eShopping.Interfaces;
using eShopping.Models.Products;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Queries
{
    public class StoreGetProductByIdRequest :IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }
    }
    public class StoreGetProductByIdRequestHandler : IRequestHandler<StoreGetProductByIdRequest, BaseResponseModel> {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;

        public StoreGetProductByIdRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
        }

        public async Task<BaseResponseModel> Handle(StoreGetProductByIdRequest request, CancellationToken cancellationToken)
        {
            var product  = await _unitOfWork.Products.Where(p=> p.Id == request.Id && p.IsActive).FirstOrDefaultAsync(cancellationToken);
            if (product == null)
            {
                BaseResponseModel.ReturnError("cannot find product with id " + request.Id);
            }
            var response = _mapper.Map<StoreProductModel>(product);
            return BaseResponseModel.ReturnData(response);
        }
    }
}
