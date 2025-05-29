
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const NavigationMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  const menuItems = [
    { label: 'Project', href: '/project' },
    { label: 'Dashboard', href: '/admin' },
    { label: 'Meeting', href: '/meeting' },
    { label: 'Docs', href: 'https://github.com/Digitalizers-ge/sam-chatbot', external: true }
  ];

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        {menuItems.map((item) => (
          item.external ? (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <Link
              key={item.label}
              to={item.href}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {item.label}
            </Link>
          )
        ))}
        {user ? (
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="text-gray-600 hover:text-gray-900"
          >
            Sign Out
          </Button>
        ) : (
          <Link to="/login">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Login
            </Button>
          </Link>
        )}
      </nav>

      {/* Mobile Navigation - Fixed to top right */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur-sm shadow-md">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <div className="flex flex-col space-y-4 mt-8">
              {menuItems.map((item) => (
                item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg text-gray-600 hover:text-gray-900 transition-colors py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="text-lg text-gray-600 hover:text-gray-900 transition-colors py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              ))}
              {user ? (
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full mt-4 text-gray-600 hover:text-gray-900"
                >
                  Sign Out
                </Button>
              ) : (
                <Link
                  to="/login"
                  className="mt-4"
                  onClick={() => setIsOpen(false)}
                >
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};
