
import React from 'react';
import { Heart, Phone } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold text-primary">First Aid AI Guide</h2>
        </div>
        <a 
          href="tel:911" 
          className="flex items-center gap-2 rounded-md bg-emergency px-3 py-2 text-sm font-medium text-emergency-foreground hover:bg-emergency/90"
        >
          <Phone className="h-4 w-4" />
          Emergency: 911
        </a>
      </div>
    </header>
  );
};

export default Header;
