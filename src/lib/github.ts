import { REPOSITORIES, Repository } from '@/config/repos';
import { Job, GitHubIssue } from '@/types/job';

const GITHUB_ENDPOINT = 'https://api.github.com/graphql';
const token = process.env.GITHUB_TOKEN;

const query = `
  query GetIssues($owner: String!, $name: String!, $labels: [String!]) {
    repository(owner: $owner, name: $name) {
      issues(first: 20, states: OPEN, labels: $labels, orderBy: {field: CREATED_AT, direction: DESC}) {
        nodes {
          id
          title
          url
          createdAt
          repository {
            owner {
              login
            }
            name
          }
          labels(first: 10) {
            nodes {
              name
              color
            }
          }
        }
      }
    }
  }
`;

interface GitHubResponse {
  data?: {
    repository?: {
      issues: {
        nodes: GitHubIssue[];
      };
    };
  };
  errors?: unknown[];
}

/**
 * Helper to make a GraphQL request using fetch
 */
async function requestGraphQL(variables: Record<string, unknown>) {
  if (!token) {
    console.warn('GITHUB_TOKEN is not defined.');
    return null;
  }

  const response = await fetch(GITHUB_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
    next: { 
      tags: ['jobs']
    },
  });

  const json = (await response.json()) as GitHubResponse;
  
  if (json.errors) {
    console.error('GraphQL Errors:', json.errors);
    return null;
  }

  return json.data;
}

/**
 * Fetches jobs from a single repository
 */
async function fetchJobsFromRepo(repo: Repository): Promise<Job[]> {
  try {
    const data = await requestGraphQL({
      owner: repo.owner,
      name: repo.name,
      labels: repo.label ? [repo.label] : undefined,
    });

    const issues = data?.repository?.issues?.nodes || [];

    return issues.map((issue: GitHubIssue) => ({
      id: issue.id,
      title: issue.title,
      company: issue.repository.owner.login,
      repository: `${issue.repository.owner.login}/${issue.repository.name}`,
      url: issue.url,
      labels: issue.labels.nodes.map((l) => ({ name: l.name, color: l.color })),
      createdAt: issue.createdAt,
    }));
  } catch (error) {
    console.error(`Failed to fetch jobs from ${repo.owner}/${repo.name}:`, error);
    return [];
  }
}

export async function fetchJobs(): Promise<Job[]> {
  // Parallelize the requests for all repositories
  const repoPromises = REPOSITORIES.map(repo => fetchJobsFromRepo(repo));
  const results = await Promise.all(repoPromises);
  
  const allJobs = results.flat();

  // Sort all jobs by date descending
  return allJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
