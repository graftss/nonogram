import React from 'react';

export default ({
  index,
  onClick,
}) => (
  <div onClick={() => onClick(index)}></div>
);
