import React, { useState, useEffect } from 'react';
import { ExternalLink, Rocket, Github, Download } from 'lucide-react';
import { useProfile } from '../../contexts/ProfileContext';
import { GitHubDeployButton } from '../prototypes/GitHubDeployButton';
import { supabase } from '../../lib/supabase';
import type { Prototype } from '../../types/prototype';
import toast from 'react-hot-toast';

interface PurchasedPrototypeContentProps {
  prototype: Prototype;
  onGitHubDeploy?: (url: string) => void;
}

export function PurchasedPrototypeContent({ prototype, onGitHubDeploy }: PurchasedPrototypeContentProps) {
  const { profile } = useProfile();
  const [githubUrl, setGithubUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;

    async function fetchGitHubUrl() {
      const { data } = await supabase
        .from('user_github_deployments')
        .select('github_url')
        .eq('prototype_id', prototype.id)
        .eq('user_id', profile.id)
        .maybeSingle();

      if (data) {
        setGithubUrl(data.github_url);
      }
    }

    fetchGitHubUrl();
  }, [profile, prototype.id]);

  const handleLaunchInBolt = () => {
    if (!githubUrl) return;

    const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return;

    const [, owner, repo] = match;
    const boltUrl = `https://bolt.new/~/github.com/${owner}/${repo}`;
    window.open(boltUrl, '_blank');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-8">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
        Development Environment
      </h2>
      
      <div className="space-y-6">
        {/* Source Code Download */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              Source Code
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Download the complete source code package
            </p>
          </div>
          <a
            href={prototype.source_code_url}
            download
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg 
                     hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download ZIP
          </a>
        </div>

        {/* GitHub Deploy */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              1. Deploy to GitHub
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {!profile?.github_token 
                ? "Add GitHub token in profile settings to enable deployment"
                : githubUrl 
                  ? "Source code is deployed to GitHub"
                  : "Deploy source code to your GitHub account"
              }
            </p>
          </div>
          <div className="flex gap-2">
            {!profile?.github_token ? (
              <a
                href="/profile/settings"
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg 
                         hover:bg-gray-700 transition-colors"
              >
                <Github className="w-4 h-4 mr-2" />
                Add GitHub Token
              </a>
            ) : (
              <GitHubDeployButton 
                prototypeId={prototype.id}
                prototypeTitle={prototype.title}
                sourceCodeUrl={prototype.source_code_url}
                onDeploySuccess={(url) => {
                  setGithubUrl(url);
                  onGitHubDeploy?.(url);
                }}
              />
            )}
          </div>
        </div>

        {/* Launch in Bolt */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              2. Launch in Bolt.new
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {githubUrl 
                ? "Open and edit the code directly in Bolt.new"
                : "Deploy to GitHub first to enable Bolt.new"
              }
            </p>
          </div>
          <button
            onClick={handleLaunchInBolt}
            disabled={!githubUrl}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg 
                     hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Rocket className="w-4 h-4 mr-2" />
            Launch in Bolt.new
          </button>
        </div>

        {/* Preview */}
        {prototype.preview_url && (
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Live Demo
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View the live demo version
              </p>
            </div>
            <a
              href={prototype.preview_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg 
                       hover:bg-emerald-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Demo
            </a>
          </div>
        )}
      </div>
    </div>
  );
}