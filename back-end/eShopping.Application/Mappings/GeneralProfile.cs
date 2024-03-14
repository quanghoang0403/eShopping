using AutoMapper;
using eShopping.Application.Features.Products.Commands;
using eShopping.Domain.Entities;
using eShopping.Models.Addresses;
using eShopping.Models.Commons;
using eShopping.Models.Permissions;
using eShopping.Models.Products;
using eShopping.Models.Promotions;

namespace eShopping.Application.Mappings
{
    public class GeneralProfile : Profile
    {
        public GeneralProfile()
        {
            #region DTO => DAL 
            CreateMap<City, CityModel>();
            CreateMap<District, DistrictModel>();
            CreateMap<Ward, WardModel>();

            CreateMap<PermissionGroup, PermissionGroupDetailModel>();
            CreateMap<PermissionGroup, PermissionGroupModel>();
            CreateMap<Permission, PermissionModel>();

            CreateMap<Image, ImageModel>();

            CreateMap<Product, ProductDatatableModel>();
            CreateMap<Product, ProductDetailModel>();
            CreateMap<Product, ProductModel>();

            CreateMap<Promotion, PromotionModel>();
            CreateMap<Promotion, PromotionDetailModel>();

            #endregion

            #region DAL => DTO
            CreateMap<CreateProductCategoryRequest, ProductCategory>();
            CreateMap<CreateProductRequest, Product>();
            CreateMap<UpdateProductCategoryRequest, ProductCategory>();
            CreateMap<UpdateProductRequest, Product>();
            CreateMap<ProductPriceModel, ProductPrice>();
            #endregion
        }
    }
}