import { useMemo, useState } from 'react'
import { useDB } from '@/store/db'
import { Filter, SortAsc, CheckCircle2, AlertTriangle, Download, ArrowRight, Users, Settings, PackageCheck, ClipboardList } from 'lucide-react'

type SortKey = 'name'|'level'|'zone'|'hangers'|'state'

export default function ShopManager(){
  const { scopedPackages, hangers, inventory, teams,
          checkInventoryForPackage, reserveInventoryForPackage,
          createAssignmentsFromPackage, assignToTeam, advancePackage } = useDB()

  const pkgs = scopedPackages()
  const [q, setQ] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('name')
  const [stateFilter, setStateFilter] = useState<string>('All')

  const filtered = useMemo(()=>{
    let arr = pkgs.filter(p => !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.id.toLowerCase().includes(q.toLowerCase()))
    if (stateFilter!=='All') arr = arr.filter(p=>p.state===stateFilter)
    const sorter:Record<SortKey,(a:any,b:any)=>number> = {
      name: (a,b)=> a.name.localeCompare(b.name),
      level: (a,b)=> String(a.level).localeCompare(String(b.level)),
      zone: (a,b)=> String(a.zone).localeCompare(String(b.zone)),
      hangers: (a,b)=> (b.hangerIds?.length||0)-(a.hangerIds?.length||0),
      state: (a,b)=> a.state.localeCompare(b.state)
    }
    return arr.sort(sorter[sortBy])
  },[pkgs,q,sortBy,stateFilter])

  const [selectedPkgId, setPkg] = useState<string | null>(filtered[0]?.id || null)
  const pkg = useMemo(()=> filtered.find(p=>p.id===selectedPkgId), [filtered, selectedPkgId])
  const lines = useMemo(()=> pkg ? checkInventoryForPackage(pkg.id) : [], [pkg, checkInventoryForPackage])
  const shortage = lines.filter(l=>l.shortfall>0)
  const hasShort = shortage.length>0

  // --- UI helpers ---
  const Chip = ({children, tone}:{children:React.ReactNode; tone?:'ok'|'warn'|'muted'})=>{
    const cls = tone==='ok' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
      : tone==='warn' ? 'bg-destructive/20 text-destructive border-destructive/40'
      : 'bg-muted text-muted-foreground border-border'
    return <span className={`text-xs px-2 py-1 border rounded ${cls}`}>{children}</span>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Shop Manager Portal</h1>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Filter className="w-4 h-4"/><span>Queue → Review → Actions → Assign</span>
        </div>
      </div>

      <section className="grid md:grid-cols-4 gap-3">
        <div className="border border-border rounded-xl p-3 bg-card">
          <div className="text-xs text-muted-foreground">Inbound Packages</div>
          <div className="text-2xl font-semibold text-card-foreground">{pkgs.length}</div>
        </div>
        <div className="border border-border rounded-xl p-3 bg-card">
          <div className="text-xs text-muted-foreground">Ready to Reserve</div>
          <div className="text-2xl font-semibold text-card-foreground">{pkgs.filter(p=>p.state==='Planned').length}</div>
        </div>
        <div className="border border-border rounded-xl p-3 bg-card">
          <div className="text-xs text-muted-foreground">Kitted</div>
          <div className="text-2xl font-semibold text-card-foreground">{pkgs.filter(p=>p.state==='Kitted').length}</div>
        </div>
        <div className="border border-border rounded-xl p-3 bg-card">
          <div className="text-xs text-muted-foreground">Ready to Ship</div>
          <div className="text-2xl font-semibold text-card-foreground">{pkgs.filter(p=>p.state==='ReadyToShip').length}</div>
        </div>
      </section>

      <section className="grid lg:grid-cols-12 gap-4">
        {/* LEFT: Queue */}
        <div className="lg:col-span-4 border border-border rounded-xl overflow-hidden bg-card">
          <div className="p-3 border-b border-border flex items-center gap-2">
            <input placeholder="Search packages…" value={q} onChange={e=>setQ(e.target.value)}
              className="w-full bg-muted border border-input rounded px-2 py-2 text-sm text-foreground placeholder:text-muted-foreground"/>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value as SortKey)}
              className="bg-muted border border-input rounded px-2 py-2 text-sm text-foreground">
              <option value="name">Sort: Name</option>
              <option value="level">Sort: Level</option>
              <option value="zone">Sort: Zone</option>
              <option value="hangers">Sort: Hangers</option>
              <option value="state">Sort: State</option>
            </select>
            <select value={stateFilter} onChange={e=>setStateFilter(e.target.value)}
              className="bg-muted border border-input rounded px-2 py-2 text-sm text-foreground">
              {['All','Planned','Kitted','InFabrication','Assembled','ShopQA','ReadyToShip','InTransit'].map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="max-h-[60vh] overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-muted-foreground sticky top-0 bg-card">
                <tr><th className="py-2 px-3">Package</th><th>Level</th><th>Zone</th><th>Hangers</th><th>State</th></tr>
              </thead>
              <tbody>
                {filtered.map(p=>{
                  const selected = p.id===selectedPkgId
                  return (
                    <tr key={p.id} className={`border-t border-border hover:bg-accent/5 cursor-pointer ${selected?'bg-accent/10':''} text-card-foreground`}
                        onClick={()=>setPkg(p.id)}>
                      <td className="py-2 px-3">{p.name}</td>
                      <td>{p.level}</td>
                      <td>{p.zone}</td>
                      <td>{p.hangerIds.length}</td>
                      <td><Chip tone={p.state==='Planned'?'warn':'muted'}>{p.state}</Chip></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* CENTER: Review */}
        <div className="lg:col-span-5 border border-border rounded-xl overflow-hidden bg-card">
          <div className="p-3 border-b border-border font-medium flex items-center gap-2 text-card-foreground">
            <ClipboardList className="w-4 h-4"/><span>Package Review</span>
            <span className="ml-auto text-xs text-muted-foreground">{pkg ? pkg.id : 'Select a package'}</span>
          </div>
          {!pkg ? (
            <div className="p-6 text-sm text-muted-foreground">Choose a package from the list to review details.</div>
          ) : (
            <div className="p-3 space-y-4">
              {/* Tabs */}
              <div className="flex items-center gap-2 text-sm">
                <button className="px-3 py-2 rounded bg-accent/20 border border-accent/40 text-accent-foreground">Overview</button>
                <button className="px-3 py-2 rounded hover:bg-accent/5 text-muted-foreground hover:text-card-foreground">Hangers</button>
                <button className="px-3 py-2 rounded hover:bg-accent/5 text-muted-foreground hover:text-card-foreground">Inventory</button>
                <button className="px-3 py-2 rounded hover:bg-accent/5 text-muted-foreground hover:text-card-foreground">Assignments</button>
                <button className="px-3 py-2 rounded hover:bg-accent/5 text-muted-foreground hover:text-card-foreground">Audit</button>
              </div>

              {/* Overview pane */}
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="border border-border rounded p-3 bg-muted">
                  <div className="text-xs text-muted-foreground">Level / Zone</div>
                  <div className="text-lg text-card-foreground">{pkg.level} / {pkg.zone}</div>
                </div>
                <div className="border border-border rounded p-3 bg-muted">
                  <div className="text-xs text-muted-foreground">Hangers</div>
                  <div className="text-lg text-card-foreground">{pkg.hangerIds.length}</div>
                </div>
                <div className="border border-border rounded p-3 bg-muted">
                  <div className="text-xs text-muted-foreground">State</div>
                  <div><Chip tone={pkg.state==='Planned'?'warn':'muted'}>{pkg.state}</Chip></div>
                </div>
              </div>

              {/* Hangers table */}
              <div className="border border-border rounded bg-muted">
                <div className="p-2 border-b border-border text-sm font-medium text-card-foreground">Hangers</div>
                <div className="max-h-56 overflow-auto">
                  <table className="w-full text-xs">
                    <thead className="text-left text-muted-foreground sticky top-0 bg-muted">
                      <tr><th className="py-2 px-2">Hanger</th><th>Type</th><th>System</th><th>Level/Zone</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {pkg.hangerIds.map(id=>{
                        const h = hangers.find(x=>x.id===id)!
                        return (
                          <tr key={id} className="border-t border-border text-card-foreground">
                            <td className="py-2 px-2">{h.name}</td>
                            <td>{h.type}</td>
                            <td>{h.system}</td>
                            <td>{h.level}/{h.zone}</td>
                            <td><Chip>{h.status}</Chip></td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Inventory summary */}
              <div className="border border-border rounded bg-muted">
                <div className="p-2 border-b border-border text-sm font-medium text-card-foreground">Inventory Check</div>
                <div className="max-h-56 overflow-auto">
                  <table className="w-full text-xs">
                    <thead className="text-left text-muted-foreground sticky top-0 bg-muted">
                      <tr><th className="py-2 px-2">SKU</th><th>Desc</th><th className="text-right">Req</th><th className="text-right">OnHand</th><th className="text-right">Short</th></tr>
                    </thead>
                    <tbody>
                      {lines.map(l=>(
                        <tr key={l.sku} className="border-t border-border text-card-foreground">
                          <td className="py-2 px-2">{l.sku}</td>
                          <td>{l.desc}</td>
                          <td className="text-right">{l.required}</td>
                          <td className="text-right">{l.onHand}</td>
                          <td className={`text-right ${l.shortfall>0?'text-destructive':''}`}>{l.shortfall}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-2 text-xs text-muted-foreground">{hasShort ? <span className="text-destructive flex items-center gap-1"><AlertTriangle className="w-4 h-4"/> Shortages detected</span> : <span className="text-emerald-300 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Sufficient inventory</span>}</div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Sticky actions */}
        <div className="lg:col-span-3">
          <div className="sticky top-4 space-y-3">
            <div className="border border-border rounded-xl bg-card">
              <div className="p-3 border-b border-border font-medium flex items-center gap-2 text-card-foreground"><PackageCheck className="w-4 h-4"/><span>Actions</span></div>
              <div className="p-3 grid gap-2">
                <button disabled={!pkg} className="px-3 py-2 rounded bg-accent/20 border border-accent/40 hover:bg-accent/30 disabled:opacity-40 disabled:cursor-not-allowed text-accent-foreground font-medium"
                  onClick={()=> pkg && reserveInventoryForPackage(pkg.id)}>
                  Reserve Inventory & Create Pick
                </button>

                <button disabled={!pkg} className="px-3 py-2 rounded bg-accent/20 border border-accent/40 hover:bg-accent/30 disabled:opacity-40 disabled:cursor-not-allowed text-accent-foreground font-medium"
                  onClick={()=>{
                    if(!pkg) return
                    // create & route to first team
                    const teamId = teams[0]?.id
                    const ids = useDB.getState().createAssignmentsFromPackage(pkg.id, teamId)
                    useDB.getState().assignToTeam(ids, teamId!)
                    alert(`Created ${ids.length} assignments to ${teamId}`)
                  }}>
                  Create Assignments & Route
                </button>

                <button disabled={!pkg} className="px-3 py-2 rounded bg-muted border border-input hover:bg-accent/10 disabled:opacity-40 disabled:cursor-not-allowed text-card-foreground"
                  onClick={()=>{
                    if(!pkg) return
                    const short = lines.filter(x=>x.shortfall>0)
                    const csv = ['sku,desc,uom,shortfall,reorderTo'].concat(short.map(s=>[s.sku,s.desc,s.uom,s.shortfall, s.shortfall*2].join(','))).join('\n')
                    const blob = new Blob([csv],{type:'text/csv'})
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a'); a.href=url; a.download=`Reorder_${pkg.id}.csv`; a.click(); URL.revokeObjectURL(url)
                  }}>
                  <span className="inline-flex items-center gap-2"><Download className="w-4 h-4"/>Export Reorder CSV</span>
                </button>

                <button disabled={!pkg} className="px-3 py-2 rounded bg-muted border border-input hover:bg-accent/10 disabled:opacity-40 disabled:cursor-not-allowed text-card-foreground"
                  onClick={()=> pkg && advancePackage(pkg.id, 'ReadyToShip')}>
                  Advance State to ReadyToShip <ArrowRight className="w-4 h-4 inline ml-1"/>
                </button>

                <button disabled={!pkg} className="px-3 py-2 rounded bg-muted border border-input hover:bg-accent/10 disabled:opacity-40 disabled:cursor-not-allowed text-card-foreground">
                  Print Labels
                </button>
              </div>
            </div>

            <div className="border border-border rounded-xl bg-card">
              <div className="p-3 border-b border-border font-medium flex items-center gap-2 text-card-foreground"><Users className="w-4 h-4"/><span>Teams</span></div>
              <div className="p-3 text-sm text-muted-foreground">
                {teams.map(t=> <div key={t.id} className="flex items-center justify-between py-1">
                  <span className="text-card-foreground">{t.name}</span><span className="text-xs text-muted-foreground">{t.stations.join(', ')}</span>
                </div>)}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}