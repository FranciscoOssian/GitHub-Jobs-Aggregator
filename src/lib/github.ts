import { GraphQLClient, gql } from 'graphql-request';
import { REPOSITORIES } from '@/config/repos';
import { Job, GitHubIssue } from '@/types/job';

const GITHUB_ENDPOINT = 'https://api.github.com/graphql';

// Ensure GITHUB_TOKEN is available
const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.warn('GITHUB_TOKEN is not defined in environment variables. Data fetching will fail.');
}

const client = new GraphQLClient(GITHUB_ENDPOINT, {
  headers: {
    authorization: `Bearer ${token}`,
  },
});

const query = gql`
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
  repository?: {
    issues: {
      nodes: GitHubIssue[];
    };
  };
}

export async function fetchJobs(): Promise<Job[]> {
  const allJobs: Job[] = [];

  for (const repo of REPOSITORIES) {
    try {
      const variables = {
        owner: repo.owner,
        name: repo.name,
        labels: repo.label ? [repo.label] : undefined,
      };

      const data = await client.request<GitHubResponse>(query, variables);
      const issues = data.repository?.issues?.nodes || [];

      const jobs = issues.map((issue: GitHubIssue) => ({
        id: issue.id,
        title: issue.title,
        company: issue.repository.owner.login,
        repository: `${issue.repository.owner.login}/${issue.repository.name}`,
        url: issue.url,
        labels: issue.labels.nodes.map((l) => ({ name: l.name, color: l.color })),
        createdAt: issue.createdAt,
      }));

      allJobs.push(...jobs);
    } catch (error: any) {
      console.error(`Failed to fetch jobs from ${repo.owner}/${repo.name}:`, JSON.stringify(error, null, 2));
      // Continue to next repo even if one fails
    }
  }

  // Sort all jobs by date descending
  return allJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
