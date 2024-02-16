using AutoMapper;
using eShopping.Domain.Entities;
using eShopping.Models.Common.Address;

namespace eShopping.Application.Common.Mappings
{
    public class GeneralProfile : Profile
    {
        public GeneralProfile()
        {
            CreateMap<City, CityModel>();
            CreateMap<District, DistrictModel>();
            CreateMap<Ward, WardModel>();
        }
    }
}