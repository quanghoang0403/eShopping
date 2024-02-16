import countryDataService from "../../data-services/country-data.service";

export const getCountriesAsync = async () => {
  const response = await countryDataService.getCountryList();
  if (response && response.data) {
    return response.data;
  }

  return [];
};
