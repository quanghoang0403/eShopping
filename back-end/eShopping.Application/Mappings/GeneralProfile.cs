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

            CreateMap<PermissionGroup, AdminPermissionGroupDetailModel>();
            CreateMap<PermissionGroup, AdminPermissionGroupModel>();
            CreateMap<Permission, AdminPermissionModel>();

            CreateMap<Image, ImageModel>();

            CreateMap<Product, AdminProductDatatableModel>();
            CreateMap<Product, AdminProductDetailModel>();
            CreateMap<Product, AdminProductModel>();

            CreateMap<Promotion, AdminPromotionModel>();
            CreateMap<Promotion, AdminPromotionDetailModel>();

            #endregion

            #region DAL => DTO
            CreateMap<AdminCreateProductCategoryRequest, ProductCategory>();
            CreateMap<AdminCreateProductRequest, Product>();
            CreateMap<AdminUpdateProductCategoryRequest, ProductCategory>();
            CreateMap<AdminUpdateProductRequest, Product>();
            CreateMap<AdminProductPriceModel, ProductPrice>();
            #endregion
        }
    }
}