
import React from 'react';

export interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="bg-gradient-to-r from-primary-darker to-primary/90 py-12 px-4 shadow-md">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-primary-foreground/90 mt-2">{subtitle}</p>}
      </div>
    </header>
  );
};

export default Header;
