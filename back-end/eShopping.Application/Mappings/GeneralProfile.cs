using AutoMapper;
using eShopping.Application.Features.Blogs.Commands;
using eShopping.Application.Features.Products.Commands;
using eShopping.Common.Helpers;
using eShopping.Domain.Entities;
using eShopping.Models.Addresses;
using eShopping.Models.Blog;
using eShopping.Models.Commons;
using eShopping.Models.Orders;
using eShopping.Models.Permissions;
using eShopping.Models.Products;
using System.Linq;

namespace eShopping.Application.Mappings
{
    public class GeneralProfile : Profile
    {
        public GeneralProfile()
        {
            #region DTO => DAL 
            CreateMap<City, CityModel>();
            CreateMap<District, DistrictModel>();
            CreateMap<Ward, WardModel>().ForMember(dest => dest.Name, opt => opt.MapFrom(src => $"{src.Prefix} {src.Name}"));

            CreateMap<Image, AdminImageModel>();

            CreateMap<Order, AdminOrderModel>()
                .ForMember(dest => dest.CreatedTime, opt => opt.MapFrom(src => src.CreatedTime));
            CreateMap<Order, StoreOrderModel>();
            CreateMap<Order, AdminOrderDetailModel>();
            CreateMap<Order, StoreOrderDetailModel>();
            CreateMap<OrderItem, AdminOrderItemModel>();
            CreateMap<OrderItem, StoreOrderItemModel>();
            CreateMap<OrderItem, StoreOrderModel.OrderItemDto>();

            CreateMap<Customer, AdminOrderModel.CustomerDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.Account.FullName))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.Account.PhoneNumber));
            CreateMap<Customer, AdminOrderDetailModel.CustomerDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.Account.FullName))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.Account.PhoneNumber));
            CreateMap<OrderItem, AdminOrderItemModel>();

            CreateMap<PermissionGroup, AdminPermissionGroupModel>();
            CreateMap<Permission, AdminPermissionModel>();

            CreateMap<ProductCategory, AdminProductCategoryDetailModel>();
            CreateMap<ProductCategory, StoreProductCategoryDetailModel>();
            CreateMap<ProductCategory, AdminProductCategoryModel>();

            CreateMap<Product, AdminProductDatatableModel>();
            CreateMap<Product, AdminProductDetailModel>();
            CreateMap<Product, StoreProductDetailModel>()
                .ForMember(dest => dest.IsNewIn, opt => opt.MapFrom(src => DatetimeHelpers.IsWithinPrevious14Days(src.CreatedTime)))
                .ForMember(dest => dest.IsSoldOut, opt => opt.MapFrom(src => src.ProductPrices.All(p => p.QuantityLeft <= 0)));
            CreateMap<Product, AdminProductModel>();
            CreateMap<Product, StoreProductModel>()
                .ForMember(dest => dest.IsNewIn, opt => opt.MapFrom(src => DatetimeHelpers.IsWithinPrevious14Days(src.CreatedTime)))
                .ForMember(dest => dest.IsSoldOut, opt => opt.MapFrom(src => src.ProductPrices.All(p => p.QuantityLeft <= 0)));


            CreateMap<ProductPrice, AdminProductPriceModel>();
            CreateMap<ProductPrice, StoreProductPriceModel>();

            CreateMap<Blog, AdminBlogModel>().ForMember(dest => dest.LastSavedTime, opt => opt.MapFrom(src => src.LastSavedTime));
            CreateMap<Blog, AdminBlogDetailModel>()
                .ForMember(dest => dest.LastSavedTime, opt => opt.MapFrom(src => src.LastSavedTime))
                .ForMember(dest => dest.CreatedTime, opt => opt.MapFrom(src => src.CreatedTime));
            CreateMap<BlogCategory, AdminBlogCategoryModel>();
            CreateMap<BlogCategory, AdminBlogCategoryDetailModel>();
            CreateMap<AdminImageModel, Image>();
            #endregion

            #region DAL => DTO
            CreateMap<AdminCreateProductCategoryRequest, ProductCategory>();
            CreateMap<AdminCreateBlogRequest, Blog>();
            CreateMap<AdminCreateBlogCategoryRequest, BlogCategory>();
            CreateMap<AdminCreateProductRequest, Product>();
            CreateMap<AdminUpdateBlogRequest, Blog>();
            CreateMap<AdminUpdateBlogCategoryRequest, BlogCategory>();
            CreateMap<AdminUpdateProductCategoryRequest, ProductCategory>();
            CreateMap<AdminUpdateProductRequest, Product>();
            CreateMap<AdminProductPriceModel, ProductPrice>();

            #endregion
        }
    }
}