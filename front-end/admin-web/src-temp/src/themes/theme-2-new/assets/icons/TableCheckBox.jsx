function TableCheckBoxIconCustomize({ color, isSelected }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10.5"  opacity={0.5} />
      <circle cx="12" cy="12" r="10.5"  />
      <circle cx="12" cy="12" r="11.2391" stroke="#282828" stroke-opacity="0.1" stroke-width="1.47812" />
      <circle cx="12" cy="12" r="9.76094" stroke="#DB4D29" stroke-width="1.47812" />
      <circle cx="12" cy="12" r="6.5625" fill={isSelected ? "#DB4D29" : ""} />
    </svg>
  );
}

export default TableCheckBoxIconCustomize;
