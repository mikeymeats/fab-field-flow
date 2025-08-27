import { NavLink, useLocation } from 'react-router-dom'
import { nav } from '@/config/nav'
import { useDB } from '@/store/db'
import { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'

function Group({ title, children }:{title:string; children:React.ReactNode}){
  const [open, setOpen] = useState(true)
  return (
    <div className="space-y-2">
      <button onClick={()=>setOpen(v=>!v)} className="w-full flex items-center justify-between text-xs uppercase text-muted-foreground hover:text-sidebar-foreground transition-colors">
        <span>{title}</span>
        <span className="text-[10px]">{open?'▾':'▸'}</span>
      </button>
      {open && <div className="grid gap-1">{children}</div>}
    </div>
  )
}

function Item({ to, icon:Icon, label }:{to:string; icon:any; label:string}){
  return (
    <NavLink to={to} className={({isActive})=>`px-3 py-2 rounded hover:bg-sidebar-accent ${isActive?'bg-sidebar-primary text-sidebar-primary-foreground':'text-sidebar-foreground'} flex items-center gap-2 transition-colors`}>
      <Icon className="w-4 h-4" /><span>{label}</span>
    </NavLink>
  )
}

export function Sidebar(){
  const { projects, activeProjectId } = useDB()
  const active = projects.find(p=>p.id===activeProjectId)
  const loc = useLocation()
  const searchRef = useRef<HTMLInputElement|null>(null)

  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase()==='k'){
        e.preventDefault()
        const ev = new CustomEvent('omni:open'); window.dispatchEvent(ev)
      }
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT'){
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  },[])

  return (
    <aside className="w-68 min-w-64 max-w-72 border-r border-border p-3 space-y-4 bg-sidebar text-sidebar-foreground">
      <div className="font-semibold text-sidebar-foreground">MSUITE Fab & Field</div>

      <div className="flex items-center gap-2 text-xs">
        <div className="px-2 py-1 rounded bg-sidebar-accent border border-sidebar-border text-sidebar-accent-foreground">{active ? `Project: ${active.name}` : 'No project selected'}</div>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"/>
        <input ref={searchRef} placeholder="Search ( / )" className="w-full pl-7 pr-2 py-2 text-sm bg-sidebar-accent border border-sidebar-border rounded outline-none focus:border-sidebar-ring text-sidebar-foreground placeholder:text-muted-foreground"
          onKeyDown={(e)=>{ if(e.key==='Enter'){ window.dispatchEvent(new CustomEvent('omni:open', { detail:{q:(e.target as HTMLInputElement).value} }))}}}
        />
      </div>

      {nav.map(group=>(
        <Group key={group.title} title={group.title}>
          {group.items.map(item=>(
            <Item key={item.label} to={item.to!} icon={item.icon} label={item.label}/>
          ))}
        </Group>
      ))}

      <div className="mt-6 text-[10px] text-muted-foreground">Path: {loc.pathname}</div>
    </aside>
  )
}