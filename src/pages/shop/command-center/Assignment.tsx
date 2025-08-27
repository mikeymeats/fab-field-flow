import { useState, useMemo } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Search, Filter, X, Package, Building2, ChevronDown, AlertTriangle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CrewDashboard } from '@/components/shop/CrewDashboard'
import { PackageQueueCard } from '@/components/shop/PackageQueueCard'
import { useDB } from '@/store/db'
import type { Project } from '@/store/db'

export default function CommandCenterAssignment() {
  const {
    shopPackages,
    projects,
    teams,
    assignments,
    hangers,
    checkInventoryForPackage,
    createAssignmentsFromPackage,
    assignToTeam,
    advancePackage,
    log
  } = useDB()
  
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [projectFilters, setProjectFilters] = useState<string[]>([])

  // Data - Use shopPackages for holistic shop view
  const packages = shopPackages(projectFilters.length > 0 ? projectFilters : undefined)
  
  // Filter packages for crew assignment workflow
  const workflowPackages = useMemo(() => {
    return packages.filter(pkg => {
      // Show packages ready for crew assignment
      const workflowStates = ['Kitted', 'InFabrication']
      return workflowStates.includes(pkg.state)
    })
  }, [packages])

  // Apply filters
  const filteredPackages = useMemo(() => {
    let filtered = workflowPackages

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(pkg => 
        pkg.id.toLowerCase().includes(query) ||
        pkg.name.toLowerCase().includes(query) ||
        pkg.level?.toLowerCase().includes(query) ||
        pkg.zone?.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(pkg => pkg.state === statusFilter)
    }

    // Sort by priority: Kitted first (needs assignment)
    filtered.sort((a, b) => {
      if (a.state === 'Kitted' && b.state !== 'Kitted') return -1
      if (b.state === 'Kitted' && a.state !== 'Kitted') return 1
      
      const aLevel = parseInt(a.level?.replace(/\D/g, '') || '0')
      const bLevel = parseInt(b.level?.replace(/\D/g, '') || '0')
      if (aLevel !== bLevel) return aLevel - bLevel
      
      return (a.zone || '').localeCompare(b.zone || '')
    })

    return filtered
  }, [workflowPackages, searchQuery, statusFilter])

  // Selected package data
  const selectedPackage = selectedPackageId 
    ? packages.find(p => p.id === selectedPackageId) || null
    : null

  // Handlers
  const handleAssignPackage = (packageId: string, teamId: string) => {
    const pkg = packages.find(p => p.id === packageId)
    if (!pkg) return

    // Create assignments from package
    const assignmentIds = createAssignmentsFromPackage(packageId, teamId)
    
    // Assign to team
    assignToTeam(assignmentIds, teamId)
    
    // Advance package state
    advancePackage(packageId, 'InFabrication')
    
    // Log the action
    const team = teams.find(t => t.id === teamId)
    log({
      user: 'shop-manager',
      action: `AssignPackageToCrew:${packageId}:${teamId}`,
      before: { state: pkg.state },
      after: { state: 'InFabrication', teamId, teamName: team?.name }
    })
    
    // Clear selection if this package was selected
    if (selectedPackageId === packageId) {
      setSelectedPackageId(null)
    }
  }

  const handleProjectToggle = (projectId: string, checked: boolean | 'indeterminate') => {
    if (checked) {
      setProjectFilters(prev => [...prev, projectId])
    } else {
      setProjectFilters(prev => prev.filter(id => id !== projectId))
    }
  }

  const removeProject = (projectId: string) => {
    setProjectFilters(prev => prev.filter(id => id !== projectId))
  }

  const clearAllProjects = () => {
    setProjectFilters([])
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Crew Assignment</h1>
            <p className="text-muted-foreground">
              Assign approved packages to fabrication crews using drag & drop
            </p>
          </div>
          
          {/* Project Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Projects
                {projectFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {projectFilters.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="text-sm font-medium">Filter by Projects</div>
                <div className="space-y-2 max-h-60 overflow-auto">
                  {projects.map(project => (
                    <div key={project.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={project.id}
                        checked={projectFilters.includes(project.id)}
                        onCheckedChange={(checked) => handleProjectToggle(project.id, checked)}
                      />
                      <label htmlFor={project.id} className="text-sm cursor-pointer">
                        {project.name}
                      </label>
                    </div>
                  ))}
                </div>
                {projectFilters.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearAllProjects}
                    className="w-full"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Selected Project Filters */}
        {projectFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {projectFilters.map(projectId => {
              const project = projects.find(p => p.id === projectId)
              if (!project) return null
              return (
                <Badge key={projectId} variant="secondary" className="gap-1">
                  {project.name}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeProject(projectId)}
                  />
                </Badge>
              )
            })}
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Package Queue */}
          <div className="xl:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Package Queue
                </CardTitle>
                <div className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search packages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  
                  {/* Status Filter */}
                  <div className="flex flex-col gap-2">
                    <Button
                      variant={statusFilter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter('all')}
                      className="justify-start"
                    >
                      All ({filteredPackages.length})
                    </Button>
                    <Button
                      variant={statusFilter === 'Kitted' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter('Kitted')}
                      className="justify-start"
                    >
                      Ready ({filteredPackages.filter(p => p.state === 'Kitted').length})
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-3">
                    {filteredPackages.map(pkg => {
                      const hasShortage = checkInventoryForPackage(pkg.id).some(line => line.shortfall > 0)
                      const estimatedHours = pkg.hangerIds.reduce((total, hangerId) => {
                        const hanger = hangers.find(h => h.id === hangerId)
                        return total + (hanger?.estHours || 2)
                      }, 0)
                      
                      return (
                        <PackageQueueCard
                          key={pkg.id}
                          pkg={pkg}
                          estimatedHours={estimatedHours}
                          hasShortage={hasShortage}
                          onClick={() => setSelectedPackageId(pkg.id)}
                        />
                      )
                    })}
                    
                    {filteredPackages.length === 0 && (
                      <div className="text-center text-muted-foreground py-8">
                        <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <div className="text-sm">No packages match the current filters</div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Crew Dashboard */}
          <div className="xl:col-span-3">
            <CrewDashboard
              teams={teams}
              assignments={assignments}
              hangers={hangers}
              onAssignPackage={handleAssignPackage}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  )
}