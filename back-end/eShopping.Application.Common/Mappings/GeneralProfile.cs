using AutoMapper;
using eShopping.Domain.Entities;
using eShopping.Models.Common.Address;
using eShopping.Models.Common.Permission;

namespace eShopping.Application.Common.Mappings
{
    public class GeneralProfile : Profile
    {
        public GeneralProfile()
        {
            CreateMap<City, CityModel>();
            CreateMap<District, DistrictModel>();
            CreateMap<Ward, WardModel>();

            CreateMap<PermissionGroup, PermissionGroupModel>();
            CreateMap<Permission, PermissionModel>();
        }
    }
}