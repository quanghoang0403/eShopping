namespace eShopping.Models.Common.Address
{
    public class DistrictModel
    {
        public int? Id { get; set; }

        public int CityId { get; set; }

        public string Name { get; set; }

        public string Prefix { get; set; }
    }
}
