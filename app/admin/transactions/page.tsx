'use client';

import { AdminSidebar } from '@/components/AdminSidebar';
import { TopNav } from '@/components/TopNav';
import { useEffect, useState } from 'react';
import { Transaction, User } from '@/lib/db';

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<
    (Transaction & { userName?: string })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all');

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const [transRes, usersRes] = await Promise.all([
          fetch('/api/transactions'),
          fetch('/api/users')
        ]);
        
        const allTransactions: Transaction[] = await transRes.json();
        const allUsers: User[] = await usersRes.json();

        const filtered =
          filter === 'all'
            ? allTransactions
            : allTransactions.filter((t) => t.type === filter);

        const enriched = filtered.map((trans) => {
          const user = allUsers.find((u) => u._id === trans.userId);
          return {
            ...trans,
            userName: user?.fullName,
          };
        });

        setTransactions(enriched);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [filter]);

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-primary">All Transactions</h1>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 border-b border-border">
            {(['all', 'credit', 'debit'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 font-medium transition-colors capitalize ${
                  filter === tab
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Transactions Table */}
          <div className="bg-card rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">Loading transactions...</div>
            ) : transactions.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No {filter !== 'all' ? filter : ''} transactions found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr className="border-b">
                      <th className="text-left py-4 px-6 font-semibold">
                        User
                      </th>
                      <th className="text-left py-4 px-6 font-semibold">
                        Description
                      </th>
                      <th className="text-left py-4 px-6 font-semibold">
                        Type
                      </th>
                      <th className="text-left py-4 px-6 font-semibold">
                        Amount
                      </th>
                      <th className="text-left py-4 px-6 font-semibold">
                        Status
                      </th>
                      <th className="text-left py-4 px-6 font-semibold">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr
                        key={transaction._id}
                        className="border-b hover:bg-muted/20 transition-colors"
                      >
                        <td className="py-4 px-6 font-semibold">
                          {transaction.userName}
                        </td>
                        <td className="py-4 px-6">
                          {transaction.description}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              transaction.type === 'credit'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {transaction.type === 'credit'
                              ? 'Credit'
                              : 'Debit'}
                          </span>
                        </td>
                        <td
                          className={`py-4 px-6 font-bold ${
                            transaction.type === 'credit'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {transaction.type === 'credit' ? '+' : '-'} $
                          {(transaction.amount ?? 0).toLocaleString()}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              transaction.status === 'completed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {transaction.status === 'completed'
                              ? 'Completed'
                              : 'Pending'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
