import React from "react";
import "./OverlayLoadingFullScreenComponent.scss";
import loadingOrangeGif from "./loading.gif";

function OverlayLoadingFullScreenComponent() {
  return (
    <div className="overlay-loading-full-screen">
      <img src={loadingOrangeGif} />
    </div>
  );
}

export default OverlayLoadingFullScreenComponent;
