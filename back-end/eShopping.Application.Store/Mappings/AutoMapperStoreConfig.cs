using AutoMapper;

namespace eShopping.Application.Store.Mappings
{
    public static class AutoMapperStoreConfig
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
            cfg.AddProfile(new StoreGeneralProfile());
        }
    }
}
