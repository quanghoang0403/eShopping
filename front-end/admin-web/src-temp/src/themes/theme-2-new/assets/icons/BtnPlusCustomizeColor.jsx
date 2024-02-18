export const IconBtnPlusCustomize = (props) => {
  const { color, stroke = "white" } = props;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.00012207" y="6.10352e-05" width="23.9999" height="23.9999" rx="11.9999" fill={color} />
      <path
        d="M7.72865 12H16.271"
        stroke={stroke}
        strokeWidth="0.915248"
        strokeLinecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M11.9999 16.2711L11.9999 7.7288"
        stroke={stroke}
        strokeWidth="0.915248"
        strokeLinecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
