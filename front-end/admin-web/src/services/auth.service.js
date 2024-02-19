import { claimTypesConstants } from "constants/claim-types.constants";
import jwt_decode from "jwt-decode";
import { store } from "store";
import { getStorage, localStorageKeys } from "utils/localStorage.helpers";

export const getToken = () => {
  const { session } = store.getState();
  let token = session?.auth?.token;
  if (!token) {
    token = getStorage(localStorageKeys.TOKEN);
  }

  return token;
};

export const getUserInfo = () => {
  const loginToken = getToken();
  if (loginToken) {
    const claims = jwt_decode(loginToken);
    const user = {
      userId: claims[claimTypesConstants.id],
      accountId: claims[claimTypesConstants.accountId],
      fullName: claims[claimTypesConstants.fullName],
      email: claims[claimTypesConstants.email],
      accountType: claims[claimTypesConstants.accountType],
      thumbnail: claims[claimTypesConstants.thumbnail],
    };

    return user;
  }

  return null;
};
