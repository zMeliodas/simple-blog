const CustomSpinner = ({ size = "w-4 h-4", color = "border-white" }) => {
  return (
    <div
      className={`inline-block ${size} border-2 ${color} border-t-transparent rounded-full animate-spin`}
    ></div>
  );
};

export default CustomSpinner;
