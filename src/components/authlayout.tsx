import React from 'react';
import { KeyRound } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#1a1b1e] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-[#25262b] p-8 rounded-xl shadow-lg border border-gray-800">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600/20 rounded-full flex items-center justify-center">
            <KeyRound className="h-6 w-6 text-blue-400" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">{title}</h2>
          <p className="mt-2 text-sm text-gray-400">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}