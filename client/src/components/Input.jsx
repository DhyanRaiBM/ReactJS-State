import React from 'react';

const Input = ({ type, placeholder, id, value, onChange,className,...props }) => {

  return (
    <input
      type={type}
      placeholder={placeholder}
      id={id}
      value={value}
      onChange={onChange}
      className={className?`${className}`:'border p-3 rounded-lg outline-none'}
      {...props}
    />
  );
};

export default Input;
