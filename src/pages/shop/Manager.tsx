import { useMemo, useState } from 'react';
import { useDB } from '@/store/db';

export default function ShopManager() {
  const { 
    scopedPackages, packages, hangers, inventory, teams,
    checkInventoryForPackage, reserveInventoryForPackage,
    createAssignmentsFromPackage, assignToTeam 
  } = useDB();
  
  const scoped = scopedPackages();
  const [selectedPkgId, setPkg] = useState<string | null>(scoped[0]?.id || null);
  const pkg = useMemo(() => scoped.find(p => p.id === selectedPkgId), [scoped, selectedPkgId]);
  const lines = useMemo(() => pkg ? checkInventoryForPackage(pkg.id) : [], [pkg, checkInventoryForPackage]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Shop Manager Portal</h1>

      {/* Inbound packages */}
      <section className="border border-neutral-800 rounded-xl">
        <div className="p-3 border-b border-neutral-800 font-medium">Inbound Packages</div>
        <div className="p-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left opacity-70">
              <tr>
                <th className="py-2">Package</th>
                <th>Level/Zone</th>
                <th>State</th>
                <th>Hangers</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {scoped.map(p => {
                const count = p.hangerIds.length;
                return (
                  <tr key={p.id} className={`border-t border-neutral-800 ${p.id === selectedPkgId ? 'bg-white/5' : ''}`}>
                    <td className="py-2">{p.name}</td>
                    <td>{p.level} / {p.zone}</td>
                    <td><span className="px-2 py-1 rounded bg-white/10">{p.state}</span></td>
                    <td>{count}</td>
                    <td className="text-right">
                      <button 
                        className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20" 
                        onClick={() => setPkg(p.id)}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Package review */}
      {pkg && (
        <section className="grid lg:grid-cols-2 gap-4">
          <div className="border border-neutral-800 rounded-xl">
            <div className="p-3 border-b border-neutral-800 font-medium">Package Detail — {pkg.name}</div>
            <div className="p-3 space-y-2 text-sm">
              <div>Level/Zone: <b>{pkg.level}</b> / <b>{pkg.zone}</b></div>
              <div>Hangers: <b>{pkg.hangerIds.length}</b></div>
              <div className="max-h-40 overflow-auto border border-neutral-800 rounded">
                <table className="w-full text-xs">
                  <thead className="text-left opacity-70">
                    <tr>
                      <th className="py-1">Hanger</th>
                      <th>Type</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pkg.hangerIds.map(id => {
                      const h = hangers.find(x => x.id === id)!;
                      return (
                        <tr key={id} className="border-t border-neutral-800">
                          <td className="py-1">{h.name}</td>
                          <td>{h.type}</td>
                          <td>{h.status}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Inventory check */}
          <div className="border border-neutral-800 rounded-xl">
            <div className="p-3 border-b border-neutral-800 font-medium">Inventory Check</div>
            <div className="p-3">
              <table className="w-full text-sm">
                <thead className="text-left opacity-70">
                  <tr>
                    <th className="py-2">SKU</th>
                    <th>Desc</th>
                    <th className="text-right">Req</th>
                    <th className="text-right">OnHand</th>
                    <th className="text-right">Short</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map(l => (
                    <tr key={l.sku} className="border-t border-neutral-800">
                      <td className="py-2">{l.sku}</td>
                      <td>{l.desc}</td>
                      <td className="text-right">{l.required}</td>
                      <td className="text-right">{l.onHand}</td>
                      <td className={`text-right ${l.shortfall > 0 ? 'text-amber-400' : ''}`}>{l.shortfall}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-3 flex gap-2">
                <button 
                  className="px-3 py-2 rounded bg-white/10 border border-white/10 hover:bg-white/20" 
                  onClick={() => reserveInventoryForPackage(pkg.id)}
                >
                  Reserve Inventory & Create Pick
                </button>
                <button 
                  className="px-3 py-2 rounded bg-white/10 border border-white/10 hover:bg-white/20" 
                  onClick={() => {
                    // CSV export of short items as a reorder plan
                    const short = lines.filter(x => x.shortfall > 0);
                    const csv = ['sku,desc,uom,shortfall,reorderTo'].concat(
                      short.map(s => [s.sku, s.desc, s.uom, s.shortfall, s.shortfall * 2].join(','))
                    ).join('\n');
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a'); 
                    a.href = url; 
                    a.download = `Reorder_${pkg.id}.csv`; 
                    a.click(); 
                    URL.revokeObjectURL(url);
                  }}
                >
                  Export Reorder Plan (CSV)
                </button>
              </div>
            </div>
          </div>

          {/* Assignment creation */}
          <div className="border border-neutral-800 rounded-xl">
            <div className="p-3 border-b border-neutral-800 font-medium">Create Assignments</div>
            <div className="p-3 flex flex-col gap-3">
              <div className="text-sm">
                Assign each hanger to a team with station steps generated from hanger type.
              </div>
              <div className="flex gap-2">
                <select 
                  className="bg-transparent border border-neutral-700 rounded px-2 py-2"
                  defaultValue={teams[0]?.id}
                  onChange={(e) => (e.target as any)._sel = e.target.value}
                >
                  {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <button 
                  className="px-3 py-2 rounded bg-white/10 border border-white/10 hover:bg-white/20" 
                  onClick={(ev: any) => {
                    const teamId = (ev.target.previousSibling as any)._sel || teams[0]?.id;
                    const ids = useDB.getState().createAssignmentsFromPackage(pkg.id, teamId);
                    useDB.getState().assignToTeam(ids, teamId!);
                    alert(`Created ${ids.length} assignments routed to ${teamId}`);
                  }}
                >
                  Create & Route
                </button>
              </div>
            </div>
          </div>

          {/* Inventory snapshot */}
          <div className="border border-neutral-800 rounded-xl">
            <div className="p-3 border-b border-neutral-800 font-medium">Inventory Snapshot</div>
            <div className="p-3 max-h-64 overflow-auto">
              <table className="w-full text-xs">
                <thead className="text-left opacity-70">
                  <tr>
                    <th className="py-2">SKU</th>
                    <th>OnHand</th>
                    <th>Min</th>
                    <th>ReorderTo</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map(i => (
                    <tr key={i.sku} className="border-t border-neutral-800">
                      <td className="py-2">{i.sku}</td>
                      <td>{i.onHand}</td>
                      <td>{i.min}</td>
                      <td>{i.reorderTo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}