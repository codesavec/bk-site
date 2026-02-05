'use client';

import { BankLogo } from './BankLogo';
import { Menu, Bell, LogOut, X, LayoutDashboard, Send, PiggyBank, CreditCard, History, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface TopNavProps {
  userName?: string;
  userInitial?: string;
}

export function TopNav({ userName: propsName, userInitial: propsInitial }: TopNavProps) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const displayUser = user?.fullName || propsName || 'User';
  const displayInitial = user?.fullName?.[0] || propsInitial || 'U';

  const isUserAdmin = user?.role === 'admin';

  const navItems = isUserAdmin ? [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: UserIcon },
    { href: '/admin/requests', label: 'Requests', icon: CreditCard },
    { href: '/admin/transactions', label: 'Transactions', icon: History },
  ] : [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/transfer', label: 'Transfer', icon: Send },
    { href: '/saving', label: 'Saving', icon: PiggyBank },
    { href: '/withdraw-deposit', label: 'Withdraw/Deposit', icon: CreditCard },
    { href: '/transaction-history', label: 'History', icon: History },
    { href: '/profile', label: 'Profile', icon: UserIcon },
    { href: '/cards', label: 'Cards', icon: CreditCard },
  ];

  return (
    <>
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
            <button 
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
                <Menu size={24} />
            </button>
            <BankLogo className="text-primary-foreground scale-90 sm:scale-100" />
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors hidden sm:block">
            <Bell size={20} />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-foreground/30 rounded-full flex items-center justify-center text-sm font-bold">
              {displayInitial}
            </div>
            <span className="text-sm font-medium hidden lg:inline">
              {displayUser}
            </span>
          </div>

          <button 
            onClick={logout}
            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-100 flex items-center gap-2 text-xs"
            title="Logout"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="bg-blue-600 text-white text-[10px] sm:text-xs px-4 py-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <p>
          NOTICE: We are committed to providing a secured and convenient banking
          experience to all our customers through excellent services powered by
          state of art technologies...
        </p>
      </div>
    </header>

    {/* Mobile Overlay */}
    {mobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-[60] md:hidden"
            onClick={() => setMobileMenuOpen(false)}
        />
    )}

    {/* Mobile Side Nav */}
    <div className={`fixed inset-y-0 left-0 w-72 bg-primary text-primary-foreground z-[70] transform transition-transform duration-300 md:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <BankLogo className="text-white" />
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-lg">
                <X size={24} />
            </button>
        </div>
        
        <div className="p-4 space-y-2">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-4 mb-4">
                {isUserAdmin ? 'Admin Menu' : 'Main Menu'}
            </p>
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            isActive 
                            ? 'bg-white/20 text-white shadow-lg' 
                            : 'hover:bg-white/10 text-white/70'
                        }`}
                    >
                        <Icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </Link>
                );
            })}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
            <button 
                onClick={logout}
                className="flex items-center gap-3 px-4 py-4 w-full rounded-xl hover:bg-red-500/20 text-red-100 transition-colors"
            >
                <LogOut size={20} />
                <span className="font-bold">Sign Out</span>
            </button>
        </div>
    </div>
    </>
  );
}