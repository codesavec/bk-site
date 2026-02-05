'use client';

import React from "react"

import { Sidebar } from '@/components/Sidebar';
import { TopNav } from '@/components/TopNav';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Request } from '@/lib/db';
import { useAuth } from '@/hooks/use-auth';

export default function WithdrawDeposit() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdrawal'>('deposit');
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
  });
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchRequests = async () => {
      try {
        const response = await fetch(`/api/requests?userId=${user._id}`);
        const data = await response.json();
        setRequests(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch requests:', error);
      }
    };

    fetchRequests();
  }, [user, authLoading]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          type: activeTab,
          amount: parseFloat(formData.amount),
          description: formData.description,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRequests([data.request, ...requests]);
        setMessage(`${activeTab} request submitted successfully!`);
        setFormData({ amount: '', description: '' });
      } else {
        setMessage(data.error || 'Failed to submit request. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="p-8">Loading...</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <h1 className="text-3xl font-bold text-primary mb-8">
            Deposit & Withdrawal
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Request Form */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-border">
                  <button
                    onClick={() => setActiveTab('deposit')}
                    className={`px-4 py-2 font-medium transition-colors ${
                      activeTab === 'deposit'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    Deposit
                  </button>
                  <button
                    onClick={() => setActiveTab('withdrawal')}
                    className={`px-4 py-2 font-medium transition-colors ${
                      activeTab === 'withdrawal'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    Withdrawal
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                      placeholder="0.00"
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
                      placeholder="Add any notes about this request"
                      rows={3}
                    />
                  </div>

                  {message && (
                    <div
                      className={`p-3 rounded-lg text-sm ${
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
                    {loading ? 'Processing...' : `Submit ${activeTab}`}
                  </Button>
                </form>
              </div>
            </div>

            {/* Requests History */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-bold mb-6">Your Requests</h2>

                {requests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No requests yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests.map((request) => (
                      <div
                        key={request._id}
                        className="border border-border rounded-lg p-4 hover:bg-muted/10 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold capitalize">
                              {request.type} Request
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              request.status
                            )}`}
                          >
                            {request.status === 'pending'
                              ? 'Pending'
                              : request.status === 'approved'
                                ? 'Approved'
                                : 'Rejected'}
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-primary mb-2">
                          ${request.amount.toLocaleString()}
                        </p>
                        {request.description && (
                          <p className="text-sm text-muted-foreground">
                            {request.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
