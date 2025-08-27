import { Link } from 'react-router-dom';
import { useDB } from '@/store/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  Calendar, 
  DollarSign, 
  Package, 
  Users, 
  Archive,
  Clock,
  CheckCircle,
  AlertCircle,
  PauseCircle
} from 'lucide-react';

export default function ProjectsIndex() {
  const { projects, packages, hangers, setActiveProject } = useDB();
  
  const activeProjects = projects.filter(p => p.isActive && !p.isArchived);
  const inactiveProjects = projects.filter(p => !p.isActive && !p.isArchived);
  const archivedProjects = projects.filter(p => p.isArchived);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Planning': return <Clock className="h-4 w-4" />;
      case 'Active': return <CheckCircle className="h-4 w-4" />;
      case 'OnHold': return <PauseCircle className="h-4 w-4" />;
      case 'Completed': return <CheckCircle className="h-4 w-4" />;
      case 'Cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planning': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Active': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'OnHold': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getProjectProgress = (projectId: string) => {
    const projectPackages = packages.filter(p => p.projectId === projectId);
    if (projectPackages.length === 0) return 0;
    
    const completedStates = ['ShopQAPassed', 'Staged', 'Loaded', 'Delivered'];
    const completed = projectPackages.filter(p => completedStates.includes(p.state)).length;
    return Math.round((completed / projectPackages.length) * 100);
  };

  const ProjectCard = ({ project }: { project: any }) => {
    const pkgCount = packages.filter(x => x.projectId === project.id).length;
    const hCount = hangers.filter(x => x.projectId === project.id).length;
    const progress = getProjectProgress(project.id);

    return (
      <Card className="hover:shadow-lg transition-all cursor-pointer group">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Link to={`/projects/${project.id}`}>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {project.name}
                </CardTitle>
              </Link>
              <p className="text-sm text-muted-foreground mt-1">{project.address}</p>
              <p className="text-xs text-muted-foreground mt-1">{project.client}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="outline" className={getStatusColor(project.status)}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(project.status)}
                  {project.status}
                </div>
              </Badge>
              {project.isActive && (
                <Badge variant="default" className="text-xs">Active</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{pkgCount}</div>
              <div className="text-xs text-muted-foreground">Packages</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{hCount}</div>
              <div className="text-xs text-muted-foreground">Hangers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">${(project.value / 1000).toFixed(0)}K</div>
              <div className="text-xs text-muted-foreground">Value</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Progress</span>
              <span className="text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{project.startDate} → {project.endDate}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                setActiveProject(project.id);
              }}
            >
              Set Active
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">Manage your fabrication and field projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{projects.length}</div>
            </div>
            <p className="text-xs text-muted-foreground">Total Projects</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div className="text-2xl font-bold text-green-500">{activeProjects.length}</div>
            </div>
            <p className="text-xs text-muted-foreground">Active Projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{packages.length}</div>
            </div>
            <p className="text-xs text-muted-foreground">Total Packages</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">
                ${(projects.reduce((sum, p) => sum + (p.value || 0), 0) / 1000000).toFixed(1)}M
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Total Value</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active ({activeProjects.length})</TabsTrigger>
          <TabsTrigger value="inactive">Planning & Completed ({inactiveProjects.length})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({archivedProjects.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-6">
            {activeProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
            {activeProjects.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No active projects found.
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="inactive" className="space-y-4">
          <div className="grid gap-6">
            {inactiveProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
            {inactiveProjects.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No inactive projects found.
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="archived" className="space-y-4">
          <div className="grid gap-6">
            {archivedProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
            {archivedProjects.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No archived projects found.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}