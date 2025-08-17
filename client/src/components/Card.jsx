const Card = ({ 
  children, 
  title,
  subtitle,
  className = "", 
  hover = false,
  padding = "md",
  ...props 
}) => {
  const baseClasses = `
    bg-white rounded-xl shadow-sm border border-gray-200
    transition-all duration-200 overflow-hidden
    ${hover ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : ''}
  `;

  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      {(title || subtitle) && (
        <div className="border-b border-gray-100 p-5 mb-4">
          {title && (
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      )}
      <div className={paddingClasses[padding]}>
        {children}
      </div>
    </div>
  );
};

export default Card;
