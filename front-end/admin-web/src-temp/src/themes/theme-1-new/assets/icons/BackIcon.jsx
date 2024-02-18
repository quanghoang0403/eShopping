export const BackIcon = (props) => {
  const { color = "black" } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 18 16" fill="none">
      <path
        d="M8.4375 14.75L1.6875 8L8.4375 1.25M2.625 8H16.3125"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
