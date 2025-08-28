import { Link } from 'react-router-dom';
import { useDB } from '@/store/db';
import { siteManager } from '@/lib/toolsSiteManager';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Wrench, AlertTriangle, CheckCircle, Battery } from 'lucide-react';

export function WorkerDashboard() {
  const { assignments, teams, activeProjectId, currentUser } = useDB();
  
  // Get current user's team
  const userTeam = teams.find(t => 
    t.members.some(m => m.id === currentUser?.id)
  );
  
  // Filter assignments for current user's team
  const myAssignments = assignments.filter(a => 
    a.projectId === activeProjectId && 
    (a.teamId === userTeam?.id || a.assigneeId === currentUser?.id)
  );
  
  // Categorize assignments
  const activeAssignments = myAssignments.filter(a => a.state === 'InProgress');
  const queuedAssignments = myAssignments.filter(a => a.state === 'Queued');
  const completedToday = myAssignments.filter(a => 
    a.state === 'Done' && 
    a.finishedAt && 
    new Date(a.finishedAt).toDateString() === new Date().toDateString()
  );
  
  // Get tools for user's team stations
  const teamTools = userTeam?.stations.flatMap(station => 
    siteManager.getToolsForStation(station)
  ) || [];
  
  const getStateBadge = (state: string) => {
    const variants = {
      'InProgress': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'Queued': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'Done': 'bg-green-500/20 text-green-300 border-green-500/30',
      'QA': 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    };
    return variants[state as keyof typeof variants] || 'bg-muted';
  };
  
  const getPriorityBadge = (priority: string) => {
    const variants = {
      'High': 'bg-red-500/20 text-red-300 border-red-500/30',
      'Med': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'Low': 'bg-green-500/20 text-green-300 border-green-500/30'
    };
    return variants[priority as keyof typeof variants] || 'bg-muted';
  };

  return (
    <div className="space-y-6">
      {/* Header with user info */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Work</h1>
          <p className="text-muted-foreground">
            {currentUser?.name} • {userTeam?.name || 'No Team'} • {currentUser?.shift || 'Day'} Shift
          </p>
        </div>
        <div className="text-right text-sm text-muted-foreground">
          <div>{new Date().toLocaleDateString()}</div>
          <div>{new Date().toLocaleTimeString()}</div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold text-foreground">{activeAssignments.length}</div>
                <div className="text-xs text-muted-foreground">Active Tasks</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold text-foreground">{queuedAssignments.length}</div>
                <div className="text-xs text-muted-foreground">In Queue</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-foreground">{completedToday.length}</div>
                <div className="text-xs text-muted-foreground">Done Today</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Wrench className="h-5 w-5 text-accent" />
              <div>
                <div className="text-2xl font-bold text-foreground">{teamTools.length}</div>
                <div className="text-xs text-muted-foreground">Available Tools</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Tasks */}
      {activeAssignments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Active Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeAssignments.map(assignment => (
              <div key={assignment.id} className="flex items-center justify-between p-3 rounded-lg bg-card border">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">{assignment.id}</span>
                    <Badge className={getPriorityBadge(assignment.priority || 'Low')}>
                      {assignment.priority || 'Low'}
                    </Badge>
                    <Badge className={getStateBadge(assignment.state)}>
                      {assignment.state}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Package {assignment.packageId} • Hanger {assignment.hangerId}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Started {assignment.startedAt ? new Date(assignment.startedAt).toLocaleTimeString() : 'Not started'}
                  </div>
                </div>
                <Link 
                  to={`/shop/task/${assignment.id}`}
                  className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Continue
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Task Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Task Queue ({queuedAssignments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {queuedAssignments
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map(assignment => (
                <div key={assignment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">{assignment.id}</span>
                      <Badge className={getPriorityBadge(assignment.priority || 'Low')}>
                        {assignment.priority || 'Low'}
                      </Badge>
                      {assignment.expedite && (
                        <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                          RUSH
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Package {assignment.packageId} • Hanger {assignment.hangerId}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Est. {assignment.eta ? new Date(assignment.eta).toLocaleTimeString() : 'No ETA'}
                    </div>
                  </div>
                  <Link 
                    to={`/shop/task/${assignment.id}`}
                    className="px-4 py-2 rounded bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  >
                    Start
                  </Link>
                </div>
              ))}
            {queuedAssignments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No tasks in queue
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tool Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            My Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {teamTools.map(tool => (
              <div key={tool.id} className="p-3 rounded-lg bg-muted/50 border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{tool.id}</span>
                  <div className="flex items-center gap-1">
                    <Battery className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-muted-foreground">85%</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mb-1">{tool.name}</div>
                <div className="text-xs text-muted-foreground">Station: {tool.station}</div>
                {tool.calibrationDue && (
                  <div className="text-xs text-yellow-400 mt-1">
                    Cal due: {new Date(tool.calibrationDue).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}