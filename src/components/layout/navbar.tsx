'use client';

import Link from 'next/link';
import { useAuth } from '../../lib/context/auth-context';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Menu, Moon, Sun, CalendarIcon, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { usePermissions } from '@/src/lib/utils/permissions';
import { useRouter } from 'next/navigation';
import { signOutUser } from '../../lib/firebase/auth';
import { toast } from 'sonner';
import { cn } from '@/src/lib/utils';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '../ui/sheet';
import { useState } from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export function Navbar() {
  const { user, loading, userProfile } = useAuth();
  const permissions = usePermissions(userProfile);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(false);

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

  if (permissions.isAdmin()) {
    navItems.push({
      label: "Admin",
      href: "/admin",
      icon: LayoutDashboard
    });
  }

  const handleSignOut = async () => {
    try {
      await signOutUser()
      toast.success("Signed out successfully")
      router.push("/login")
    } catch (error) {
      toast.error("Error signing out")
    }
  }

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  if (loading) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-6">
          {user && (
            <Sheet open={open} onOpenChange={setOpen}>
              <VisuallyHidden asChild>
                <SheetTitle>Navigation</SheetTitle>
              </VisuallyHidden>
              
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <nav className="flex flex-col space-y-4 mt-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center space-x-2 text-sm font-medium transition-colors",
                        isActive(item.href)
                          ? "text-primary"
                          : "text-foreground/60 hover:text-foreground"
                      )}
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          )}
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">HR Portal</span>
          </Link>
          {user && (
            <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 transition-colors relative py-4",
                    isActive(item.href)
                      ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary"
                      : "text-foreground/60 hover:text-foreground"
                  )}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          )}
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-foreground/60">
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
                <span className="hidden sm:inline">Sign Out</span>
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
