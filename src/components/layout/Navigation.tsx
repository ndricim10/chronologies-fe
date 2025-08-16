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
import { ChevronDown, Clock, FileText, LogOut, User, Users } from 'lucide-react';
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
    <nav className="glass sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-16 items-center">
        <Link to="/chronologies" className="mr-8 flex items-center space-x-2">
          <div className="gradient-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold">ChronoFlow</span>
        </Link>

        <div className="flex flex-1 items-center space-x-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} to={item.href}>
                <Button variant={isActive ? 'default' : 'ghost'} size="sm" className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium">
                  {user.name} {user.surname}
                </p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
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
    </nav>
  );
}
