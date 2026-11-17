import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '../env';

export const client = createClient({
  projectId: projectId || 'x0tpoga9',
  dataset: dataset || 'production',
  apiVersion: apiVersion || '2024-07-11',
  useCdn: true,
});