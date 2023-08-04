import React from "react";

interface IProps {
  name: string;
  color: string;
  size: string;
  svg: any;
}

const SVGComp = (props: IProps) => {
  const { name, color, size, svg } = props;
  return (
    <svg
      className={`icon icon-${name}`}
      fill={color}
      width={size}
      height={size}>
      <use xlinkHref={`${svg}#icon-${name}`} />
    </svg>
  );
};

export default SVGComp;
