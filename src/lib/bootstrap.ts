import { useDB } from '@/store/db';
import { seed } from '@/data/seed';

export async function bootstrapOnce() {
  const s = useDB.getState();
  if (s.projects && s.projects.length) return;
  
  s.hydrate(seed.projects, seed.packages, seed.hangers);
  s.setActiveProject(seed.projects[0].id);
  
  console.log('✅ Bootstrap completed - loaded', seed.hangers.length, 'hangers and', seed.packages.length, 'packages for', seed.projects.length, 'project(s)');
}