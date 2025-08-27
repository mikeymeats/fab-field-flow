import { useMemo, useState } from 'react'
import { useDB } from '@/store/db'
import { Filter, Search, AlertTriangle, ChevronDown, X, Building2 } from 'lucide-react'
import { PackageReviewPanel } from '@/components/shop/PackageReviewPanel'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'

export default function CommandCenterReview() {
  const {
    shopPackages,
    shopHangers,
    projects,
    checkInventoryForPackage,
    advancePackage,
    updatePackage,
    log
  } = useDB()

  // State
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [projectFilter, setProjectFilter] = useState<string[]>([])

  // Data - Use shopPackages for holistic shop view
  const packages = shopPackages(projectFilter.length > 0 ? projectFilter : undefined)
  const hangers = shopHangers(projectFilter.length > 0 ? projectFilter : undefined)
  
  // Filter packages for shop manager workflow
  const workflowPackages = useMemo(() => {
    return packages.filter(pkg => {
      // Only show packages in the shop manager workflow states
      const workflowStates = ['Submitted', 'Planned', 'ApprovedForFab', 'Kitted']
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

    // Sort by priority: Submitted first, then by level/zone
    filtered.sort((a, b) => {
      // Submitted packages first
      if (a.state === 'Submitted' && b.state !== 'Submitted') return -1
      if (b.state === 'Submitted' && a.state !== 'Submitted') return 1
      
      // Then by level and zone
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

  const inventoryLines = selectedPackage 
    ? checkInventoryForPackage(selectedPackage.id)
    : []

  // Handlers
  const handleApprovePackage = (pkg: any) => {
    advancePackage(pkg.id, 'ApprovedForFab')
    log({
      user: 'shop-manager',
      action: `ApprovePackage:${pkg.id}`,
      before: { state: pkg.state },
      after: { state: 'ApprovedForFab' }
    })
  }

  const handleRejectPackage = (pkg: any, reason: string) => {
    updatePackage(pkg.id, { 
      state: 'Rejected',
      rejectionReason: reason 
    } as any)
    log({
      user: 'shop-manager', 
      action: `RejectPackage:${pkg.id}`,
      before: { state: pkg.state },
      after: { state: 'Rejected', reason }
    })
  }

  const handleProjectToggle = (projectId: string) => {
    if (projectId === '') {
      // "All Projects" selected - clear filter
      setProjectFilter([])
    } else {
      setProjectFilter(prev => 
        prev.includes(projectId) 
          ? prev.filter(id => id !== projectId)
          : [...prev, projectId]
      )
    }
  }

  const removeProject = (projectId: string) => {
    setProjectFilter(prev => prev.filter(id => id !== projectId))
  }

  const clearAllProjects = () => {
    setProjectFilter([])
  }

  return (
    <div className="space-y-6 p-6 bg-background min-h-screen text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Package Review</h1>
          <p className="text-muted-foreground">
            Review and approve packages for fabrication across all projects
          </p>
        </div>
        
        {/* Modern Project Filter */}
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="min-w-48 justify-between bg-card border-border text-card-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  {projectFilter.length === 0 
                    ? "All Projects" 
                    : `${projectFilter.length} Project${projectFilter.length !== 1 ? 's' : ''}`
                  }
                </div>
                <ChevronDown className="w-4 h-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0 bg-popover border-border" align="end">
              <div className="p-3 border-b border-border">
                <h4 className="font-medium text-sm text-popover-foreground">Filter by Projects</h4>
              </div>
              <div className="p-2">
                <div
                  onClick={() => handleProjectToggle('')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                    projectFilter.length === 0 
                      ? 'bg-accent text-accent-foreground' 
                      : 'hover:bg-accent/50 text-popover-foreground'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span className="font-medium">All Projects</span>
                </div>
                <div className="h-px bg-border my-2" />
                {projects.map(project => (
                  <div
                    key={project.id}
                    onClick={() => handleProjectToggle(project.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                      projectFilter.includes(project.id)
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-accent/50 text-popover-foreground'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded border ${
                      projectFilter.includes(project.id) 
                        ? 'bg-primary border-primary' 
                        : 'border-border'
                    }`} />
                    <span className="text-sm">{project.name}</span>
                  </div>
                ))}
              </div>
              {projectFilter.length > 0 && (
                <div className="p-2 border-t border-border">
                  <Button 
                    onClick={clearAllProjects}
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear Selection
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
          
          {/* Selected Project Badges */}
          {projectFilter.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {projectFilter.map(projectId => {
                const project = projects.find(p => p.id === projectId)
                return project ? (
                  <Badge 
                    key={projectId} 
                    variant="secondary" 
                    className="gap-1 bg-secondary/50 text-secondary-foreground hover:bg-secondary"
                  >
                    <span className="text-xs">{project.name}</span>
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-destructive" 
                      onClick={(e) => {
                        e.stopPropagation()
                        removeProject(projectId)
                      }}
                    />
                  </Badge>
                ) : null
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Package Queue - Left */}
        <div className="lg:col-span-4">
          <div className="border border-border rounded-xl bg-card">
            {/* Queue Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-card-foreground">Package Queue</h2>
                <div className="text-sm text-muted-foreground">
                  {filteredPackages.length} packages
                </div>
              </div>
              
              {/* Filters */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search packages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  <option value="all">All States</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Planned">Planned</option>
                  <option value="ApprovedForFab">Approved</option>
                  <option value="Kitted">Kitted</option>
                </select>
              </div>
            </div>

            {/* Package List */}
            <div className="max-h-[60vh] overflow-auto">
              {filteredPackages.map(pkg => {
                const isSelected = selectedPackageId === pkg.id
                const hasShortages = checkInventoryForPackage(pkg.id).some(line => line.shortfall > 0)
                
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`p-4 border-b border-border cursor-pointer transition-colors ${
                      isSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50 text-card-foreground'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium text-sm">{pkg.name}</div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        pkg.state === 'Submitted' ? 'bg-amber-500/20 text-amber-300' :
                        pkg.state === 'Planned' ? 'bg-blue-500/20 text-blue-300' :
                        pkg.state === 'ApprovedForFab' ? 'bg-emerald-500/20 text-emerald-300' :
                        'bg-purple-500/20 text-purple-300'
                      }`}>
                        {pkg.state}
                      </span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground mb-2">
                      {pkg.id} • Level {pkg.level} / Zone {pkg.zone}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs">
                      <span>{pkg.hangerIds.length} hangers</span>
                      {hasShortages && (
                        <span className="text-destructive flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Shortages
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
              
              {filteredPackages.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  <div className="text-sm">No packages match your filters</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Panel - Right */}
        <div className="lg:col-span-8">
          <PackageReviewPanel
            pkg={selectedPackage}
            hangers={hangers}
            inventoryLines={inventoryLines}
            onApprove={handleApprovePackage}
            onReject={handleRejectPackage}
          />
        </div>
      </div>
    </div>
  )
}