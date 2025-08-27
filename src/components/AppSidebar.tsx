import { Home, Package, Calendar, Clipboard, Truck, BarChart3, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
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

const shopItems = [
  { title: "Dashboard", url: "/shop/dashboard", icon: Home },
  { title: "Hangers", url: "/shop/hangers", icon: Package },
  { title: "Scheduler", url: "/shop/scheduler", icon: Calendar },
  { title: "Work Orders", url: "/shop/work-orders", icon: Clipboard },
  { title: "Shipping", url: "/shop/shipping", icon: Truck },
  { title: "Analytics", url: "/shop/analytics", icon: BarChart3 },
];

const fieldItems = [
  { title: "Receiving", url: "/field/receiving", icon: Package },
  { title: "Crew Assignment", url: "/field/crews", icon: Users },
  { title: "Install Board", url: "/field/install", icon: Clipboard },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-border">
      <SidebarContent>
        <div className="p-4">
          <h2 className="text-xl font-bold text-primary">MSUITE</h2>
          <p className="text-sm text-muted-foreground">Fab & Field</p>
        </div>
        
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