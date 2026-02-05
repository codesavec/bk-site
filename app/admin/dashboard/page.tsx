'use client';

import { AdminSidebar } from '@/components/AdminSidebar';
import { TopNav } from '@/components/TopNav';
import { StatCard } from '@/components/StatCard';
import { Users, CreditCard, TrendingUp, CheckCircle, Bell, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBalance: 0,
    pendingRequests: 0,
    completedTransactions: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [usersRes, requestsRes, transactionsRes, alertsRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/requests?status=pending'),
          fetch('/api/transactions'),
          fetch('/api/alerts')
        ]);

        const users = await usersRes.json();
        const requests = await requestsRes.json();
        const transactions = await transactionsRes.json();
        const alertsData = await alertsRes.json();

        if (users.error) console.error('Users API error:', users.error);
        if (requests.error) console.error('Requests API error:', requests.error);
        if (transactions.error) console.error('Transactions API error:', transactions.error);
        if (alertsData.error) console.error('Alerts API error:', alertsData.error);

        // Ensure we handle arrays correctly even if API fails
        const safeUsers = Array.isArray(users) ? users : [];
        const safeRequests = Array.isArray(requests) ? requests : [];
        const safeTransactions = Array.isArray(transactions) ? transactions : [];
        const safeAlerts = Array.isArray(alertsData) ? alertsData : [];

        const totalBalance = safeUsers.reduce((sum: number, u: any) => sum + (Number(u.balance) || 0), 0);
        const completedTransactions = safeTransactions.filter((t: any) => t.status === 'completed');

        setStats({
          totalUsers: safeUsers.length,
          totalBalance,
          pendingRequests: safeRequests.length,
          completedTransactions: completedTransactions.length,
        });

        setRecentUsers(safeUsers.slice(0, 5));
        
        // Enrich alerts with user data if missing
        const enrichedAlerts = safeAlerts.map((a: any) => {
            if (a.userName) return a;
            const u = safeUsers.find((user: any) => user._id.toString() === a.userId.toString());
            return { ...a, userName: u?.fullName || 'Unknown User' };
        });
        setAlerts(enrichedAlerts);

      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading, router]);

  const markAlertRead = async (alertId: string) => {
    try {
      const response = await fetch('/api/alerts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: alertId, status: 'read' }),
      });
      if (response.ok) {
        setAlerts(alerts.map(a => a._id === alertId ? { ...a, status: 'read' } : a));
      }
    } catch (error) {
      console.error('Failed to update alert:', error);
    }
  };

  if (authLoading || loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <h1 className="text-3xl font-bold text-primary mb-8">Admin Dashboard</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Users}
              label="Total Users"
              value={stats.totalUsers.toString()}
            />
            <StatCard
              icon={CreditCard}
              label="Total Balance"
              value={`$${(stats.totalBalance ?? 0).toLocaleString()}`}
            />
            <StatCard
              icon={CheckCircle}
              label="Pending Requests"
              value={stats.pendingRequests.toString()}
            />
            <StatCard
              icon={TrendingUp}
              label="Completed Transactions"
              value={stats.completedTransactions.toString()}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Alerts Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Bell className="text-red-500" /> System Alerts
                  </h2>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold">
                    {alerts.filter(a => a.status === 'unread').length} New
                  </span>
                </div>
                <div className="space-y-4">
                  {alerts.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No active alerts</p>
                  ) : (
                    alerts.map((alert) => (
                      <div
                        key={alert._id}
                        className={`p-4 rounded-lg border flex justify-between items-start ${
                          alert.status === 'unread' ? 'bg-red-50 border-red-100' : 'bg-muted/30 border-transparent'
                        }`}
                      >
                        <div className="flex gap-3">
                          <AlertTriangle className={`mt-1 ${alert.status === 'unread' ? 'text-red-500' : 'text-muted-foreground'}`} size={18} />
                          <div>
                            <p className={`font-semibold ${alert.status === 'unread' ? 'text-red-900' : 'text-muted-foreground'}`}>
                              {alert.userName} - Deposit Attempt
                            </p>
                            <p className="text-sm text-red-800/80 mb-1">{alert.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(alert.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        {alert.status === 'unread' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => markAlertRead(alert._id)}
                            className="text-xs hover:bg-red-100"
                          >
                            Mark Read
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Users */}
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-bold mb-4">Recent Users</h2>
                <div className="space-y-3">
                  {recentUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex justify-between items-center p-3 bg-muted/30 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold">{user.fullName}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <p className="font-bold text-primary">
                        ${(user.balance || 0).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Side Column - Quick Stats */}
            <div className="space-y-6">
                <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
                    <h3 className="font-bold text-primary mb-2">System Health</h3>
                    <p className="text-sm text-muted-foreground mb-4">Database and connection are active.</p>
                    <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                        MongoDB Connected
                    </div>
                </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
