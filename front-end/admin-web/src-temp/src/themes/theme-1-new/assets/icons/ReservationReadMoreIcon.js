export function ReservationReadMoreIcon(props)  {
    const { fill, width = 38, height = 38 } = props;
    return (
      <svg width={width} height={height} viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_1629_360)">
          <circle cx="19" cy="15" r="14.5" fill="white" stroke="#CDCDCD" />
          <g clip-path="url(#clip0_1629_360)">
            <path
              d="M24.9722 8H12.9722C11.8953 8 11 8.89531 11 10V20C11 21.1047 11.8953 22 12.9719 22H24.9719C26.0766 22 26.9719 21.1047 26.9719 20V10C26.9722 8.89531 26.1034 8 24.9722 8ZM14.4722 10C15.3006 10 15.9722 10.6716 15.9722 11.5C15.9722 12.3284 15.3284 13 14.4722 13C13.6159 13 12.9722 12.3284 12.9722 11.5C12.9722 10.6716 13.6715 10 14.4722 10ZM24.9409 19.7375C24.8534 19.9 24.6847 20 24.5003 20H13.5631C13.3749 20 13.2028 19.8944 13.1175 19.7266C13.0322 19.5588 13.0483 19.3575 13.1592 19.2053L15.3467 16.2053C15.4409 16.075 15.5909 16 15.7503 16C15.9097 16 16.0602 16.0763 16.1543 16.2054L17.1687 17.5964L20.0843 13.2495C20.1784 13.0844 20.3347 13 20.5003 13C20.6659 13 20.8237 13.0835 20.9162 13.2227L24.9162 19.2227C25.019 19.375 25.0284 19.5719 24.9409 19.7375Z"
              fill={fill}
            />
          </g>
        </g>
        <defs>
          <filter
            id="filter0_d_1629_360"
            x="0"
            y="0"
            width="38"
            height="38"
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
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.545098 0 0 0 0 0.494118 0 0 0 0 0.129412 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1629_360" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1629_360" result="shape" />
          </filter>
          <clipPath id="clip0_1629_360">
            <rect width="16" height="16" fill="white" transform="translate(11 7)" />
          </clipPath>
        </defs>
      </svg>
    );
  };