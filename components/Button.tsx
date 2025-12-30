import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "relative font-teko uppercase font-bold tracking-widest transition-all duration-200 clip-path-slant disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden";
  
  const variants = {
    primary: "bg-yellow-500 hover:bg-yellow-400 text-black border-l-4 border-white",
    secondary: "bg-slate-800 hover:bg-slate-700 text-white border-l-4 border-yellow-500/50",
    danger: "bg-red-900/80 hover:bg-red-800 text-white border-l-4 border-red-500",
    ghost: "bg-transparent hover:bg-white/10 text-white border border-white/20"
  };

  const sizes = "text-xl py-2 px-6";
  const width = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes} ${width} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      {/* Glitch effect overlay on hover could go here */}
    </button>
  );
};

export default Button;
