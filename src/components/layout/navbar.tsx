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
import { cn } from '@/src/lib/utils';

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
      icon: CalendarIcon
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">HR Portal</span>
          </Link>
          {user && (
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    pathname === item.href ? "text-foreground" : "text-foreground/60"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              {permissions.isAdmin() && (
                <Link
                  href="/admin"
                  className={cn(
                    "flex items-center transition-colors hover:text-foreground/80",
                    pathname === '/admin' ? "text-foreground" : "text-foreground/60"
                  )}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Admin
                </Link>
              )}
            </nav>
          )}
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {user ? (
            <>
              <span className="text-sm text-foreground/60">
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
                className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
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
    </header>
  );
}
