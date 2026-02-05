'use client';

import React from "react"

import { Sidebar } from '@/components/Sidebar';
import { TopNav } from '@/components/TopNav';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { User } from '@/lib/db';
import { useAuth } from '@/hooks/use-auth';

export default function Profile() {
  const { user: session, loading: authLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
  });

  useEffect(() => {
    if (authLoading || !session) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${session._id}`);
        const data = await response.json();
        setUser(data);
        setFormData({
          fullName: data.fullName,
          email: data.email,
        });
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [session, authLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    try {
      const response = await fetch(`/api/users/${session._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser.user);
        
        // Also update localStorage
        const newSession = { ...session, ...formData };
        localStorage.setItem('user', JSON.stringify(newSession));
        
        setEditing(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNav />
          <main className="flex-1 flex items-center justify-center">
            Loading...
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav userName={user?.fullName} userInitial={user?.fullName?.[0]} />

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <h1 className="text-3xl font-bold text-primary mb-8">My Profile</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg p-6 shadow-sm text-center">
                <div className="w-24 h-24 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                  {user?.fullName?.[0]}
                </div>
                <h2 className="text-xl font-bold mb-2">{user?.fullName}</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  {user?.email}
                </p>
                <Button
                  onClick={() => setEditing(!editing)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {editing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Account Information */}
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-6">Account Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">
                      Full Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-lg font-semibold">{user?.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">
                      Email
                    </label>
                    {editing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-lg font-semibold">{user?.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">
                      Account Number
                    </label>
                    <p className="text-lg font-semibold">{user?.accountNumber}</p>
                  </div>

                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">
                      Member Since
                    </label>
                    <p className="text-lg font-semibold">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>

                  {editing && (
                    <div className="mt-6">
                      <Button
                        onClick={handleSubmit}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-6">Security Settings</h3>
                <div className="space-y-4">
                  <Button className="w-full border border-primary text-primary hover:bg-primary/10">
                    Change Password
                  </Button>
                  <Button className="w-full border border-primary text-primary hover:bg-primary/10">
                    Enable Two-Factor Authentication
                  </Button>
                </div>
              </div>

              {/* Account Statistics */}
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-6">Account Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Current Balance
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      ${(user?.balance ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Account Status
                    </p>
                    <p className="text-lg font-bold text-green-600">Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
