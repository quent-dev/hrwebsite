'use client';

import Link from 'next/link';
import { useAuth } from '../../lib/context/auth-context';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Moon, Sun, CalendarIcon, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { usePermissions } from '@/src/lib/utils/permissions';
import { useRouter } from 'next/navigation';
import { signOutUser } from '../../lib/firebase/auth';
import { toast } from 'sonner';

export function Navbar() {
  const { user, loading, userProfile } = useAuth();
  const permissions = usePermissions(userProfile);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Profile', href: '/profile' },
    { label: 'Time Off', href: '/time-off' },
    {
      label: "Calendar",
      href: "/calendar",
      icon: CalendarIcon // Import from lucide-react if using icons
    }
  ];

  const handleSignOut = async () => {
    try {
      await signOutUser()
      toast.success("Signed out successfully")
      router.push("/login")
    } catch (error) {
      toast.error("Error signing out")
    }
  }

  if (loading) return null;

  return (
    <nav className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                HR Portal
              </h1>
            </div>
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      pathname === item.href
                        ? `border-blue-500 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`
                        : `border-transparent ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                {permissions.isAdmin() && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Admin
                  </Link>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-500 dark:text-gray-300">
                  {user.email}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
                >
                  Login
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
