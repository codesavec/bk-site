'use client';

import React from "react"

import { Sidebar } from '@/components/Sidebar';
import { TopNav } from '@/components/TopNav';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/lib/db';
import { useAuth } from '@/hooks/use-auth';

export default function Cards() {
  const { user, loading: authLoading } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchCards = async () => {
      try {
        const response = await fetch(`/api/cards?userId=${user._id}`);
        const data = await response.json();
        setCards(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch cards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [user, authLoading]);

  const handleRequestCard = async () => {
    if (!user) return;
    setRequestLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          type: 'card',
          amount: 0,
          description: 'Request for a new debit card',
        }),
      });

      if (response.ok) {
        setMessage('Your request for a new card has been submitted to the admin.');
      } else {
        setMessage('Failed to submit request.');
      }
    } catch (error) {
      setMessage('Error submitting request.');
    } finally {
      setRequestLoading(false);
    }
  };

  if (authLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-primary">My Cards</h1>
            <Button
              onClick={handleRequestCard}
              disabled={requestLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {requestLoading ? 'Submitting...' : 'Request New Card'}
            </Button>
          </div>

          {message && (
            <div className={`p-4 rounded-lg mb-8 ${message.includes('submitted') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">Loading cards...</div>
          ) : cards.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No active cards found. Request a new card to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card) => (
                <div
                  key={card._id}
                  className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-lg p-6 shadow-lg relative h-64"
                >
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <p className="text-sm opacity-75 mb-2">
                        {card.cardType === 'credit' ? 'CREDIT CARD' : 'DEBIT CARD'}
                      </p>
                      <p className="text-2xl font-bold tracking-widest">
                        {card.cardNumber.slice(-4).padStart(16, '*')}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs opacity-75 mb-1">CARD HOLDER</p>
                      <p className="font-semibold">{card.holderName}</p>
                    </div>

                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs opacity-75">EXPIRES</p>
                        <p className="font-semibold">{card.expiryDate}</p>
                      </div>
                      <div className="w-12 h-8 bg-primary-foreground/20 rounded-sm" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}