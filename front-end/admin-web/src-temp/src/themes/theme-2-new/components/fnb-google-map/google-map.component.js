import React, { useState } from "react";
import { GoogleMap, useLoadScript, Marker, useJsApiLoader } from "@react-google-maps/api";
import { getStorage, localStorageKeys } from "../../../utils/localStorage.helpers";

const { forwardRef, useImperativeHandle } = React;

export const GoogleMapComponent = forwardRef((props, ref) => {
  const { zoom, className } = props;
  const [center, setCenter] = useState({ lat: 10.8131407, lng: 106.6656007 }); ///Default location, we will update get store branch location soon
  const defaultZoom = 15;
  const googleApiKey = JSON.parse(getStorage(localStorageKeys.STORE_CONFIG))?.googleApiKey ?? "";

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleApiKey,
    libraries: ["places"],
  });

  useImperativeHandle(ref, () => ({
    setCenter(center) {
      setCenter(center);
    },
  }));

  return isLoaded ? (
    <GoogleMap mapContainerClassName={className} center={center} zoom={zoom ?? defaultZoom}>
      {center && <Marker position={center}></Marker>}
    </GoogleMap>
  ) : (
    <></>
  );
});
