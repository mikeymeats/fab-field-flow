import { ChevronDown, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useDB } from "@/store/db";
import { nav } from "@/config/nav";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { activeProjectId, projects, currentUser } = useDB();
  const activeProject = projects.find(p => p.id === activeProjectId);
  const [expandedItems, setExpandedItems] = useState<{[key: string]: boolean}>({
    'Shop Command Center': true // Expand by default since user is likely there
  });

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
      case 'Admin':
        return ['Executive', 'ProjectManager', 'FieldManager', 'ITAdmin'].includes(persona);
      default:
        return true;
    }
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const renderNavItem = (item: any, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.label] || false;
    const paddingClass = depth > 0 ? `pl-${4 + depth * 4}` : '';

    if (hasChildren) {
      return (
        <div key={item.label}>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => toggleExpanded(item.label)}
              className={`w-full justify-between ${paddingClass}`}
            >
              <div className="flex items-center">
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </div>
              {isExpanded ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
              }
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {isExpanded && (
            <div className="ml-4">
              {item.children.map((child: any) => renderNavItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <SidebarMenuItem key={item.label}>
        <SidebarMenuButton asChild>
          <NavLink 
            to={item.to} 
            className={({ isActive }) => 
              `${paddingClass} ${isActive ? "bg-primary text-primary-foreground" : ""}`
            }
          >
            <item.icon className="mr-2 h-4 w-4" />
            <span>{item.label}</span>
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar className="border-r border-border">
      <SidebarContent>
        <div className="p-4">
          <h2 className="text-xl font-bold text-primary">MSUITE</h2>
          <p className="text-sm text-muted-foreground">Fab & Field</p>
          {currentUser && (
            <div className="mt-2 text-xs px-2 py-1 bg-secondary/10 rounded border border-secondary/20">
              Role: {currentUser.persona.replace(/([A-Z])/g, ' $1').trim()}
            </div>
          )}
          {activeProject && (
            <div className="mt-1 text-xs px-2 py-1 bg-primary/10 rounded border border-primary/20">
              Active: {activeProject.id}
            </div>
          )}
        </div>
        
        {nav.map((group) => {
          if (!showSection(group.title)) return null;
          
          return (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => renderNavItem(item))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}