import { Home, Package, Calendar, Clipboard, Truck, BarChart3, Users, FolderOpen, Settings, Wrench, QrCode, UserCog, HardHat } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useDB } from "@/store/db";
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

const projectItems = [
  { title: "All Projects", url: "/projects", icon: FolderOpen },
];

const shopItems = [
  { title: "Dashboard", url: "/shop/dashboard", icon: Home },
  { title: "Shop Manager Portal", url: "/shop/manager", icon: UserCog },
  { title: "Team/Crew", url: "/shop/team", icon: HardHat },
  { title: "Hangers", url: "/shop/hangers", icon: Package },
  { title: "Packages", url: "/shop/packages", icon: Package },
  { title: "Scheduler", url: "/shop/scheduler", icon: Calendar },
  { title: "Work Orders", url: "/shop/work-orders", icon: Clipboard },
  { title: "Kitting", url: "/shop/kitting", icon: Settings },
  { title: "Shop QA", url: "/shop/qa", icon: Wrench },
  { title: "Shipping", url: "/shop/shipping", icon: Truck },
  { title: "Analytics", url: "/shop/analytics", icon: BarChart3 },
];

const fieldItems = [
  { title: "Receiving", url: "/field/receiving", icon: Package },
  { title: "Crew Assignment", url: "/field/crews", icon: Users },
  { title: "Install Board", url: "/field/install", icon: Clipboard },
];

const inventoryItems = [
  { title: "Inventory", url: "/inventory", icon: Package },
];

const analyticsItems = [
  { title: "Executive Dashboard", url: "/analytics/executive", icon: BarChart3 },
];

export function AppSidebar() {
  const { activeProjectId, projects, currentUser } = useDB();
  const activeProject = projects.find(p => p.id === activeProjectId);

  // Persona-aware navigation sections
  const showSection = (section: string) => {
    if (!currentUser) return false;
    
    const persona = currentUser.persona;
    switch (section) {
      case 'projects':
        return ['ProjectManager', 'ShopManager', 'FieldManager', 'Executive', 'ITAdmin'].includes(persona);
      case 'shop':
        return ['ShopManager', 'ShopFabricator', 'ShopQAInspector', 'KittingLead', 'ITAdmin'].includes(persona);
      case 'field':
        return ['FieldManager', 'Foreman', 'Installer', 'ProjectManager', 'ITAdmin'].includes(persona);
      case 'inventory':
        return ['InventoryCoordinator', 'ShopManager', 'KittingLead', 'ITAdmin'].includes(persona);
      case 'analytics':
        return ['Executive', 'ProjectManager', 'FieldManager', 'ITAdmin'].includes(persona);
      default:
        return true;
    }
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
        
        {showSection('projects') && (
          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {projectItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={({ isActive }) => 
                        isActive ? "bg-primary text-primary-foreground" : ""
                      }>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        
        {showSection('shop') && (
          <SidebarGroup>
            <SidebarGroupLabel>Shop Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {shopItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={({ isActive }) => 
                        isActive ? "bg-primary text-primary-foreground" : ""
                      }>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {showSection('field') && (
          <SidebarGroup>
            <SidebarGroupLabel>Field Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {fieldItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={({ isActive }) => 
                        isActive ? "bg-primary text-primary-foreground" : ""
                      }>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {showSection('inventory') && (
          <SidebarGroup>
            <SidebarGroupLabel>Inventory</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {inventoryItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={({ isActive }) => 
                        isActive ? "bg-primary text-primary-foreground" : ""
                      }>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {showSection('analytics') && (
          <SidebarGroup>
            <SidebarGroupLabel>Analytics</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {analyticsItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={({ isActive }) => 
                        isActive ? "bg-primary text-primary-foreground" : ""
                      }>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}