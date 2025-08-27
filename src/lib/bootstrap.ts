import Papa from 'papaparse';
import { mapCsvRow } from './seedFromCsv';
import { useDB } from '@/store/db';

export async function bootstrapOnce() {
  const s = useDB.getState();
  if (s.hangers.length > 0) return;

  try {
    const csv = await fetch('/data/hangers_msuite_sample.csv').then(r => r.text());
    const { data } = Papa.parse(csv, { header: true, skipEmptyLines: true });
    const rows = (data as any[]).map(mapCsvRow);
    
    s.seedFromCsv(rows);
    s.groupPackages();
    
    // Create some initial work orders for demo
    const packages = s.packages.slice(0, 5);
    packages.forEach((pkg, i) => {
      s.createWorkOrder(pkg.id, {
        team: i % 2 === 0 ? 'Crew Alpha' : 'Crew Bravo',
        station: `Station ${i + 1}`,
        priority: i === 0 ? 'High' : i === 1 ? 'Med' : 'Low',
        due: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    });
    
    console.log('✅ Bootstrap completed - loaded', rows.length, 'hangers and', packages.length, 'packages');
  } catch (error) {
    console.error('❌ Bootstrap failed:', error);
  }
}