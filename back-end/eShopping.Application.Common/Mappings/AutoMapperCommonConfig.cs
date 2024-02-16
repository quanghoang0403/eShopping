using AutoMapper;

namespace eShopping.Application.Common.Mappings
{
    public static class AutoMapperCommonConfig
    {
        private static MapperConfiguration _cfg;
        private static readonly object _lock = new object();

        public static MapperConfiguration Configure()
        {
            _cfg = new MapperConfiguration(cfg =>
            {
                ConfigureInternal(cfg);
            });

            return _cfg;
        }

        private static void ConfigureInternal(IMapperConfigurationExpression cfg)
        {
            cfg.AddProfile(new GeneralProfile());
        }
    }
}
