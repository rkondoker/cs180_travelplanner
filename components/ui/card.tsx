import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className = "rounded-xl shadow-lg p-4 bg-white", children, ...props }, ref) => (
  <div ref={ref} className={className} {...props}>
    {children}
  </div>
));

Card.displayName = "Card"; 