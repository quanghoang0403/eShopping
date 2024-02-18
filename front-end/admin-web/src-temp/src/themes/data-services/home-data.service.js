const getAllDataHome = (storeId) => {
  let data = [
    {
      name: "Store",
    },
  ];
  let storeDetail = data?.find((s) => s.storeId == storeId);
  return storeDetail;
};

const homeDataService = {
  getAllDataHome,
};
export default homeDataService;
