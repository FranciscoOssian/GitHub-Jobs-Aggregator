export interface Repository {
  owner: string;
  name: string;
  label?: string; // Optional label to filter by (e.g., 'hiring', 'job')
}

export const REPOSITORIES: Repository[] = [
  { owner: 'backend-br', name: 'vagas' }, 
  { owner: 'frontendbr', name: 'vagas' },
  { owner: 'react-brasil', name: 'vagas' },
  { owner: 'DevOps-Brasil', name: 'Vagas' },
  { owner: 'programadores-br', name: 'geral' },
  { owner: 'nodejsdevbr', name: 'vagas' },
  { owner: 'dotnetdevbr', name: 'vagas' },
  { owner: 'qa-brasil', name: 'vagas' },
  { owner: 'soujava', name: 'vagas-java' },
  { owner: 'datascience-br', name: 'vagas' },
  { owner: 'remotejobsbr', name: 'design-ux-vagas' },
  { owner: 'brasil-php', name: 'vagas' },
];
