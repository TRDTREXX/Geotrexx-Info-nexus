export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-07-11';

const cleanedProjectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '')
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9-]/g, '');

export const projectId = cleanedProjectId || 'x0tpoga9';

const cleanedDataset = (process.env.NEXT_PUBLIC_SANITY_DATASET || '')
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9_-]/g, '');

export const dataset = cleanedDataset || 'production';