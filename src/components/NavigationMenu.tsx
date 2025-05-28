
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NavigationMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Login', href: '#', disabled: true },
    { label: 'Dashboard', href: '/admin' },
    { label: 'Meeting', href: '/meeting' }
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className={`text-gray-600 hover:text-gray-900 transition-colors ${
              item.disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={(e) => item.disabled && e.preventDefault()}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Navigation */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px]">
          <div className="flex flex-col space-y-4 mt-8">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`text-lg text-gray-600 hover:text-gray-900 transition-colors py-2 ${
                  item.disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={(e) => {
                  if (item.disabled) {
                    e.preventDefault();
                  } else {
                    setIsOpen(false);
                  }
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
