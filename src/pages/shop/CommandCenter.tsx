import { useMemo, useState } from 'react'
import { useDB } from '@/store/db'
import { CheckCircle2, AlertTriangle, Users, Star, StarOff, Calendar, ChevronRight } from 'lucide-react'

type Col = { key:string; label:string; states:string[] }

const COLUMNS: Col[] = [
  { key:'Submitted',     label:'Submitted',     states:['Submitted','Planned'] },
  { key:'Approved',      label:'Approved',      states:['ApprovedForFab'] },
  { key:'Kitted',        label:'Kitted',        states:['Kitted'] },
  { key:'InFab',         label:'In Fabrication',states:['InFabrication','Assembled'] },
  { key:'QA',            label:'Shop QA',       states:['ShopQA'] },
  { key:'ReadyToShip',   label:'Ready to Ship', states:['ReadyToShip'] },
]

type Selection = Record<string, boolean>

export default function CommandCenter(){
  const {
    scopedPackages, scopedHangers, teams,
    checkInventoryForPackage, reserveInventoryForPackage,
    createAssignmentsFromPackage, assignToTeam, advancePackage,
    bulkAdvancePackages, setPackagePriority, setPackageDue
  } = useDB()

  // filters (project filter is via global scope; add local text filter)
  const [q, setQ] = useState('')
  const pkgs = scopedPackages()
  const hs = scopedHangers()

  // selection (multi-select across columns)
  const [sel, setSel] = useState<Selection>({})
  const selectedIds = useMemo(()=> Object.keys(sel).filter(id=>sel[id]), [sel])
  const clearSel = ()=> setSel({})

  // derive buckets
  const filtered = useMemo(()=>{
    const lower = q.trim().toLowerCase()
    return pkgs.filter(p=>{
      if(!lower) return true
      return p.id.toLowerCase().includes(lower) || (p.name||'').toLowerCase().includes(lower)
    })
  },[pkgs,q])

  const byCol = useMemo(()=>{
    const map: Record<string, any[]> = {}
    COLUMNS.forEach(c=> map[c.key]=[])
    filtered.forEach(p=>{
      const col = COLUMNS.find(c=> c.states.includes(p.state as string))
      if(col) map[col.key].push(p)
      else {
        // anything unrecognized shows in Submitted
        map['Submitted'].push(p)
      }
    })
    // basic sort inside columns: priority (High→Low), due ASC, name
    Object.keys(map).forEach(k=>{
      map[k].sort((a,b)=>{
        const pr = (x:any)=> x.priority==='High'? 3 : x.priority==='Med'? 2 : x.priority==='Low'? 1 : 0
        const dA = a.due ? Date.parse(a.due) : Infinity
        const dB = b.due ? Date.parse(b.due) : Infinity
        if (pr(b)-pr(a) !== 0) return pr(b)-pr(a)
        if (dA - dB !== 0) return dA - dB
        return String(a.name).localeCompare(String(b.name))
      })
    })
    return map
  },[filtered])

  // DnD handlers: drag package id; drop on column → advance to first state in that column
  function onDragStart(e: React.DragEvent, id: string){
    e.dataTransfer.setData('text/plain', id)
    e.dataTransfer.effectAllowed = 'move'
  }
  function onDragOver(e: React.DragEvent){ e.preventDefault(); e.dataTransfer.dropEffect = 'move' }
  function onDrop(e: React.DragEvent, col: Col){
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if(!id) return
    const targetState = col.states[0]
    advancePackage(id, targetState)
  }

  function toggleSel(id:string){
    setSel(s=> ({ ...s, [id]: !s[id] }))
  }

  // card helpers
  function hangerCount(p:any){ return (p.hangerIds?.length||0) }
  function shortages(p:any){
    try {
      const lines = checkInventoryForPackage(p.id)
      const short = lines.filter(l=>l.shortfall>0).length
      return { short, total: lines.length }
    } catch { return { short:0, total:0 } }
  }
  function priorityChip(p:any){
    const tone = p.priority==='High' ? 'text-amber-300' : p.priority==='Med' ? 'text-sky-300' : 'text-muted-foreground'
    return <span className={`text-[10px] tracking-wide ${tone}`}>{p.priority || '—'}</span>
  }

  return (
    <div className="space-y-4">
      {/* Header & filters */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Shop Command Center</h1>
        <div className="flex items-center gap-2">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search packages…"
            className="bg-background border border-border rounded px-3 py-2 text-sm"/>
        </div>
      </div>

      {/* Bulk actions bar (appears when selection) */}
      {selectedIds.length>0 && (
        <div className="sticky top-0 z-10 bg-background/90 backdrop-blur border border-border rounded-xl p-2 flex items-center gap-2">
          <div className="text-sm">{selectedIds.length} selected</div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 rounded bg-accent hover:bg-accent/80 text-accent-foreground"
              onClick={()=>{
                const teamId = useDB.getState().teams[0]?.id
                selectedIds.forEach(id=>{
                  const created = useDB.getState().createAssignmentsFromPackage(id, teamId)
                  useDB.getState().assignToTeam(created, teamId!)
                })
              }}>Create Assignments & Route</button>
            <button className="px-3 py-2 rounded bg-accent hover:bg-accent/80 text-accent-foreground"
              onClick={()=> selectedIds.forEach(id=> reserveInventoryForPackage(id))}>Reserve & Create Pick</button>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">Advance to</span>
              <select className="bg-background border border-border rounded px-2 py-2 text-sm"
                onChange={e=>{ const s=e.target.value; if(!s) return; bulkAdvancePackages(selectedIds, s); e.currentTarget.selectedIndex=0 }}>
                <option value="">—</option>
                {['ApprovedForFab','Kitted','InFabrication','ShopQA','ReadyToShip'].map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button className="ml-auto text-xs px-2 py-1 rounded hover:bg-accent/10" onClick={clearSel}>Clear</button>
          </div>
        </div>
      )}

      {/* Columns */}
      <div className="grid xl:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 gap-3">
        {COLUMNS.map(col=>{
          const rows = byCol[col.key] || []
          return (
            <div key={col.key} className="border border-border rounded-xl flex flex-col"
                 onDragOver={onDragOver} onDrop={(e)=>onDrop(e,col)}>
              <div className="p-3 border-b border-border flex items-center justify-between">
                <div className="font-medium">{col.label}</div>
                <div className="text-xs text-muted-foreground">{rows.length}</div>
              </div>
              <div className="p-2 space-y-2 min-h-[200px] max-h-[68vh] overflow-auto">
                {rows.map(p=>{
                  const sc = shortages(p)
                  const hasShort = sc.short>0
                  const due = p.due ? new Date(p.due).toLocaleDateString() : null
                  return (
                    <div key={p.id}
                         draggable
                         onDragStart={(e)=>onDragStart(e,p.id)}
                         className={`rounded-lg border ${sel[p.id]?'border-primary':'border-border'} bg-card hover:bg-accent/50 cursor-pointer`}
                    >
                      <div className="p-2 flex items-center gap-2">
                        <input type="checkbox" checked={!!sel[p.id]} onChange={()=>toggleSel(p.id)} />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{p.name} <span className="text-muted-foreground text-xs">({p.id})</span></div>
                          <div className="text-xs text-muted-foreground">Level {p.level} / Zone {p.zone} • {hangerCount(p)} hangers</div>
                          <div className="flex items-center gap-2 mt-1">
                            {hasShort
                              ? <span className="inline-flex items-center gap-1 text-amber-300 text-[11px]"><AlertTriangle className="w-3 h-3"/> Shortages</span>
                              : <span className="inline-flex items-center gap-1 text-emerald-300 text-[11px]"><CheckCircle2 className="w-3 h-3"/> Clear</span>}
                            <span className="text-muted-foreground text-[11px]">Inv {sc.total || 0}</span>
                            <span className="text-muted-foreground">•</span>
                            {priorityChip(p)}
                            {due && <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground"><Calendar className="w-3 h-3"/>{due}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="px-2 pb-2 flex items-center gap-2 text-xs">
                        {/* quick priority toggle */}
                        <button className="px-2 py-1 rounded bg-accent/20 border border-accent/40 hover:bg-accent/30"
                          onClick={()=>{
                            const next = p.priority==='High' ? 'Med' : p.priority==='Med' ? 'Low' : 'High'
                            setPackagePriority(p.id, next as any)
                          }}>
                          {p.priority==='High' ? <Star className="w-3 h-3"/> : <StarOff className="w-3 h-3"/>} Priority
                        </button>
                        {/* quick due date */}
                        <label className="inline-flex items-center gap-1 px-2 py-1 rounded bg-accent/20 border border-accent/40 hover:bg-accent/30">
                          <Calendar className="w-3 h-3"/><input type="date" className="bg-transparent outline-none text-xs"
                            onChange={(e)=> e.target.value && setPackageDue(p.id, new Date(e.target.value).toISOString())}/>
                        </label>
                        {/* one-click route to first team */}
                        <button className="ml-auto px-2 py-1 rounded bg-accent/20 border border-accent/40 hover:bg-accent/30 inline-flex items-center gap-1"
                          onClick={()=>{
                            const teamId = useDB.getState().teams[0]?.id
                            const created = useDB.getState().createAssignmentsFromPackage(p.id, teamId)
                            useDB.getState().assignToTeam(created, teamId!)
                          }}>
                          <Users className="w-3 h-3"/> Route
                        </button>
                        {/* quick next step */}
                        <button className="px-2 py-1 rounded bg-accent/20 border border-accent/40 hover:bg-accent/30 inline-flex items-center gap-1"
                          onClick={()=>{
                            const next = nextState(p.state)
                            if(next) advancePackage(p.id, next)
                          }}>
                          Next <ChevronRight className="w-3 h-3"/>
                        </button>
                      </div>
                    </div>
                  )
                })}
                {rows.length===0 && <div className="text-xs text-muted-foreground p-2">No packages</div>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// tiny helper to pick a reasonable next state
function nextState(current?: string){
  const order = ['Submitted','Planned','ApprovedForFab','Kitted','InFabrication','Assembled','ShopQA','ReadyToShip']
  const i = order.indexOf(current||'')
  return i>=0 && i<order.length-1 ? order[i+1] : null
}