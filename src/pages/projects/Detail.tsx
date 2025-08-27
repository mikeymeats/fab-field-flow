import { useParams } from 'react-router-dom';
import { useDB } from '@/store/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ProjectDetail() {
  const { projectId } = useParams();
  const { projects, scopedPackages, scopedHangers, setActiveProject, activeProjectId } = useDB();
  
  const proj = projects.find(p => p.id === projectId);
  if (!proj) return <div>Project not found.</div>;
  
  const isActive = activeProjectId === proj.id;
  const pkgs = scopedPackages();
  const hs = scopedHangers();
  
  const wipCount = hs.filter(h => ['Planned', 'Kitted', 'Assembled'].includes(h.status)).length;
  const completedCount = hs.filter(h => ['ShopQAPassed', 'Staged', 'Loaded'].includes(h.status)).length;
  
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{proj.name}</h1>
          <p className="text-muted-foreground">{proj.address}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {proj.startDate} → {proj.endDate}
          </p>
        </div>
        <Button
          onClick={() => setActiveProject(proj.id)}
          variant={isActive ? "default" : "outline"}
          className={isActive ? "bg-primary" : ""}
        >
          {isActive ? 'Active Project' : 'Set Active Project'}
        </Button>
      </div>

      {isActive && (
        <Badge variant="outline" className="text-primary border-primary">
          All app sections are now scoped to this project
        </Badge>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pkgs.length}</div>
            <p className="text-xs text-muted-foreground">Organized by Level-Zone</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hangers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hs.length}</div>
            <p className="text-xs text-muted-foreground">All hanger assemblies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">WIP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wipCount}</div>
            <p className="text-xs text-muted-foreground">In fabrication</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground">Ready for field</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Use the navigation menu on the left to access shop management and field management tools. 
            All pages will show data filtered to this project when it's set as active.
          </p>
          <div className="space-y-2 text-sm">
            <div><strong>Shop Management:</strong> Track hangers, packages, work orders, kitting, QA, and shipping</div>
            <div><strong>Field Management:</strong> Manage receiving, crew assignment, installation, and field QA</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}