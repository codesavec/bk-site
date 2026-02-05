'use client';

import { AdminSidebar } from '@/components/AdminSidebar';
import { TopNav } from '@/components/TopNav';
import { useEffect, useState } from 'react';
import { User } from '@/lib/db';
import { Button } from '@/components/ui/button';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardMessage, setCardFormMessage] = useState('');

  const toggleStatus = async (user: User) => {
    try {
      const response = await fetch(`/api/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isActive: !user.isActive,
        }),
      });

      if (response.ok) {
        setUsers(users.map(u => u._id === user._id ? { ...u, isActive: !user.isActive } : u));
        if (selectedUser?._id === user._id) {
            setSelectedUser({ ...selectedUser, isActive: !user.isActive });
        }
      }
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  const generateCard = async (userId: string, fullName: string) => {
    try {
      const cardNumber = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          cardNumber,
          cardType: 'debit',
          expiryDate: '12/28',
          holderName: fullName,
        }),
      });

      if (response.ok) {
        setCardFormMessage('Debit card assigned successfully!');
        setTimeout(() => {
            setCardFormMessage('');
            setShowCardForm(false);
        }, 2000);
      } else {
        setCardFormMessage('Failed to assign card.');
      }
    } catch (error) {
      setCardFormMessage('Error assigning card.');
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const allUsers = await response.json();
        setUsers(allUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <h1 className="text-3xl font-bold text-primary mb-8">Users Management</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Users List */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg shadow-sm overflow-hidden">
                {loading ? (
                  <div className="p-8 text-center">Loading users...</div>
                ) : users.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No users found
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/30">
                        <tr className="border-b">
                          <th className="text-left py-4 px-6 font-semibold">
                            Name
                          </th>
                          <th className="text-left py-4 px-6 font-semibold">
                            Email
                          </th>
                          <th className="text-left py-4 px-6 font-semibold">
                            Account No
                          </th>
                          <th className="text-left py-4 px-6 font-semibold">
                            Balance
                          </th>
                          <th className="text-left py-4 px-6 font-semibold">
                            Status
                          </th>
                          <th className="text-left py-4 px-6 font-semibold">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr
                            key={user._id}
                            className="border-b hover:bg-muted/20 transition-colors cursor-pointer"
                            onClick={() => setSelectedUser(user)}
                          >
                            <td className="py-4 px-6 font-semibold">
                              {user.fullName}
                            </td>
                            <td className="py-4 px-6">{user.email}</td>
                            <td className="py-4 px-6">{user.accountNumber}</td>
                            <td className="py-4 px-6 font-bold text-primary">
                              ${(user.balance ?? 0).toLocaleString()}
                            </td>
                            <td className="py-4 px-6">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {user.isActive ? 'Active' : 'Disabled'}
                                </span>
                            </td>
                            <td className="py-4 px-6">
                              <button className="text-primary font-medium hover:underline">
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* User Details */}
            {selectedUser && (
              <div className="bg-card rounded-lg p-6 shadow-sm h-fit">
                <h2 className="text-lg font-bold mb-6">User Details</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Full Name
                    </p>
                    <p className="font-semibold">{selectedUser.fullName}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="font-semibold">{selectedUser.email}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Account Number
                    </p>
                    <p className="font-semibold">{selectedUser.accountNumber}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Current Balance
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      ${(selectedUser.balance ?? 0).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Account Status
                    </p>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${selectedUser.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {selectedUser.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Member Since
                    </p>
                    <p className="font-semibold">
                      {new Date(selectedUser.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="pt-4 space-y-3">
                    <Button
                        onClick={() => toggleStatus(selectedUser)}
                        variant={selectedUser.isActive ? "destructive" : "default"}
                        className="w-full"
                    >
                        {selectedUser.isActive ? 'Deactivate User' : 'Activate User'}
                    </Button>

                    <Button
                        onClick={() => generateCard(selectedUser._id!, selectedUser.fullName)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Assign Debit Card
                    </Button>
                    
                    {cardMessage && (
                        <p className={`text-xs text-center font-medium ${cardMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                            {cardMessage}
                        </p>
                    )}

                    <button
                        onClick={() => setSelectedUser(null)}
                        className="w-full px-4 py-2 border border-border rounded-lg hover:bg-muted/10 transition-colors"
                    >
                        Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
