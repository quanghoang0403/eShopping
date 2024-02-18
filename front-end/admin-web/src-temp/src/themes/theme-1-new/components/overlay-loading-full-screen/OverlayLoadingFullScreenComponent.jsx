import React from "react";
import { FnbLoadingSpinner } from "../fnb-loading-spinner/fnb-loading-spinner.component";
import "./OverlayLoadingFullScreenComponent.scss";

function OverlayLoadingFullScreenComponent() {
  return (
    <div className="overlay-loading-full-screen">
      <FnbLoadingSpinner />
    </div>
  );
}

export default OverlayLoadingFullScreenComponent;
