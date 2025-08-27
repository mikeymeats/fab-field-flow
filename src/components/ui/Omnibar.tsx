import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDB } from '@/store/db'

export default function Omnibar(){
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const { packages, hangers, assignments, activeProjectId } = useDB()

  useEffect(()=>{
    const onOpen = (e:any)=>{ setQ(e?.detail?.q || ''); setOpen(true) }
    window.addEventListener('omni:open', onOpen as any)
    return ()=> window.removeEventListener('omni:open', onOpen as any)
  },[])

  const items = useMemo(()=>{
    const filt = (s:string)=> s.toLowerCase().includes(q.toLowerCase())
    const res:{label:string; to:string}[] = []
    packages.filter(p=>!activeProjectId || p.projectId===activeProjectId).forEach(p=>{
      if(!q || filt(p.id) || filt(p.name)) res.push({label:`Package • ${p.id} — ${p.name}`, to:'/shop/packages'})
    })
    hangers.filter(h=>!activeProjectId || h.projectId===activeProjectId).forEach(h=>{
      if(!q || filt(h.id) || filt(h.name)) res.push({label:`Hanger • ${h.id} — ${h.name}`, to:'/shop/hangers'})
    })
    assignments.filter(a=>!activeProjectId || a.projectId===activeProjectId).forEach(a=>{
      if(!q || filt(a.id) || filt(a.packageId) || filt(a.hangerId)) res.push({label:`Assignment • ${a.id} (${a.hangerId})`, to:`/shop/task/${a.id}`})
    })
    return res.slice(0, 20)
  },[q, packages, hangers, assignments, activeProjectId])

  if(!open) return null
  return (
    <div className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm flex items-start justify-center p-8" onClick={()=>setOpen(false)}>
      <div className="w-full max-w-2xl bg-popover border border-border rounded-xl overflow-hidden shadow-lg" onClick={(e)=>e.stopPropagation()}>
        <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search hangers, packages, assignments…"
          className="w-full px-3 py-3 bg-transparent outline-none border-b border-border text-popover-foreground placeholder:text-muted-foreground"/>
        <div className="max-h-80 overflow-auto bg-popover">
          {items.map((it, i)=>(
            <button key={i} onClick={()=>{ nav(it.to); setOpen(false) }} className="w-full text-left px-3 py-2 hover:bg-accent/10 border-b border-border/40 text-popover-foreground hover:text-accent-foreground transition-colors">
              {it.label}
            </button>
          ))}
          {items.length===0 && <div className="px-3 py-8 text-sm text-muted-foreground">No results.</div>}
        </div>
      </div>
    </div>
  )
}