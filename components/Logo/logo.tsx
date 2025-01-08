import * as React from "react";

interface LogoSympProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
  className?: string;
}

const LogoSymp: React.FC<LogoSympProps> = ({
  size = 200,
  color = "black",
  className,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 200 200"
    className={className}
    {...props}
  >
    <circle cx={100} cy={50} r={40} fill={color} />
    <circle cx={55} cy={130} r={40} fill={color} />
    <circle cx={145} cy={130} r={40} fill={color} />
  </svg>
);

export default LogoSymp;
