import { useDB } from '@/store/db';
import { seed } from '@/data/seed';

export async function bootstrapOnce() {
  const s = useDB.getState();
  
  // Always reload if we have new projects in seed data
  const shouldReload = !s.projects.length || s.projects.length !== seed.projects.length;
  
  if (!shouldReload) return;
  
  // Clear existing data and reload
  console.log('🔄 Reloading seed data with expanded content...');
  
  // Expand seed data with missing hangers
  const expandedHangers = [...seed.hangers];
  
  // Generate placeholder hangers for any missing hanger IDs referenced in packages
  seed.packages.forEach(pkg => {
    pkg.hangerIds.forEach((hangerId, index) => {
      if (!expandedHangers.find(h => h.id === hangerId)) {
        const hangerType = index % 4 === 0 ? 'Trapeze' : 
                          index % 4 === 1 ? 'Clevis' : 
                          index % 4 === 2 ? 'Seismic' : 'Rack';
        const system = index % 3 === 0 ? 'HVAC' : index % 3 === 1 ? 'Plumbing' : 'Fire';
        const service = system === 'HVAC' ? 'Supply' : system === 'Plumbing' ? 'Domestic' : 'Sprinkler';
        
        expandedHangers.push({
          id: hangerId,
          projectId: pkg.projectId,
          name: `${hangerId}-${hangerType}-AUTO`,
          type: hangerType as any,
          system,
          service,
          level: pkg.level || "L1",
          grid: `AUTO-${index + 1}`,
          zone: pkg.zone || "AUTO",
          elevationFt: 12.0 + (index * 0.5),
          coordinates: {
            x: 100.0 + (index * 25),
            y: 100.0 + (index * 15),
            z: 144.0 + (index * 6)
          },
          upperAttachment: {
            type: "CastIn",
            model: "Bang-It+",
            variant: "3/8-1/2"
          },
          bim: {
            documentGuid: `doc-auto-${pkg.projectId}`,
            elementId: 9000 + index,
            modelVersion: "2025-08-24T12:00:00Z"
          },
          status: "Planned",
          rev: 1,
          estHours: 1.2 + (index * 0.1),
          actHours: 0,
          estMatCost: 45.50 + (index * 5.25),
          actMatCost: 0,
          items: [
            { sku: "P1000", desc: "Unistrut Channel P1000", uom: "ft", qty: 2.0 + (index * 0.2) },
            { sku: "ROD-3/8", desc: "Threaded Rod 3/8", uom: "ft", qty: 2.0 + (index * 0.1) },
            { sku: "NUT-STRUT", desc: "Strut Nut", uom: "ea", qty: 4 + index },
            { sku: "CLV-STD", desc: "Clevis Hanger", uom: "ea", qty: 1 },
            { sku: "WASH-FLAT", desc: "Flat Washer", uom: "ea", qty: 4 },
            { sku: "ANCH-SET", desc: "Anchor (per attachment)", uom: "ea", qty: 1 }
          ]
        });
      }
    });
  });
  
  s.hydrate(seed.projects, seed.packages, expandedHangers);
  s.setActiveProject(seed.projects[0].id);
  s.recomputeInventory();
  s.ensureTeamSeeds();
  
  console.log('✅ Bootstrap completed - loaded', expandedHangers.length, 'hangers and', seed.packages.length, 'packages for', seed.projects.length, 'project(s)');
}