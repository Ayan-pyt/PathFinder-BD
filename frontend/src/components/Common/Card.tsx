import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glowColor?: 'purple' | 'cyan' | 'green' | 'none';
  onClick?: () => void;
}

export default function Card({
  children,
  className = '',
  hoverEffect = true,
  glowColor = 'none',
  onClick
}: CardProps) {
  const glowStyles = {
    purple: "hover:border-indigo-300 hover:shadow-indigo-100 hover:shadow-lg",
    cyan: "hover:border-blue-300 hover:shadow-blue-100 hover:shadow-lg",
    green: "hover:border-emerald-300 hover:shadow-emerald-100 hover:shadow-lg",
    none: ""
  };

  const containerClasses = `glass-panel p-6 ${
    hoverEffect ? 'glass-panel-hover' : ''
  } ${glowStyles[glowColor]} ${className}`;

  if (onClick) {
    return (
      <motion.div
        whileHover={hoverEffect ? { scale: 1.01, y: -2 } : {}}
        whileTap={hoverEffect ? { scale: 0.99 } : {}}
        onClick={onClick}
        className={`${containerClasses} cursor-pointer`}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
}
