import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetSession } from "store/modules/session/session.actions";
import { tokenExpired } from "utils/helpers";
import { getStorage, localStorageKeys } from "utils/localStorage.helpers";
function Home(props) {

  const dispatch = useDispatch();

  useEffect(() => {
    let isTokenExpired = checkTokenExpired();
    if (isTokenExpired) {
      dispatch(resetSession());
      props.history.push("/login");
    } else {

    }
  }, []);

  const checkTokenExpired = () => {
    let isTokenExpired = true;
    let token = getStorage(localStorageKeys.TOKEN);
    if (token || token !== null) {
      isTokenExpired = tokenExpired(token);
    }
    return isTokenExpired;
  };

  return (
    <>Homepage</>
  );
}

export default Home;
