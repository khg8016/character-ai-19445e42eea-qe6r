import React from 'react';
import { MyPrototypes } from '../components/expert/MyPrototypes';
import { SalesHistory } from '../components/expert/SalesHistory';
import { useProfile } from '../contexts/ProfileContext';
import { useNavigate } from 'react-router-dom';

export function ExpertDashboard() {
  const { profile } = useProfile();
  const navigate = useNavigate();

  // Expert가 아닌 경우 홈으로 리다이렉트
  React.useEffect(() => {
    if (profile && profile.user_level !== 'Expert') {
      navigate('/');
    }
  }, [profile, navigate]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-8" />
            <div className="space-y-8">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Expert Dashboard
        </h1>
        
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
            <MyPrototypes />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
            <SalesHistory />
          </div>
        </div>
      </div>
    </div>
  );
}