import { useMemo, useState } from 'react'
import { useDB } from '@/store/db'
import { Filter, Search, AlertTriangle } from 'lucide-react'
import { CrewAssignmentPanel } from '@/components/shop/CrewAssignmentPanel'

export default function CommandCenterAssignment() {
  const {
    scopedPackages,
    teams,
    checkInventoryForPackage,
    createAssignmentsFromPackage,
    assignToTeam,
    advancePackage,
    log
  } = useDB()

  // State
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Data
  const packages = scopedPackages()
  
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

  // Handler
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Crew Assignment</h1>
          <p className="text-muted-foreground">
            Assign kitted packages to fabrication crews
          </p>
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
                  <option value="Kitted">Ready to Assign</option>
                  <option value="InFabrication">In Fabrication</option>
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
                        pkg.state === 'Kitted' ? 'bg-purple-500/20 text-purple-300' :
                        'bg-blue-500/20 text-blue-300'
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
                  <div className="text-sm">No packages ready for crew assignment</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Panel - Right */}
        <div className="lg:col-span-8">
          <CrewAssignmentPanel
            pkg={selectedPackage}
            teams={teams}
            onAssignToCrew={handleAssignToCrew}
          />
        </div>
      </div>
    </div>
  )
}