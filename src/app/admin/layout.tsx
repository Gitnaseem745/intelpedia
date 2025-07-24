'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AdminGuard from '@/components/AdminGuard';
import { 
  LayoutDashboard,
  Wrench,
  Plus,
  Clock,
  Settings,
  Menu,
  X,
  Home
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Home',
    href: '/',
    icon: Home
  },
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard
  },
  {
    title: 'All Tools',
    href: '/admin/tools',
    icon: Wrench
  },
  {
    title: 'Add New Tool',
    href: '/admin/tools/new',
    icon: Plus
  },
  {
    title: 'Pending Submissions',
    href: '/admin/tools/pending',
    icon: Clock
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    disabled: true
  }
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const NavigationContent = () => (
    <div className="flex h-full flex-col bg-card border-r">
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold text-foreground">Admin Panel</h2>
      </div>
      
      <nav className="flex-1 space-y-2 p-4">
        {navigationItems.map((item) => {
          // Special handling for Home link (not an admin route)
          const isActive = item.href === '/' 
            ? false // Home is never "active" in admin context
            : pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.disabled ? '#' : item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                item.disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="border-t p-4">
        <div className="text-xs text-muted-foreground">
          Admin Dashboard v1.0
        </div>
      </div>
    </div>
  );

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        {/* Desktop Sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <NavigationContent />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <NavigationContent />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="lg:pl-64">
          {/* Mobile Header */}
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm lg:hidden">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
            
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-foreground">Admin Panel</h1>
            </div>
          </div>

          {/* Page Content */}
          <main className="p-4 md:-mb-12 lg:p-8 lg:mt-8">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
