import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { useLogout } from '@/hooks/use-logout';
import { ChevronDown, Clock, File, LogOut, User, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const { pathname } = useLocation();

  const { user } = useAuth();

  const handleLogout = useLogout();

  if (!user) return null;

  const navigationItems = [
    {
      label: 'Chronologies',
      href: '/chronologies',
      icon: Clock,
      roles: ['ADMIN', 'FINANCE'],
    },
    {
      label: 'Users',
      href: '/users',
      icon: Users,
      roles: ['ADMIN'],
    },
  ];

  const visibleItems = navigationItems.filter((item) => item.roles.includes(user.role));

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/20 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-black/20">
      <div className="flex h-16 items-center px-6">
        <Link to="/chronologies" className="mr-8 flex items-center space-x-2">
          <div className="gradient-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <File className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold">AlbaShoes</span>
        </Link>

        <div className="flex flex-1 items-center space-x-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className={`flex items-center space-x-2 ${
                    isActive
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-white/10 dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center space-x-2">
          <ThemeSwitcher />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-white/10"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-white/20">
                  <User className="h-4 w-4" />
                </div>
                <div className="hidden text-left md:block">
                  <p className="text-sm font-medium">
                    {user.name} {user.surname}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-300">{user.role}</p>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">
                    {user.name} {user.surname}
                  </p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center space-x-2 text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
