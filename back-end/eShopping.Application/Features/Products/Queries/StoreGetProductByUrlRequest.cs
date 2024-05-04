﻿using AutoMapper;
using AutoMapper.QueryableExtensions;
using eShopping.Common.Exceptions;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Models.Products;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Queries
{
    public class StoreGetProductByUrlRequest : IRequest<StoreProductDetailModel>
    {
        public string Url { get; set; }
    }

    public class StoreGetProductByUrlRequestHandler : IRequestHandler<StoreGetProductByUrlRequest, StoreProductDetailModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly MapperConfiguration _mapperConfiguration;
        private readonly IMapper _mapper;

        public StoreGetProductByUrlRequestHandler(
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

        public async Task<StoreProductDetailModel> Handle(StoreGetProductByUrlRequest request, CancellationToken cancellationToken)
        {
            //request.Url = "string";
            //List<StoreProductPriceModel> productPrices = new()
            //{
            //    new StoreProductPriceModel()
            //    {
            //        Id = new Guid("07AE9354-FBD5-4A23-9F69-08DC63767DC7"),
            //        PriceName = "Large",
            //        PercentNumber = -20,
            //        PriceDiscount = 300000,
            //        PriceValue = 400000,
            //        QuantityLeft = 3
            //    },
            //    new StoreProductPriceModel()
            //    {
            //        Id = new Guid("07AE9354-FBD5-4A23-9F69-08DC63767DC7"),
            //        PriceName = "Medium",
            //        PercentNumber = -30,
            //        PriceDiscount = 200000,
            //        PriceValue = 300000,
            //        QuantityLeft = 3
            //    },
            //    new StoreProductPriceModel()
            //    {
            //        Id = new Guid("07AE9354-FBD5-4A23-9F69-08DC63767DC7"),
            //        PriceName = "Small",
            //        PriceDiscount = 200000,
            //        PriceValue = 200000,
            //        QuantityLeft = 4
            //    }
            //};
            //List<string> gallery = new()
            //{
            //    "/imgs/productDetail4/1.jpg",
            //    "/imgs/productDetail4/2.jpg",
            //    "/imgs/productDetail4/3.jpg",
            //    "/imgs/productDetail4/4.jpg",
            //    "/imgs/productDetail4/5.jpg",
            //    "/imgs/productDetail4/6.jpg",
            //    "/imgs/productDetail4/7.jpg",
            //    "/imgs/productDetail4/8.jpg",
            //    "/imgs/productDetail4/9.jpg"
            //};
            //var productCategory = new StoreProductCategoryModel()
            //{
            //    Id = Guid.NewGuid(),
            //    Name = "name",
            //    UrlSEO = "ao",
            //};

            var productData = await _unitOfWork.Products
                .Find(p => p.UrlSEO == request.Url)
                .AsNoTracking()
                .Include(x => x.ProductPrices)
                .Include(x => x.Images)
                .Include(p => p.ProductInCategories)
                .ProjectTo<StoreProductDetailModel>(_mapperConfiguration)
                .FirstOrDefaultAsync(cancellationToken: cancellationToken);
            var productIncategory = await _unitOfWork.ProductInCategories.Where(p => p.ProductId == productData.Id).Include(p => p.ProductCategory).FirstOrDefaultAsync();
            productData.ProductCategory = new StoreProductCategoryModel
            {
                Id = productIncategory.ProductCategory.Id,
                Name = productIncategory.ProductCategory.Name,
                UrlSEO = productIncategory.ProductCategory.UrlSEO,
                IsShowOnHome = productIncategory.ProductCategory.IsShowOnHome
            };
            ThrowError.Against(productData == null, "Cannot find product detail information");
            var images = await _unitOfWork.Images.GetAllImagesByObjectId(productData.Id, EnumImageTypeObject.Product);
            //var category = await _unitOfWork.ProductCategories.GetProductCategoryListByProductId(productData.Id).FirstOrDefaultAsync();
            //productData.ProductCategory = new StoreProductCategoryModel()
            //{
            //    Id = category.Id,
            //    Name = category.Name,
            //    UrlSEO = category.UrlSEO,
            //};
            //productData.ProductCategory = productCategory;
            //productData.Gallery = gallery;
            //productData.Thumbnail = "/imgs/productDetail4/1.jpg";
            //productData.Gallery = images.Select(x => x.ImagePath).ToList();

            //var productData = new StoreProductDetailModel()
            //{
            //    Id = new Guid("01F0AD52-F74A-472F-76C3-08DC6376AAC6"),
            //    Code = 1,
            //    Name = "The Catcher in the Rye 2",
            //    Thumbnail = "/imgs/productDetail4/1.jpg",
            //    UrlSEO = request.Url,
            //    Gallery = gallery,
            //    ProductCategory = productCategory,
            //    ProductPrices = productPrices,
            //    Description = "Fam locavore kickstarter distillery. Mixtape chillwave tumeric sriracha taximy chia microdosing tilde DIY.XOXO fam indxgo juiceramps cornhole raw denim forage brooklyn.Everyday carry +1 seitan poutine tumeric.Gastropub blue bottle austin listicle pour-over, neutra jean shorts keytar banjo tattooed umami cardigan.",
            //};

            return productData;
        }
    }
}
