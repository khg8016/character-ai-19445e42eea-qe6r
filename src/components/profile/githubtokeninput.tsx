import React, { useState } from 'react';
import { Check, Loader2, HelpCircle } from 'lucide-react';
import { validateGitHubToken } from '../../utils/github';
import toast from 'react-hot-toast';

interface GitHubTokenInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function GitHubTokenInput({ value, onChange }: GitHubTokenInputProps) {
  const [validating, setValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const handleValidate = async () => {
    if (!value) {
      toast.error('Please enter a GitHub token');
      return;
    }

    setValidating(true);
    try {
      const valid = await validateGitHubToken(value);
      setIsValid(valid);
      if (valid) {
        toast.success('GitHub token is valid');
      } else {
        toast.error('Invalid GitHub token');
      }
    } catch (error) {
      console.error('Token validation error:', error);
      toast.error('Failed to validate token');
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          GitHub Personal Access Token
        </label>
        <button
          type="button"
          onClick={() => setShowGuide(!showGuide)}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          <HelpCircle className="w-4 h-4 mr-1" />
          How to get a token?
        </button>
      </div>

      {showGuide && (
        <div className="rounded-lg bg-blue-50 dark:bg-blue-900/30 p-4 text-sm">
          <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
            How to create a GitHub Personal Access Token:
          </h4>
          <ol className="list-decimal ml-4 space-y-2 text-blue-700 dark:text-blue-300">
            <li>Go to <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="underline">GitHub Token Settings</a></li>
            <li>Click "Generate new token (classic)"</li>
            <li>Give your token a descriptive name (e.g., "Sprint Platform")</li>
            <li>Set expiration as needed</li>
            <li>Select the following scopes:
              <ul className="list-disc ml-4 mt-1">
                <li>repo (Full control of private repositories)</li>
                <li>workflow (Update GitHub Action workflows)</li>
              </ul>
            </li>
            <li>Click "Generate token"</li>
            <li>Copy the token immediately (you won't see it again!)</li>
          </ol>
          <p className="mt-3 text-blue-600 dark:text-blue-400">
            Note: Keep your token secure and never share it with others!
          </p>
        </div>
      )}

      <div className="mt-1 flex gap-2">
        <div className="flex-1">
          <input
            type="password"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setIsValid(null);
            }}
            placeholder="ghp_..."
            className={`w-full rounded-md border ${
              isValid === true 
                ? 'border-green-300 dark:border-green-600' 
                : isValid === false 
                  ? 'border-red-300 dark:border-red-600'
                  : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          />
        </div>
        <button
          type="button"
          onClick={handleValidate}
          disabled={validating || !value}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {validating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isValid ? (
            <Check className="w-5 h-5" />
          ) : (
            'Validate'
          )}
        </button>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Required to deploy prototypes to your GitHub account. Token must have 'repo' and 'workflow' scopes.
      </p>
    </div>
  );
}