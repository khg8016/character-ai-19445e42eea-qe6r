import React, { useState, useEffect } from 'react';
import { Rocket, Loader, ExternalLink } from 'lucide-react';
import { Octokit } from '@octokit/rest';
import { useProfile } from '../../contexts/ProfileContext';
import { downloadAndUnzipFile } from '../../utils/zip';
import { createRepository, uploadToRepository } from '../../utils/github';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface GitHubDeployButtonProps {
  prototypeId: string;
  prototypeTitle: string;
  sourceCodeUrl: string;
  onDeploySuccess?: (url: string) => void;
}

type DeployStep = 
  | 'downloading' 
  | 'creating-repo' 
  | 'uploading' 
  | 'finalizing' 
  | null;

export function GitHubDeployButton({ 
  prototypeId,
  prototypeTitle, 
  sourceCodeUrl,
  onDeploySuccess 
}: GitHubDeployButtonProps) {
  const [deploying, setDeploying] = useState(false);
  const [currentStep, setCurrentStep] = useState<DeployStep>(null);
  const [progress, setProgress] = useState(0);
  const [githubUrl, setGithubUrl] = useState<string | null>(null);
  const { profile } = useProfile();

  useEffect(() => {
    if (!profile) return;

    async function fetchDeployment() {
      const { data, error } = await supabase
        .from('user_github_deployments')
        .select('github_url')
        .eq('prototype_id', prototypeId)
        .eq('user_id', profile.id)
        .maybeSingle();

      if (!error && data) {
        setGithubUrl(data.github_url);
      }
    }

    fetchDeployment();
  }, [profile, prototypeId]);

  const handleDeploy = async () => {
    if (!profile?.github_token) {
      toast.error('Please add your GitHub token in profile settings first');
      return;
    }

    setDeploying(true);
    setProgress(0);
    
    try {
      // Download and unzip source code
      setCurrentStep('downloading');
      setProgress(10);
      const files = await downloadAndUnzipFile(sourceCodeUrl);
      if (!files.length) {
        throw new Error('No files found in source code');
      }
      setProgress(30);

      // Create GitHub repository
      setCurrentStep('creating-repo');
      const repoName = prototypeTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const repoUrl = await createRepository(
        profile.github_token,
        repoName,
        `Deployed from Sprint Platform: ${prototypeTitle}`
      );
      setProgress(50);

      // Get repository owner and name
      const repoPath = new URL(repoUrl).pathname.slice(1);
      const [owner, repo] = repoPath.split('/');

      // Upload files to repository
      setCurrentStep('uploading');
      const totalFiles = files.length;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        await new Promise((resolve, reject) => {
          reader.onload = async () => {
            try {
              await uploadToRepository(
                profile.github_token!,
                owner,
                repo,
                file.name,
                reader.result as string
              );
              // Update progress from 50% to 90%
              setProgress(50 + Math.floor((i + 1) / totalFiles * 40));
              resolve(null);
            } catch (error) {
              reject(error);
            }
          };
          reader.onerror = () => reject(reader.error);
          reader.readAsText(file);
        });
      }

      // Save deployment URL
      setCurrentStep('finalizing');
      setProgress(95);
      const { error: saveError } = await supabase
        .from('user_github_deployments')
        .upsert({
          user_id: profile.id,
          prototype_id: prototypeId,
          github_url: repoUrl
        });

      if (saveError) throw saveError;

      setProgress(100);
      setGithubUrl(repoUrl);
      onDeploySuccess?.(repoUrl);
      toast.success('Successfully deployed to GitHub!');
    } catch (error: any) {
      console.error('Deploy error:', error);
      toast.error(error.message || 'Failed to deploy to GitHub');
    } finally {
      setDeploying(false);
      setCurrentStep(null);
      setProgress(0);
    }
  };

  const getStepText = (step: DeployStep) => {
    switch (step) {
      case 'downloading':
        return 'Downloading source code...';
      case 'creating-repo':
        return 'Creating repository...';
      case 'uploading':
        return 'Uploading files...';
      case 'finalizing':
        return 'Finalizing deployment...';
      default:
        return 'Deploying...';
    }
  };

  if (githubUrl) {
    return (
      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg 
                 hover:bg-emerald-700 transition-colors"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        View on GitHub
      </a>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleDeploy}
        disabled={deploying}
        className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg 
                 hover:bg-emerald-700 transition-colors disabled:opacity-50"
      >
        {deploying ? (
          <>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            {getStepText(currentStep)}
          </>
        ) : (
          <>
            <Rocket className="w-4 h-4 mr-2" />
            Deploy to GitHub
          </>
        )}
      </button>
      
      {deploying && (
        <div className="w-full">
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {progress}% complete
          </p>
        </div>
      )}
    </div>
  );
}