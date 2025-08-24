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
import { useTheme } from '@/hooks/use-theme';
import { ChevronDown, Clock, LogOut, Moon, Sun, User, Users } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo_alban.png';

export default function Navigation() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const handleLogout = useLogout();
  const { theme, setTheme } = useTheme();

  if (!user) return null;

  const navigationItems = [
    { label: 'Chronologies', href: '/chronologies', icon: Clock, roles: ['ADMIN', 'FINANCE'] },
    { label: 'Users', href: '/users', icon: Users, roles: ['ADMIN'] },
  ];

  const visibleItems = navigationItems.filter((item) => item.roles.includes(user.role));

  const menuItems = [
    {
      type: 'link',
      label: 'Profile',
      icon: User,
      href: '/profile',
    },
    {
      type: 'theme',
      label: 'Light theme',
      icon: Sun,
      action: () => setTheme('light'),
      active: theme === 'light',
    },
    {
      type: 'theme',
      label: 'Dark theme',
      icon: Moon,
      action: () => setTheme('dark'),
      active: theme === 'dark',
    },
    {
      type: 'action',
      label: 'Sign out',
      icon: LogOut,
      action: handleLogout,
      className: 'font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-700 dark:hover:text-white',
    },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/20 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-black/20">
      <div className="flex h-16 items-center px-6">
        <Link to="/chronologies" className="mt-5 flex items-center p-2">
          <div className="mb-6">
            <img src={logo} alt="Alba&N - Produttori di Scarpe Antinfortunistiche" width={50} height={50} />
          </div>
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

              {menuItems.map((item, idx) => {
                if (item.type === 'link') {
                  return (
                    <DropdownMenuItem asChild key={idx}>
                      <div onClick={() => navigate(`/${item.href}`)} className="flex items-center space-x-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </div>
                    </DropdownMenuItem>
                  );
                }

                if (item.type === 'theme') {
                  return (
                    <DropdownMenuItem key={idx} onClick={item.action} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                      {item.active && <span className="ml-auto">✓</span>}
                    </DropdownMenuItem>
                  );
                }

                if (item.type === 'action') {
                  return (
                    <DropdownMenuItem
                      key={idx}
                      onClick={item.action}
                      className={`flex items-center space-x-2 ${item.className}`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </DropdownMenuItem>
                  );
                }

                return null;
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
