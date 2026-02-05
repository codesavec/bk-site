'use client';

import { BalanceCard } from '@/components/BalanceCard';
import { Sidebar } from '@/components/Sidebar';
import { TopNav } from '@/components/TopNav';
import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { User } from '@/lib/db';
import { useAuth } from '@/hooks/use-auth';

const transactionChartData = [
  { name: 'Mon', credited: 2, debited: 1 },
  { name: 'Tue', credited: 3, debited: 2 },
  { name: 'Wed', credited: 1, debited: 2 },
  { name: 'Thu', credited: 4, debited: 1 },
  { name: 'Fri', credited: 2, debited: 3 },
  { name: 'Sat', credited: 3, debited: 2 },
  { name: 'Sun', credited: 1, debited: 1 },
];

const cashFlowData = [
  { name: 'Credit', value: 16 },
  { name: 'Debit', value: 12 },
];

export default function Dashboard() {
  const { user: session, loading: authLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (authLoading || !session) return;

    const fetchDashboardData = async () => {
      try {
        const [userRes, transRes] = await Promise.all([
          fetch(`/api/users/${session._id}`),
          fetch(`/api/transactions?userId=${session._id}`)
        ]);
        
        const userData = await userRes.json();
        const transData = await transRes.json();
        
        console.log('Dashboard User Data:', userData);

        if (userData && !userData.error) {
          setUser(userData);
        } else {
          console.error('User data error:', userData?.error);
        }

        if (Array.isArray(transData)) {
          setTransactions(transData.slice(0, 5));
        } else {
          console.error('Transactions data error:', transData?.error);
          setTransactions([]);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [session, authLoading]);

  if (authLoading || loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav userName={user?.fullName} userInitial={user?.fullName?.[0]} />
        
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <h1 className="text-3xl font-bold text-primary mb-8">Dashboard</h1>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <BalanceCard
              title="Balance $"
              amount={Number(user?.balance || 0)}
              subtitle="Your Total Balance"
            />
            <BalanceCard
              title="Saving $"
              amount={0}
              subtitle="Save Money Monthly"
            />
            <BalanceCard
              title="Credited this Month $"
              amount={transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0)}
              subtitle="This Month"
              color="success"
            />
            <BalanceCard
              title="Debited this Month $"
              amount={transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0)}
              subtitle="This Month"
              color="error"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transaction Graph */}
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-2">Transaction Graph</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Overview of Daily transaction
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={transactionChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="credited" fill="#22c55e" name="# Credited" />
                  <Bar dataKey="debited" fill="#ef4444" name="# Debited" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Cash Flow Graph */}
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-2">Cash Flow Graph</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Overview of Total Cash flow
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" name="Cash Flow Chart" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transaction History Preview */}
          <div className="mt-8 bg-card rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Transaction History</h2>
              <a href="/transaction-history" className="text-primary font-medium hover:underline">
                View More
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Sr.No</th>
                    <th className="text-left py-2 px-2">Name</th>
                    <th className="text-left py-2 px-2">Account No</th>
                    <th className="text-left py-2 px-2">Date</th>
                    <th className="text-left py-2 px-2">Amount</th>
                    <th className="text-left py-2 px-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-muted-foreground">No transactions found</td>
                    </tr>
                  ) : (
                    transactions.map((t, i) => (
                      <tr key={t._id} className="border-b hover:bg-muted/10 transition-colors">
                        <td className="py-3 px-2">{i + 1}</td>
                        <td className="py-3 px-2">{t.description}</td>
                        <td className="py-3 px-2">{user?.accountNumber}</td>
                        <td className="py-3 px-2">{new Date(t.date).toLocaleDateString()}</td>
                        <td className={`py-3 px-2 font-semibold ${t.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                          {t.type === 'credit' ? '+' : '-'} ${(t.amount ?? 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded text-xs ${t.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}