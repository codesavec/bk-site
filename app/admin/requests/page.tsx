'use client';

import { AdminSidebar } from '@/components/AdminSidebar';
import { TopNav } from '@/components/TopNav';
import { useEffect, useState } from 'react';
import { Request, User } from '@/lib/db';
import { Button } from '@/components/ui/button';

export default function AdminRequests() {
  const [requests, setRequests] = useState<
    (Request & { userName?: string; userEmail?: string })[]
  >([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>(
    'pending'
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const [requestsRes, usersRes] = await Promise.all([
          fetch('/api/requests' + (filter !== 'all' ? `?status=${filter}` : '')),
          fetch('/api/users')
        ]);
        
        const allRequests: Request[] = await requestsRes.json();
        const allUsers: User[] = await usersRes.json();

        const enriched = allRequests.map((req) => {
          const user = allUsers.find((u) => u._id === req.userId);
          return {
            ...req,
            userName: user?.fullName,
            userEmail: user?.email,
          };
        });

        setRequests(enriched);
      } catch (error) {
        console.error('Failed to fetch requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [filter]);

  const handleApprove = async (request: any, approved: boolean) => {
    setLoading(true);
    try {
      // If it's a card request and approved, generate the card first
      if (request.type === 'card' && approved) {
        const cardNumber = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
        await fetch('/api/cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: request.userId,
            cardNumber,
            cardType: 'debit',
            expiryDate: '12/28',
            holderName: request.userName,
          }),
        });
      }

      const response = await fetch(`/api/requests/${request._id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved }),
      });

      if (response.ok) {
        // Update local state
        setRequests((prev) =>
          prev.map((req) =>
            req._id === request._id
              ? { ...req, status: approved ? 'approved' : 'rejected' }
              : req
          )
        );
      }
    } catch (error) {
      console.error('Failed to process request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Withdrawal & Deposit Requests</h1>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 border-b border-border">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
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

          {/* Requests Table */}
          <div className="bg-card rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">Loading requests...</div>
            ) : requests.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No {filter !== 'all' ? filter : ''} requests found
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
                        Email
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
                      <th className="text-left py-4 px-6 font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request) => (
                      <tr
                        key={request._id}
                        className="border-b hover:bg-muted/20 transition-colors"
                      >
                        <td className="py-4 px-6 font-semibold">
                          {request.userName}
                        </td>
                        <td className="py-4 px-6">{request.userEmail}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              request.type === 'deposit'
                                ? 'bg-green-100 text-green-800'
                                : request.type === 'card'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {request.type === 'deposit' ? 'Deposit' : request.type === 'card' ? 'Card' : 'Withdrawal'}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold">
                          ${(request.amount ?? 0).toLocaleString()}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              request.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : request.status === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {request.status === 'pending'
                              ? 'Pending'
                              : request.status === 'approved'
                                ? 'Approved'
                                : 'Rejected'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          {request.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleApprove(request, true)}
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 h-auto"
                              >
                                Approve
                              </Button>
                              <Button
                                onClick={() => handleApprove(request, false)}
                                disabled={loading}
                                className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-auto"
                              >
                                Reject
                              </Button>
                            </div>
                          )}
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
