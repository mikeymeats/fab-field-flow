import { NavLink } from 'react-router-dom'
import { nav } from '@/config/nav'
import { useDB } from '@/store/db'
import { useEffect, useRef, useState } from 'react'
import { Search, ChevronDown, ChevronRight } from 'lucide-react'

export default function Sidebar(){
  const { activeProjectId, projects, currentUser } = useDB()
  const [expandedItems, setExpandedItems] = useState<{[key: string]: boolean}>({
    'Shop Command Center': true // Expand by default since user loves this feature
  })
  
  // For now, using simple scope display - will enhance with multi-project later
  const scopeLabel = activeProjectId 
    ? (projects.find(p => p.id === activeProjectId)?.name || 'Unknown Project')
    : 'All Projects'

  const inputRef = useRef<HTMLInputElement|null>(null)
  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{ 
      if(e.key==='/' && (document.activeElement as HTMLElement)?.tagName!=='INPUT'){ 
        e.preventDefault(); 
        inputRef.current?.focus() 
      } 
    }
    window.addEventListener('keydown', onKey); 
    return ()=>window.removeEventListener('keydown', onKey)
  },[])

  // Persona-aware navigation sections
  const showSection = (section: string) => {
    if (!currentUser) return false;
    
    const persona = currentUser.persona;
    switch (section) {
      case 'Projects':
        return ['ProjectManager', 'ShopManager', 'FieldManager', 'Executive', 'ITAdmin'].includes(persona);
      case 'Shop Management':
        return ['ShopManager', 'ShopFabricator', 'ShopQAInspector', 'KittingLead', 'ITAdmin'].includes(persona);
      case 'Field Management':
        return ['FieldManager', 'Foreman', 'Installer', 'ProjectManager', 'ITAdmin'].includes(persona);
      case 'Inventory':
        return ['InventoryCoordinator', 'ShopManager', 'KittingLead', 'ITAdmin'].includes(persona);
      case 'Admin':
        return ['Executive', 'ProjectManager', 'FieldManager', 'ITAdmin'].includes(persona);
      default:
        return true;
    }
  };

  const toggleExpanded = (itemLabel: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemLabel]: !prev[itemLabel]
    }));
  };

  const renderNavItem = (item: any, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.label] || false;
    const paddingClass = depth > 0 ? 'ml-4' : '';

    if (hasChildren) {
      return (
        <div key={item.label} className={paddingClass}>
            <button
              onClick={() => toggleExpanded(item.label)}
              className="w-full px-3 py-2 rounded flex items-center justify-between hover:bg-sidebar-accent transition-colors text-sidebar-foreground"
            >
              <div className="flex items-center gap-2">
                <item.icon className="w-4 h-4 opacity-80" />
                <span>{item.label}</span>
              </div>
              {isExpanded ? 
                <ChevronDown className="h-4 w-4 opacity-60" /> : 
                <ChevronRight className="h-4 w-4 opacity-60" />
              }
          </button>
          
          {isExpanded && (
            <div className="ml-4 mt-1 space-y-1">
              {item.children.map((child: any) => renderNavItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink 
        key={item.label} 
        to={item.to}
        className={({ isActive }) => 
          `px-3 py-2 rounded flex items-center gap-2 hover:bg-sidebar-accent transition-colors text-sidebar-foreground ${
            isActive ? 'bg-sidebar-primary text-sidebar-primary-foreground' : ''
          } ${paddingClass}`
        }
      >
        <item.icon className="w-4 h-4 opacity-80" />
        <span>{item.label}</span>
      </NavLink>
    );
  };

  return (
    <aside className="w-68 min-w-64 max-w-72 border-r border-sidebar-border bg-sidebar-background p-3 space-y-4">
      <div className="font-semibold text-sidebar-foreground">MSUITE Fab & Field</div>
      <div className="text-[11px] opacity-70 text-sidebar-foreground">Scope: {scopeLabel}</div>
      
      {currentUser && (
        <div className="text-[10px] px-2 py-1 bg-sidebar-accent rounded border border-sidebar-border text-sidebar-foreground">
          Role: {currentUser.persona.replace(/([A-Z])/g, ' $1').trim()}
        </div>
      )}

      <div className="relative">
        <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"/>
        <input 
          ref={inputRef} 
          placeholder="Search ( / )" 
          className="w-full pl-7 pr-2 py-2 text-sm bg-sidebar-accent border border-sidebar-border rounded outline-none focus:border-sidebar-ring text-sidebar-foreground placeholder:text-muted-foreground"
        />
      </div>

      <nav className="space-y-4">
        {nav.map(group=>{
          if (!showSection(group.title)) return null;
          
          return (
            <div key={group.title}>
              <div className="text-[10px] uppercase opacity-60 mb-1 text-muted-foreground">{group.title}</div>
              <div className="space-y-1">
                {group.items.map((item) => renderNavItem(item))}
              </div>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}