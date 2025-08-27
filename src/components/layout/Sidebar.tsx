import { NavLink, useLocation } from 'react-router-dom'
import { nav } from '@/config/nav'
import { useDB } from '@/store/db'
import { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'

function Group({ title, children }:{title:string; children:React.ReactNode}){
  const [open, setOpen] = useState(true)
  return (
    <div className="space-y-2">
      <button onClick={()=>setOpen(v=>!v)} className="w-full flex items-center justify-between text-xs uppercase opacity-60">
        <span>{title}</span>
        <span className="text-[10px]">{open?'▾':'▸'}</span>
      </button>
      {open && <div className="grid gap-1">{children}</div>}
    </div>
  )
}

function Item({ to, icon:Icon, label }:{to:string; icon:any; label:string}){
  return (
    <NavLink to={to} className={({isActive})=>`px-3 py-2 rounded hover:bg-white/5 ${isActive?'bg-white/10':''} flex items-center gap-2`}>
      <Icon className="w-4 h-4 opacity-80" /><span>{label}</span>
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
    <aside className="w-68 min-w-64 max-w-72 border-r border-neutral-800 p-3 space-y-4">
      <div className="font-semibold">MSUITE Fab & Field</div>

      <div className="flex items-center gap-2 text-xs">
        <div className="px-2 py-1 rounded bg-white/10 border border-white/10">{active ? `Project: ${active.name}` : 'No project selected'}</div>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 opacity-60"/>
        <input ref={searchRef} placeholder="Search ( / )" className="w-full pl-7 pr-2 py-2 text-sm bg-transparent border border-neutral-700 rounded outline-none focus:border-neutral-500"
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

      <div className="mt-6 text-[10px] opacity-60">Path: {loc.pathname}</div>
    </aside>
  )
}