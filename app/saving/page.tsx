'use client';

import React from "react"

import { Sidebar } from '@/components/Sidebar';
import { TopNav } from '@/components/TopNav';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

export default function Saving() {
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    savingName: '',
    targetAmount: '',
    monthlyAmount: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [savings, setSavings] = useState<any[]>([]);

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchSavings = async () => {
      try {
        const response = await fetch(`/api/savings?userId=${user._id}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setSavings(data);
        }
      } catch (error) {
        console.error('Failed to fetch savings:', error);
      }
    };

    fetchSavings();
  }, [user, authLoading]);

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
      const response = await fetch('/api/savings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          name: formData.savingName,
          targetAmount: parseFloat(formData.targetAmount),
          monthlyAmount: parseFloat(formData.monthlyAmount),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSavings([data.saving, ...savings]);
        setMessage('Savings goal created successfully!');
        setFormData({
          savingName: '',
          targetAmount: '',
          monthlyAmount: '',
          description: '',
        });
      } else {
        setMessage('Failed to create savings goal.');
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
          <h1 className="text-3xl font-bold text-primary mb-8">Savings Goals</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Saving Form */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-6">Create Savings Goal</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Goal Name
                    </label>
                    <input
                      type="text"
                      name="savingName"
                      value={formData.savingName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="e.g., House Fund"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Target Amount ($)
                    </label>
                    <input
                      type="number"
                      name="targetAmount"
                      value={formData.targetAmount}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="50000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Monthly Amount ($)
                    </label>
                    <input
                      type="number"
                      name="monthlyAmount"
                      value={formData.monthlyAmount}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="1000"
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
                    {loading ? 'Creating...' : 'Create Goal'}
                  </Button>
                </form>
              </div>
            </div>

            {/* Savings Goals List */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {savings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground bg-card rounded-lg shadow-sm">
                    No savings goals yet. Start by creating one!
                  </div>
                ) : (
                  savings.map((saving) => {
                    const progress = saving.targetAmount > 0 
                      ? (saving.currentAmount / saving.targetAmount) * 100
                      : 0;
                    return (
                      <div
                        key={saving._id}
                        className="bg-card rounded-lg p-6 shadow-sm border border-transparent hover:border-primary/20 transition-all"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold">{saving.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Monthly contribution: ${saving.monthlyAmount}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-primary">
                              ${(saving.currentAmount || 0).toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              of ${(saving.targetAmount || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {progress.toFixed(1)}% complete
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}