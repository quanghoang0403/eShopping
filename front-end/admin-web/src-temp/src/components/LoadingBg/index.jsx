import React from "react";
import "./index.scss";

const LoadingBg = () => {
  return (
    <div className="loading-bg d-flex" style={{ background: "#fcfcff", width: "100%" }}>
      <div className="m-auto">
        <img atl="loading" src="/images/loading.gif" />
      </div>
    </div>
  );
};

export default LoadingBg;
