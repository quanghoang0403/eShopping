function SwiperLeftIconCustomize({ color }) {
  return (
    <svg width="61" height="65" viewBox="0 0 61 65" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_264_43105)">
        <rect x="8.38672" y="12.1611" width="40" height="40" rx="12" fill="white" shape-rendering="crispEdges" />
        <path
          d="M32.3867 24.1611L24.4701 32.0778L32.3867 39.9945"
          stroke={color ? "#DB4D29" : "#51526C"}
          strokeWidth="0.95"
          strokeLinecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_264_43105"
          x="-3.61328"
          y="0.161133"
          width="64"
          height="64"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="6" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_264_43105" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_264_43105" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}

export default SwiperLeftIconCustomize;
