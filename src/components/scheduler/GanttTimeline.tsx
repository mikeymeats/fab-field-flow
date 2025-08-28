import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Zap, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import type { Package, Team, Assignment } from '@/store/db';

interface GanttTimelineProps {
  packages: Package[];
  teams: Team[];
  assignments: Assignment[];
  onMovePackage: (packageId: string, stage: string) => void;
}

interface GanttTask {
  id: string;
  name: string;
  package: Package;
  startDate: Date;
  endDate: Date;
  progress: number;
  stage: string;
  priority: 'Low' | 'Med' | 'High';
  isOverdue: boolean;
  dependencies: string[];
  teamId?: string;
}

export function GanttTimeline({ packages, teams, assignments, onMovePackage }: GanttTimelineProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  // Generate Gantt tasks from packages
  const ganttTasks = useMemo(() => {
    return packages.map((pkg): GanttTask => {
      const baseDate = new Date();
      const startDate = new Date(baseDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
      const duration = Math.floor(Math.random() * 14) + 3; // 3-17 days
      const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);
      
      const stageProgress = {
        'Planned': 0,
        'Approved': 10,
        'Fabrication': 35,
        'InProduction': 45,
        'QA': 70,
        'Inspection': 75,
        'Packaging': 85,
        'Kitting': 90,
        'Shipping': 95,
        'Shipped': 100,
        'Delivered': 100,
      };

      return {
        id: pkg.id,
        name: pkg.name,
        package: pkg,
        startDate,
        endDate,
        progress: stageProgress[pkg.state] || 0,
        stage: pkg.state,
        priority: ['Low', 'Med', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Med' | 'High',
        isOverdue: endDate < new Date() && pkg.state !== 'Delivered' && pkg.state !== 'Shipped',
        dependencies: [], // Could be calculated based on package relationships
        teamId: assignments.find(a => a.packageId === pkg.id)?.teamId,
      };
    });
  }, [packages, assignments]);

  // Generate timeline grid
  const getTimelineGrid = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay()); // Start of week
    
    const days = [];
    for (let i = 0; i < (viewMode === 'day' ? 1 : viewMode === 'week' ? 7 : 30); i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const timelineGrid = getTimelineGrid();

  const navigateTime = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    const amount = viewMode === 'day' ? 1 : viewMode === 'week' ? 7 : 30;
    newDate.setDate(newDate.getDate() + (direction === 'next' ? amount : -amount));
    setCurrentDate(newDate);
  };

  const getTaskPosition = (task: GanttTask) => {
    const gridStart = timelineGrid[0];
    const gridEnd = timelineGrid[timelineGrid.length - 1];
    const totalDays = Math.ceil((gridEnd.getTime() - gridStart.getTime()) / (24 * 60 * 60 * 1000));
    
    const taskStart = Math.max(0, Math.ceil((task.startDate.getTime() - gridStart.getTime()) / (24 * 60 * 60 * 1000)));
    const taskDuration = Math.ceil((task.endDate.getTime() - task.startDate.getTime()) / (24 * 60 * 60 * 1000));
    
    return {
      left: `${(taskStart / totalDays) * 100}%`,
      width: `${Math.min((taskDuration / totalDays) * 100, 100 - (taskStart / totalDays) * 100)}%`,
    };
  };

  const getPriorityColor = (priority: 'Low' | 'Med' | 'High') => {
    switch (priority) {
      case 'High': return 'bg-red-500';
      case 'Med': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Planned': return 'bg-gray-400';
      case 'Approved': return 'bg-blue-400';
      case 'Fabrication': case 'InProduction': return 'bg-blue-500';
      case 'QA': case 'Inspection': return 'bg-purple-500';
      case 'Packaging': case 'Kitting': return 'bg-green-500';
      case 'Shipping': return 'bg-orange-500';
      case 'Shipped': case 'Delivered': return 'bg-green-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-card border rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Production Gantt Chart</h3>
          <span className="text-sm text-muted-foreground">
            {ganttTasks.length} packages scheduled
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {(['day', 'week', 'month'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`
                  px-3 py-1 rounded text-sm font-medium transition-colors capitalize
                  ${viewMode === mode 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTime('prev')}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3 py-2 bg-muted rounded-lg">
              <span className="text-sm font-medium">
                {timelineGrid[0].toLocaleDateString()} - {timelineGrid[timelineGrid.length - 1].toLocaleDateString()}
              </span>
            </div>
            <button
              onClick={() => navigateTime('next')}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="border rounded-lg overflow-hidden">
        {/* Timeline Header */}
        <div className="flex bg-muted/50">
          <div className="w-64 p-3 border-r bg-background">
            <span className="text-sm font-medium text-foreground">Package</span>
          </div>
          <div className="flex-1 flex">
            {timelineGrid.map((date, index) => (
              <div
                key={index}
                className="flex-1 p-2 text-center border-r last:border-r-0"
              >
                <div className="text-xs font-medium text-foreground">
                  {viewMode === 'day' 
                    ? date.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })
                    : date.toLocaleDateString('en', { weekday: 'short', day: 'numeric' })
                  }
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Rows */}
        <div className="max-h-96 overflow-y-auto">
          {ganttTasks.map((task) => (
            <div
              key={task.id}
              className={`
                flex border-b last:border-b-0 hover:bg-muted/30 transition-colors
                ${selectedTask === task.id ? 'bg-primary/10' : ''}
              `}
            >
              {/* Task Info */}
              <div className="w-64 p-3 border-r bg-background">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm text-foreground truncate">
                      {task.name}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`
                        text-xs px-2 py-1 rounded-full text-white
                        ${getPriorityColor(task.priority)}
                      `}>
                        {task.priority}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {task.stage}
                      </span>
                      {task.isOverdue && (
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end text-xs text-muted-foreground">
                    <span>{task.progress}%</span>
                    {task.teamId && (
                      <span className="mt-1">
                        {teams.find(t => t.id === task.teamId)?.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Timeline Bar */}
              <div className="flex-1 p-2 relative">
                <div
                  className={`
                    relative h-6 rounded transition-all cursor-pointer
                    ${getStageColor(task.stage)}
                    ${task.isOverdue ? 'ring-2 ring-red-500' : ''}
                  `}
                  style={getTaskPosition(task)}
                  onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
                  title={`${task.name} (${task.startDate.toLocaleDateString()} - ${task.endDate.toLocaleDateString()})`}
                >
                  {/* Progress Bar */}
                  <div
                    className="absolute top-0 left-0 h-full bg-white/30 rounded transition-all"
                    style={{ width: `${task.progress}%` }}
                  />
                  
                  {/* Task Content */}
                  <div className="absolute inset-0 flex items-center justify-between px-2">
                    <span className="text-xs font-medium text-white truncate">
                      {task.package.id}
                    </span>
                    {task.priority === 'High' && (
                      <Zap className="w-3 h-3 text-yellow-300" />
                    )}
                  </div>
                </div>

                {/* Today Indicator */}
                {timelineGrid.some(date => 
                  date.toDateString() === new Date().toDateString()
                ) && (
                  <div
                    className="absolute top-0 w-0.5 h-full bg-red-500 pointer-events-none"
                    style={{
                      left: `${(timelineGrid.findIndex(date => 
                        date.toDateString() === new Date().toDateString()
                      ) / timelineGrid.length) * 100}%`
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span>Fabrication</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-500 rounded" />
            <span>QA</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded" />
            <span>Packaging</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded" />
            <span>Shipping</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-yellow-500" />
            <span>High Priority</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-red-500" />
            <span>Overdue</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-0.5 h-3 bg-red-500" />
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}