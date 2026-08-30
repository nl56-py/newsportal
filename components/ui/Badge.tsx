import React from "react";
import clsx from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "red" | "dark" | "blue" | "outline" | "gold";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "red",
  className,
  size = "sm",
}) => {
  const baseStyles = "inline-flex items-center font-mukta font-bold tracking-wide transition-colors";
  
  const sizeStyles = {
    sm: "text-xs px-2 py-0.5 rounded",
    md: "text-sm px-2.5 py-1 rounded",
    lg: "text-base px-3 py-1.5 rounded-md",
  };

  const variantStyles = {
    red: "bg-brand-red text-white hover:bg-brand-darkred",
    dark: "bg-brand-navy text-white hover:bg-black",
    blue: "bg-blue-700 text-white hover:bg-blue-800",
    outline: "border border-brand-red text-brand-red bg-white hover:bg-brand-lightred",
    gold: "bg-amber-500 text-slate-900 font-bold",
  };

  return (
    <span
      className={clsx(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
