using AutoMapper;
using eShopping.Application.Features.Blogs.Commands;
using eShopping.Application.Features.Products.Commands;
using eShopping.Domain.Entities;
using eShopping.Models.Addresses;
using eShopping.Models.Blog;
using eShopping.Models.Commons;
using eShopping.Models.Orders;
using eShopping.Models.Permissions;
using eShopping.Models.Products;

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

            CreateMap<PermissionGroup, AdminPermissionGroupDetailModel>();
            CreateMap<PermissionGroup, AdminPermissionGroupModel>();
            CreateMap<Permission, AdminPermissionModel>();

            CreateMap<ProductCategory, AdminProductCategoryDetailModel>();
            CreateMap<ProductCategory, StoreProductCategoryDetailModel>();
            CreateMap<ProductCategory, AdminProductCategoryModel>();

            CreateMap<Product, AdminProductDatatableModel>();
            CreateMap<Product, AdminProductDetailModel>();
            CreateMap<Product, StoreProductDetailModel>();
            CreateMap<Product, AdminProductModel>();

            CreateMap<ProductPrice, AdminProductPriceModel>();
            CreateMap<ProductPrice, StoreProductPriceModel>();
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
            CreateMap<Blog, AdminBlogModel>();
            CreateMap<Blog, AdminBlogDetailModel>();
            CreateMap<BlogCategory, AdminBlogCategoryModel>();
            CreateMap<AdminImageModel, Image>();
            CreateMap<BlogCategory, AdminBlogCategoryDetailModel>();
            #endregion
        }
    }
}