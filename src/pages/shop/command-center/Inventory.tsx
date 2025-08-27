import { useMemo, useState } from 'react'
import { useDB } from '@/store/db'
import { Filter, Search, AlertTriangle } from 'lucide-react'
import { InventoryCheckPanel } from '@/components/shop/InventoryCheckPanel'

export default function CommandCenterInventory() {
  const {
    scopedPackages,
    checkInventoryForPackage,
    reserveInventoryForPackage,
    advancePackage,
    log
  } = useDB()

  // State
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Data
  const packages = scopedPackages()
  
  // Filter packages for inventory checking workflow
  const workflowPackages = useMemo(() => {
    return packages.filter(pkg => {
      // Show packages ready for inventory check
      const workflowStates = ['ApprovedForFab', 'Kitted']
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

    // Sort by priority: ApprovedForFab first (needs inventory check)
    filtered.sort((a, b) => {
      if (a.state === 'ApprovedForFab' && b.state !== 'ApprovedForFab') return -1
      if (b.state === 'ApprovedForFab' && a.state !== 'ApprovedForFab') return 1
      
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
  const handleReserveInventory = (pkg: any) => {
    reserveInventoryForPackage(pkg.id)
    advancePackage(pkg.id, 'Kitted')
    log({
      user: 'shop-manager',
      action: `ReserveInventory:${pkg.id}`,
      before: { state: pkg.state },
      after: { state: 'Kitted' }
    })
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventory Check</h1>
          <p className="text-muted-foreground">
            Verify material availability and resolve shortages
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
                  <option value="ApprovedForFab">Approved for Fab</option>
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
                  <div className="text-sm">No packages ready for inventory check</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Panel - Right */}
        <div className="lg:col-span-8">
          <InventoryCheckPanel
            pkg={selectedPackage}
            inventoryLines={inventoryLines}
            onReserveInventory={handleReserveInventory}
            onExportShortage={handleExportShortage}
          />
        </div>
      </div>
    </div>
  )
}