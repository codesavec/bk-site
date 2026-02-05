'use client';

import { BankLogo } from './BankLogo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Send,
  PiggyBank,
  History,
  User,
  CreditCard,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transfer', label: 'Transfer', icon: Send },
  { href: '/saving', label: 'Saving', icon: PiggyBank },
  { href: '/withdraw-deposit', label: 'Withdraw/Deposit', icon: CreditCard },
  { href: '/transaction-history', label: 'Transaction History', icon: History },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/cards', label: 'Cards', icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="hidden md:flex w-60 bg-primary text-primary-foreground flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-primary-foreground/20">
        <BankLogo className="text-primary-foreground" />
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-foreground/20'
                  : 'hover:bg-primary-foreground/10'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-primary-foreground/20">
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-primary-foreground/10 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}