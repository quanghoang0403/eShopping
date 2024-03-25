using AutoMapper;
using eShopping.Application.Features.Products.Commands;
using eShopping.Domain.Entities;
using eShopping.Models.Addresses;
using eShopping.Models.Commons;
using eShopping.Models.Orders;
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

            CreateMap<Image, AdminImageModel>();

            CreateMap<Order, AdminOrderModel>();
            CreateMap<Customer, AdminOrderModel.CustomerDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.Account.FullName))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.Account.PhoneNumber));
            CreateMap<Order, AdminOrderDetailModel>();
            CreateMap<Customer, AdminOrderDetailModel.CustomerDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.Account.FullName))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.Account.PhoneNumber));
            CreateMap<OrderItem, AdminOrderItemModel>();
            CreateMap<ProductPrice, AdminOrderItemModel.ProductPriceDto>();
            CreateMap<Product, AdminOrderItemModel.ProductPriceDto.ProductDto>();

            CreateMap<PermissionGroup, AdminPermissionGroupDetailModel>();
            CreateMap<PermissionGroup, AdminPermissionGroupModel>();
            CreateMap<Permission, AdminPermissionModel>();

            CreateMap<ProductCategory, AdminProductCategoryModel>();

            CreateMap<Product, AdminProductDatatableModel>();
            CreateMap<Product, AdminProductDetailModel>();
            CreateMap<ProductPrice, AdminProductPriceModel>();
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
            CreateMap<AdminImageModel, Image>();
            #endregion
        }
    }
}