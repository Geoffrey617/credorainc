'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  useEffect(() => {
    // Check if user is signed in
    const userData = localStorage.getItem('credora_user') || localStorage.getItem('credora_verified_user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        firstName: parsedUser.firstName || '',
        lastName: parsedUser.lastName || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || '',
        address: parsedUser.address || '',
        city: parsedUser.city || '',
        state: parsedUser.state || '',
        zipCode: parsedUser.zipCode || ''
      });
    } else {
      router.push('/auth/signin');
    }
    setIsLoading(false);
  }, [router]);

  const handleSave = () => {
    if (user) {
      const updatedUser = {
        ...user,
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim()
      };
      
      // Update localStorage
      const storageKey = localStorage.getItem('credora_user') ? 'credora_user' : 'credora_verified_user';
      localStorage.setItem(storageKey, JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: (user as any).phone || '',
        address: (user as any).address || '',
        city: (user as any).city || '',
        state: (user as any).state || '',
        zipCode: (user as any).zipCode || ''
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to sign in
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Content with top padding for fixed navigation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Profile Settings</h1>
          <p className="text-slate-600">Manage your account information and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-800">Personal Information</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors font-medium"
              >
                Edit Profile
              </button>
            ) : (
              <div className="space-x-3">
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              ) : (
                <div className="px-4 py-3 bg-slate-50 rounded-lg text-slate-700">
                  {formData.firstName || 'Not provided'}
                </div>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              ) : (
                <div className="px-4 py-3 bg-slate-50 rounded-lg text-slate-700">
                  {formData.lastName || 'Not provided'}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <div className="px-4 py-3 bg-slate-100 rounded-lg text-slate-500">
                {formData.email}
                <span className="block text-xs text-slate-400 mt-1">Email cannot be changed</span>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              ) : (
                <div className="px-4 py-3 bg-slate-50 rounded-lg text-slate-700">
                  {formData.phone || 'Not provided'}
                </div>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Street Address</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  placeholder="123 Main St"
                />
              ) : (
                <div className="px-4 py-3 bg-slate-50 rounded-lg text-slate-700">
                  {formData.address || 'Not provided'}
                </div>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              ) : (
                <div className="px-4 py-3 bg-slate-50 rounded-lg text-slate-700">
                  {formData.city || 'Not provided'}
                </div>
              )}
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  placeholder="CA"
                />
              ) : (
                <div className="px-4 py-3 bg-slate-50 rounded-lg text-slate-700">
                  {formData.state || 'Not provided'}
                </div>
              )}
            </div>

            {/* ZIP Code */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">ZIP Code</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  placeholder="12345"
                />
              ) : (
                <div className="px-4 py-3 bg-slate-50 rounded-lg text-slate-700">
                  {formData.zipCode || 'Not provided'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Account Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
              <div>
                <h3 className="font-medium text-slate-800">Email Notifications</h3>
                <p className="text-sm text-slate-600">Receive updates about your applications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
              <div>
                <h3 className="font-medium text-slate-800">SMS Notifications</h3>
                <p className="text-sm text-slate-600">Receive text updates on your phone</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
