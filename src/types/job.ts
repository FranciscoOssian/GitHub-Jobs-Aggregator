export interface GitHubIssue {
  id: string;
  title: string;
  url: string;
  createdAt: string;
  repository: {
    owner: {
      login: string;
    };
    name: string;
  };
  labels: {
    nodes: {
      name: string;
      color: string;
    }[];
  };
}

export interface Job {
  id: string;
  title: string;
  company: string; // usually repository owner
  repository: string; // owner/name
  url: string;
  labels: {
    name: string;
    color: string;
  }[];
  createdAt: string;
}
