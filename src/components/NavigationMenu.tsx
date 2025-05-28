
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NavigationMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Project', href: '/project' },
    { label: 'Dashboard', href: '/admin' },
    { label: 'Meeting', href: '/meeting' },
    { label: 'Docs', href: '/docs' }
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            {item.label}
          </Link>
        ))}
        <Link to="/login">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Login
          </Button>
        </Link>
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
                className="text-lg text-gray-600 hover:text-gray-900 transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/login"
              className="mt-4"
              onClick={() => setIsOpen(false)}
            >
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Login
              </Button>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
