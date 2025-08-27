import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDB } from '@/store/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  ArrowLeft,
  Building2,
  Calendar,
  DollarSign,
  Package,
  Settings,
  Eye,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
  PauseCircle,
  MapPin,
  Users
} from 'lucide-react';

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, packages, hangers, setActiveProject, activeProjectId } = useDB();
  
  const proj = projects.find(p => p.id === projectId);
  if (!proj) return <div>Project not found.</div>;
  
  const isActive = activeProjectId === proj.id;
  const projectPackages = packages.filter(p => p.projectId === proj.id);
  const projectHangers = hangers.filter(h => h.projectId === proj.id);
  
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

  const getStateColor = (state: string) => {
    switch (state) {
      case 'Planned': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Kitted': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Assembled': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'ShopQAPassed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Staged': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Delivered': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getProjectProgress = () => {
    if (projectPackages.length === 0) return 0;
    const completedStates = ['ShopQAPassed', 'Staged', 'Loaded', 'Delivered'];
    const completed = projectPackages.filter(p => completedStates.includes(p.state)).length;
    return Math.round((completed / projectPackages.length) * 100);
  };

  const getPackagesByState = () => {
    const states = ['Planned', 'Kitted', 'Assembled', 'ShopQAPassed', 'Staged', 'Delivered'];
    return states.map(state => ({
      state,
      count: projectPackages.filter(p => p.state === state).length
    }));
  };

  const progress = getProjectProgress();
  const packagesByState = getPackagesByState();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/projects')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{proj.name}</h1>
              <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {proj.address}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {proj.client}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={getStatusColor(proj.status)}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(proj.status)}
                  {proj.status}
                </div>
              </Badge>
              {isActive && (
                <Badge variant="default" className="bg-primary">
                  Active Project
                </Badge>
              )}
              <Button
                onClick={() => setActiveProject(proj.id)}
                variant={isActive ? "outline" : "default"}
                disabled={isActive}
              >
                {isActive ? 'Current Active' : 'Set Active'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(proj.value! / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Project contract value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Packages</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectPackages.length}</div>
            <p className="text-xs text-muted-foreground">Total packages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hangers</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectHangers.length}</div>
            <p className="text-xs text-muted-foreground">Total hangers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress}%</div>
            <Progress value={progress} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Timeline</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">{proj.startDate}</div>
            <div className="text-sm text-muted-foreground">to {proj.endDate}</div>
          </CardContent>
        </Card>
      </div>

      {proj.description && (
        <Card>
          <CardHeader>
            <CardTitle>Project Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{proj.description}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Package Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {packagesByState.map(({ state, count }) => (
              <div key={state} className="flex items-center justify-between">
                <Badge variant="outline" className={getStateColor(state)}>
                  {state}
                </Badge>
                <span className="font-medium">{count} packages</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/shop/packages">
              <Button variant="outline" className="w-full justify-start">
                <Package className="h-4 w-4 mr-2" />
                View All Packages
                <ExternalLink className="h-4 w-4 ml-auto" />
              </Button>
            </Link>
            <Link to="/shop/hangers">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                View All Hangers  
                <ExternalLink className="h-4 w-4 ml-auto" />
              </Button>
            </Link>
            <Link to="/shop/scheduler">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Project Schedule
                <ExternalLink className="h-4 w-4 ml-auto" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="packages" className="w-full">
        <TabsList>
          <TabsTrigger value="packages">Packages ({projectPackages.length})</TabsTrigger>
          <TabsTrigger value="hangers">Hangers ({projectHangers.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="packages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Packages</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Package ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead>Hangers</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectPackages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium">{pkg.id}</TableCell>
                      <TableCell>{pkg.name}</TableCell>
                      <TableCell>{pkg.level}</TableCell>
                      <TableCell>{pkg.zone}</TableCell>
                      <TableCell>{pkg.hangerIds.length}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStateColor(pkg.state)}>
                          {pkg.state}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link to="/shop/packages">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hangers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Hangers</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hanger ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>System</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectHangers.slice(0, 10).map((hanger) => (
                    <TableRow key={hanger.id}>
                      <TableCell className="font-medium">{hanger.id}</TableCell>
                      <TableCell>{hanger.name}</TableCell>
                      <TableCell>{hanger.type}</TableCell>
                      <TableCell>{hanger.system}</TableCell>
                      <TableCell>{hanger.level}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStateColor(hanger.status)}>
                          {hanger.status}
                        </Badge>
                      </TableCell>
                      <TableCell>${hanger.estMatCost.toFixed(2)}</TableCell>
                      <TableCell>
                        <Link to="/shop/hangers">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                  {projectHangers.length > 10 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        <Link to="/shop/hangers">
                          <Button variant="outline" size="sm">
                            View All {projectHangers.length} Hangers
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}