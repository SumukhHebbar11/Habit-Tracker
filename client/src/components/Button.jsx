import { useState, useCallback } from "react";

const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  disabled = false, 
  loading = false, 
  onClick, 
  className = "",
  ...props 
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = useCallback(() => setIsPressed(true), []);
  const handleMouseUp = useCallback(() => setIsPressed(false), []);
  const handleMouseLeave = useCallback(() => setIsPressed(false), []);

  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 transform focus:outline-none focus:ring-4
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${isPressed ? 'scale-95' : 'hover:scale-105'}
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-blue-500 to-blue-600 text-white
      hover:from-blue-600 hover:to-blue-700 focus:ring-blue-300
      shadow-lg hover:shadow-xl
    `,
    secondary: `
      bg-gray-200 text-gray-800 hover:bg-gray-300
      focus:ring-gray-300 border border-gray-300
    `,
    success: `
      bg-gradient-to-r from-green-500 to-green-600 text-white
      hover:from-green-600 hover:to-green-700 focus:ring-green-300
      shadow-lg hover:shadow-xl
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600 text-white
      hover:from-red-600 hover:to-red-700 focus:ring-red-300
      shadow-lg hover:shadow-xl
    `,
    outline: `
      border-2 border-blue-500 text-blue-500 bg-transparent
      hover:bg-blue-50 focus:ring-blue-300
    `,
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
