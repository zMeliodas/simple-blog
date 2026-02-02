const CustomSpinner = ({
  size = "w-4 h-4",
  color = "border-white",
  mt = "mt-1",
}) => {
  return (
    <div
      className={`inline-block ${size} border-2 ${color} border-t-transparent rounded-full animate-spin ${mt}`}
    ></div>
  );
};

export default CustomSpinner;
