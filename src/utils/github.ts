import { Octokit } from '@octokit/rest';

export async function validateGitHubToken(token: string): Promise<boolean> {
  try {
    const octokit = new Octokit({ auth: token });
    const { data } = await octokit.users.getAuthenticated();
    return true;
  } catch (error) {
    console.error('GitHub token validation error:', error);
    return false;
  }
}

export async function createRepository(token: string, repoName: string, description: string): Promise<string> {
  try {
    const octokit = new Octokit({ auth: token });
    
    // Check if repo already exists
    try {
      const { data: user } = await octokit.users.getAuthenticated();
      const { data: repo } = await octokit.repos.get({
        owner: user.login,
        repo: repoName
      });
      
      if (repo) {
        repoName = `${repoName}-${Date.now()}`;
      }
    } catch (error) {
      // Repo doesn't exist, we can proceed
    }

    const { data } = await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      description,
      private: false,
      auto_init: false
    });
    
    return data.html_url;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to create GitHub repository';
    throw new Error(message);
  }
}

// Browser-compatible base64 encoding
function encodeToBase64(str: string): string {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch (error) {
    console.error('Base64 encoding error:', error);
    throw new Error('Failed to encode content');
  }
}

export async function uploadToRepository(
  token: string, 
  owner: string, 
  repo: string, 
  path: string, 
  content: string
): Promise<void> {
  try {
    const octokit = new Octokit({ auth: token });
    
    // Basic validation
    if (!path || !content) {
      throw new Error(`Invalid file data for ${path}`);
    }

    // Remove any leading slashes
    const cleanPath = path.replace(/^\/+/, '');

    // Convert content to base64
    const base64Content = encodeToBase64(content);
    if (!base64Content) {
      throw new Error(`Failed to encode content for ${path}`);
    }

    // Try to get existing file's SHA
    let sha: string | undefined;
    try {
      const { data: existingFile } = await octokit.repos.getContent({
        owner,
        repo,
        path: cleanPath
      });

      if (!Array.isArray(existingFile)) {
        sha = existingFile.sha;
      }
    } catch (error) {
      // File doesn't exist yet, which is fine
    }

    // Create or update file with SHA if it exists
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: cleanPath,
      message: `Add ${cleanPath}`,
      content: base64Content,
      ...(sha ? { sha } : {}),
      committer: {
        name: 'Sprint Platform',
        email: 'noreply@sprint.dev'
      }
    });
  } catch (error: any) {
    console.error(`Upload error for ${path}:`, error);
    const message = error.response?.data?.message || error.message || `Failed to upload ${path}`;
    throw new Error(message);
  }
}