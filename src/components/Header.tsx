import { Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useDB } from "@/store/db";
import { useEffect, useState } from "react";

export function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const { activeProjectId, projects } = useDB();
  const activeProject = projects.find(p => p.id === activeProjectId);

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initial = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <header className="border-b border-border bg-card px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <SidebarTrigger>
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
        <h1 className="text-lg font-semibold">MSUITE Fabrication & Field Management</h1>
      </div>
      
      <div className="flex items-center gap-3">
        {activeProject && (
          <div className="text-xs px-2 py-1 bg-accent/10 border border-accent/20 rounded">
            Scoped: {activeProject.id}
          </div>
        )}
        <Button variant="outline" size="sm" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}