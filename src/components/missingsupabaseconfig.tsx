import { AuthLayout } from './AuthLayout';
import { Settings } from 'lucide-react';

export function MissingSupabaseConfig() {
  return (
    <AuthLayout
      title="Setup Required"
      subtitle="Please connect your Supabase project"
    >
      <div className="mt-8 text-center">
        <div className="mx-auto h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
          <Settings className="h-6 w-6 text-yellow-600" />
        </div>
        <p className="text-gray-600 mb-4">
          To use this application, you need to connect it to Supabase:
        </p>
        <ol className="text-left text-sm text-gray-600 space-y-2 mb-6">
          <li>1. Click the "Connect to Supabase" button in the top right</li>
          <li>2. Follow the setup instructions</li>
          <li>3. Refresh this page after setup is complete</li>
        </ol>
      </div>
    </AuthLayout>
  );
}