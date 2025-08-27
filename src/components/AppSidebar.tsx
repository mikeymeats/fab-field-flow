import { Home, Package, Calendar, Clipboard, Truck, BarChart3, Users, FolderOpen, Settings, Wrench, QrCode } from "lucide-react";
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

export function AppSidebar() {
  const { activeProjectId, projects } = useDB();
  const activeProject = projects.find(p => p.id === activeProjectId);

  return (
    <Sidebar className="border-r border-border">
      <SidebarContent>
        <div className="p-4">
          <h2 className="text-xl font-bold text-primary">MSUITE</h2>
          <p className="text-sm text-muted-foreground">Fab & Field</p>
          {activeProject && (
            <div className="mt-2 text-xs px-2 py-1 bg-primary/10 rounded border border-primary/20">
              Active: {activeProject.id}
            </div>
          )}
        </div>
        
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
      </SidebarContent>
    </Sidebar>
  );
}