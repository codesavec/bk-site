'use client';

import { Sidebar } from '@/components/Sidebar';
import { TopNav } from '@/components/TopNav';
import { useEffect, useState } from 'react';
import { Transaction } from '@/lib/db';
import { useAuth } from '@/hooks/use-auth';

export default function TransactionHistory() {
  const { user, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchTransactions = async () => {
      try {
        const response = await fetch(`/api/transactions?userId=${user._id}`);
        const data = await response.json();
        setTransactions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user, authLoading]);

  if (authLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <h1 className="text-3xl font-bold text-primary mb-8">
            Transaction History
          </h1>

          <div className="bg-card rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">Loading transactions...</div>
            ) : transactions.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No transactions found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr className="border-b">
                      <th className="text-left py-4 px-6 font-semibold">
                        Sr.No
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
                        Date
                      </th>
                      <th className="text-left py-4 px-6 font-semibold">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction, index) => (
                      <tr key={transaction._id} className="border-b hover:bg-muted/20 transition-colors">
                        <td className="py-4 px-6">{index + 1}</td>
                        <td className="py-4 px-6">{transaction.description}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              transaction.type === 'credit'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                          </span>
                        </td>
                        <td
                          className={`py-4 px-6 font-semibold ${
                            transaction.type === 'credit'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {transaction.type === 'credit' ? '+' : '-'} $
                          {transaction.amount.toLocaleString()}
                        </td>
                        <td className="py-4 px-6">
                          {new Date(transaction.date).toLocaleDateString()}
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
