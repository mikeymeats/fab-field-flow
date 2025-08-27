import { useMemo, useState } from 'react'
import { useDB } from '@/store/db'
import { Filter, Search, Download, CheckCircle2, AlertTriangle } from 'lucide-react'
import { PackageReviewPanel } from '@/components/shop/PackageReviewPanel'
import { InventoryCheckPanel } from '@/components/shop/InventoryCheckPanel'
import { CrewAssignmentPanel } from '@/components/shop/CrewAssignmentPanel'
import { ExceptionManagementCenter } from '@/components/shop/ExceptionManagementCenter'
import { ProductionDashboard } from '@/components/shop/ProductionDashboard'

type ViewMode = 'review' | 'inventory' | 'assignment' | 'exceptions' | 'production'

export default function CommandCenter() {
  const {
    scopedPackages,
    scopedHangers,
    teams,
    checkInventoryForPackage,
    reserveInventoryForPackage,
    createAssignmentsFromPackage,
    assignToTeam,
    advancePackage,
    updatePackage,
    log
  } = useDB()

  // State
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState<ViewMode>('review')

  // Data
  const packages = scopedPackages()
  const hangers = scopedHangers()
  
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

  const handleReserveInventory = (pkg: any) => {
    reserveInventoryForPackage(pkg.id)
    advancePackage(pkg.id, 'Kitted')
  }

  const handleExportShortage = (pkg: any) => {
    const shortages = inventoryLines.filter(line => line.shortfall > 0)
    const csv = [
      'SKU,Description,UOM,Required,OnHand,Shortage,ReorderTo',
      ...shortages.map(item => 
        `${item.sku},${item.desc},${item.uom},${item.required},${item.onHand},${item.shortfall},${item.shortfall * 2}`
      )
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Shortage-Report-${pkg.id}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleAssignToCrew = (pkg: any, teamId: string) => {
    const assignmentIds = createAssignmentsFromPackage(pkg.id, teamId)
    assignToTeam(assignmentIds, teamId)
    advancePackage(pkg.id, 'InFabrication')
    
    const team = teams.find(t => t.id === teamId)
    log({
      user: 'shop-manager',
      action: `AssignPackageToCrew:${pkg.id}:${teamId}`,
      before: { state: pkg.state },
      after: { state: 'InFabrication', teamId, teamName: team?.name }
    })
  }

  // Status counts
  const statusCounts = useMemo(() => {
    const counts = {
      submitted: workflowPackages.filter(p => p.state === 'Submitted').length,
      planned: workflowPackages.filter(p => p.state === 'Planned').length,
      approved: workflowPackages.filter(p => p.state === 'ApprovedForFab').length,
      kitted: workflowPackages.filter(p => p.state === 'Kitted').length
    }
    return counts
  }, [workflowPackages])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Shop Command Center</h1>
          <p className="text-muted-foreground">
            Review packages, check inventory, and assign work to crews
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm">
            <span className="text-muted-foreground">View:</span>
            <button
              onClick={() => setViewMode('review')}
              className={`px-3 py-1 rounded text-xs ${
                viewMode === 'review' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Review
            </button>
            <button
              onClick={() => setViewMode('inventory')}
              className={`px-3 py-1 rounded text-xs ${
                viewMode === 'inventory'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Inventory
            </button>
            <button
              onClick={() => setViewMode('assignment')}
              className={`px-3 py-1 rounded text-xs ${
                viewMode === 'assignment'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Assignment
            </button>
            <button
              onClick={() => setViewMode('exceptions')}
              className={`px-3 py-1 rounded text-xs ${
                viewMode === 'exceptions'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Exceptions
            </button>
            <button
              onClick={() => setViewMode('production')}
              className={`px-3 py-1 rounded text-xs ${
                viewMode === 'production'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Production
            </button>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-amber-400">{statusCounts.submitted}</div>
              <div className="text-sm text-muted-foreground">Awaiting Review</div>
            </div>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-400">{statusCounts.planned}</div>
              <div className="text-sm text-muted-foreground">Planned</div>
            </div>
            <Filter className="w-5 h-5 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-emerald-400">{statusCounts.approved}</div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-400">{statusCounts.kitted}</div>
              <div className="text-sm text-muted-foreground">Kitted</div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${
        viewMode === 'exceptions' || viewMode === 'production' 
          ? '' 
          : 'grid lg:grid-cols-12 gap-6'
      }`}>
        {/* Package Queue - Left (only for package-focused views) */}
        {viewMode !== 'exceptions' && viewMode !== 'production' && (
          <div className="lg:col-span-4">
            <div className="border border-border rounded-xl bg-card">
              {/* Queue Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Package Queue</h2>
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
                      className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg"
                    />
                  </div>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg"
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
                        isSelected ? 'bg-accent/50' : 'hover:bg-muted/50'
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
                          <span className="text-amber-400 flex items-center gap-1">
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
        )}

        {/* Main Panel - Center/Right */}
        <div className={`${
          viewMode === 'exceptions' || viewMode === 'production' 
            ? '' 
            : 'lg:col-span-8'
        }`}>
          {viewMode === 'review' && (
            <PackageReviewPanel
              pkg={selectedPackage}
              hangers={hangers}
              inventoryLines={inventoryLines}
              onApprove={handleApprovePackage}
              onReject={handleRejectPackage}
            />
          )}
          
          {viewMode === 'inventory' && (
            <InventoryCheckPanel
              pkg={selectedPackage}
              inventoryLines={inventoryLines}
              onReserveInventory={handleReserveInventory}
              onExportShortage={handleExportShortage}
            />
          )}
          
          {viewMode === 'assignment' && (
            <CrewAssignmentPanel
              pkg={selectedPackage}
              teams={teams}
              onAssignToCrew={handleAssignToCrew}
            />
          )}

          {viewMode === 'exceptions' && (
            <ExceptionManagementCenter />
          )}

          {viewMode === 'production' && (
            <ProductionDashboard />
          )}
        </div>
      </div>
    </div>
  )
}