import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, BarChart3 } from 'lucide-react';
import type { Package, Team, Assignment } from '@/store/db';

interface ProductionTimelineProps {
  packages: Package[];
  teams: Team[];
  assignments: Assignment[];
}

export function ProductionTimeline({ packages, teams, assignments }: ProductionTimelineProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Generate week view
  const getWeekDays = () => {
    const start = new Date(currentWeek);
    start.setDate(start.getDate() - start.getDay()); // Start of week (Sunday)
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });
  };

  const weekDays = getWeekDays();

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const getPackagesForDay = (date: Date) => {
    // Simplified - randomly assign some packages to each day for demo
    return packages.filter(() => Math.random() < 0.2);
  };

  const getTeamUtilization = (teamId: string, date: Date) => {
    const teamAssignments = assignments.filter(
      a => a.teamId === teamId
    );
    
    const team = teams.find(t => t.id === teamId);
    if (!team) return 0;
    
    const totalHours = teamAssignments.reduce((sum, assignment) => sum + 8, 0); // Simplified
    const availableHours = team.dailyHours || team.members.length * 8;
    
    return Math.min(100, (totalHours / availableHours) * 100);
  };

  return (
    <div className="bg-card border rounded-lg p-4">
      {/* Timeline Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Production Timeline</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">
              {weekDays[0].toLocaleDateString()} - {weekDays[6].toLocaleDateString()}
            </span>
          </div>
          <button
            onClick={() => navigateWeek('next')}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Days Header */}
          <div className="grid grid-cols-8 gap-1 mb-2">
            <div className="p-2 text-xs font-medium text-muted-foreground">
              Teams
            </div>
            {weekDays.map((day, index) => (
              <div key={index} className="p-2 text-center border rounded bg-muted/50">
                <div className="text-xs font-medium text-foreground">
                  {day.toLocaleDateString('en', { weekday: 'short' })}
                </div>
                <div className="text-xs text-muted-foreground">
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* Team Rows */}
          {teams.map((team) => (
            <div key={team.id} className="grid grid-cols-8 gap-1 mb-1">
              {/* Team Name */}
              <div className="p-2 text-xs font-medium text-foreground bg-muted/30 rounded flex items-center">
                <span className="truncate">{team.name}</span>
                <span className="text-muted-foreground ml-1">({team.members.length})</span>
              </div>
              
              {/* Daily Utilization */}
              {weekDays.map((day, dayIndex) => {
                const utilization = getTeamUtilization(team.id, day);
                const packages = getPackagesForDay(day);
                const isOverCapacity = utilization > 100;
                
                return (
                  <div
                    key={dayIndex}
                    className="p-2 border rounded min-h-12 relative"
                    title={`${team.name} - ${day.toDateString()}: ${utilization.toFixed(0)}% utilized`}
                  >
                    {/* Utilization Bar */}
                    <div className="h-2 bg-muted rounded-full overflow-hidden mb-1">
                      <div
                        className={`h-full transition-all ${
                          isOverCapacity
                            ? 'bg-destructive'
                            : utilization > 80
                            ? 'bg-orange-500'
                            : utilization > 60
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(100, utilization)}%` }}
                      />
                    </div>
                    
                    {/* Package Count */}
                    {packages.length > 0 && (
                      <div className="text-xs text-center text-muted-foreground">
                        {packages.length} pkg{packages.length !== 1 ? 's' : ''}
                      </div>
                    )}
                    
                    {/* Over Capacity Indicator */}
                    {isOverCapacity && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-2 bg-green-500 rounded" />
          <span>&lt;60%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-2 bg-yellow-500 rounded" />
          <span>60-80%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-2 bg-orange-500 rounded" />
          <span>80-100%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-2 bg-destructive rounded" />
          <span>&gt;100%</span>
        </div>
      </div>
    </div>
  );
}