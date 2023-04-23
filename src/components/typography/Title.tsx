import "./typography.css";

const Title = ({ children, secondary = false, ...restProps }) => {
  return (
    <div>
      <h1
        className={`text-lg text-${
          secondary ? "pink" : "primary"
        } font-semibold font-poppins`}
        {...restProps}
      >
        {children}
      </h1>
    </div>
  );
};

Title.h2 = ({ children, underline = false, ...restProps }) => {
  return (
    <h2
      className={`text-lg font-medium text-primary font-poppins relative ${
        underline ? "_underline" : ""
      }`}
    >
      {children}
    </h2>
  );
};

export default Title;
