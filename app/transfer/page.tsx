'use client';

import React from "react"

import { Sidebar } from '@/components/Sidebar';
import { TopNav } from '@/components/TopNav';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

export default function Transfer() {
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    recipientName: '',
    accountNumber: '',
    amount: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          type: 'debit',
          amount: parseFloat(formData.amount),
          description: `Transfer to ${formData.recipientName} (Acct: ${formData.accountNumber}): ${formData.description}`,
        }),
      });

      if (response.ok) {
        setMessage('Transfer completed successfully!');
        setFormData({
          recipientName: '',
          accountNumber: '',
          amount: '',
          description: '',
        });
      } else {
        setMessage('Transfer failed. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <h1 className="text-3xl font-bold text-primary mb-8">Money Transfer</h1>

          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-lg p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter recipient name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter account number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter transfer description"
                    rows={4}
                  />
                </div>

                {message && (
                  <div
                    className={`p-4 rounded-lg ${
                      message.includes('successfully')
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {message}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {loading ? 'Processing...' : 'Submit Transfer'}
                </Button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
