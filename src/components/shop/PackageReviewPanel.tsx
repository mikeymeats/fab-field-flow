import { useState } from 'react'
import { CheckCircle2, AlertTriangle, Package, Wrench, ClipboardList, Zap } from 'lucide-react'
import type { Package as PackageType, Hanger } from '@/store/db'

interface PackageReviewPanelProps {
  pkg: PackageType | null
  hangers: Hanger[]
  inventoryLines: any[]
  onApprove: (pkg: PackageType) => void
  onApproveAndAssign?: (pkg: PackageType) => void
  onReject: (pkg: PackageType, reason: string) => void
}

export function PackageReviewPanel({ 
  pkg, 
  hangers, 
  inventoryLines, 
  onApprove, 
  onApproveAndAssign,
  onReject 
}: PackageReviewPanelProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectDialog, setShowRejectDialog] = useState(false)

  if (!pkg) {
    return (
      <div className="border border-border rounded-xl bg-card">
        <div className="p-8 text-center text-muted-foreground">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Select a Package</h3>
          <p className="text-sm">Choose a package from the queue to review details and manage approval.</p>
        </div>
      </div>
    )
  }

  const packageHangers = hangers.filter(h => pkg.hangerIds.includes(h.id))
  const shortageCount = inventoryLines.filter(line => line.shortfall > 0).length
  const hasShortages = shortageCount > 0

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ClipboardList },
    { id: 'hangers', label: `Hangers (${packageHangers.length})`, icon: Wrench },
    { id: 'inventory', label: `Inventory ${hasShortages ? '⚠️' : '✓'}`, icon: Package }
  ]

  const handleReject = () => {
    if (!rejectReason.trim()) return
    onReject(pkg, rejectReason)
    setRejectReason('')
    setShowRejectDialog(false)
  }

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{pkg.name}</h2>
            <p className="text-sm text-muted-foreground">
              {pkg.id} • Level {pkg.level} / Zone {pkg.zone}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs rounded-full ${
              pkg.state === 'Submitted' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
              pkg.state === 'Planned' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
              'bg-muted text-muted-foreground border border-border'
            }`}>
              {pkg.state}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-muted/20">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary bg-background'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="p-4 max-h-[60vh] overflow-auto">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg border border-border">
                <div className="text-lg font-semibold">{packageHangers.length}</div>
                <div className="text-xs text-muted-foreground">Hangers</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg border border-border">
                <div className="text-lg font-semibold">{inventoryLines.length}</div>
                <div className="text-xs text-muted-foreground">SKUs Required</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg border border-border">
                <div className={`text-lg font-semibold ${hasShortages ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {hasShortages ? shortageCount : '✓'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {hasShortages ? 'Shortages' : 'Ready'}
                </div>
              </div>
            </div>

            {/* Systems Summary */}
            <div>
              <h4 className="text-sm font-medium mb-2">Systems Involved</h4>
              <div className="flex flex-wrap gap-2">
                {[...new Set(packageHangers.map(h => h.system))].map(system => (
                  <span 
                    key={system}
                    className="px-2 py-1 text-xs bg-accent/20 text-accent-foreground rounded border border-accent/40"
                  >
                    {system}
                  </span>
                ))}
              </div>
            </div>

            {/* Inventory Status */}
            <div>
              <h4 className="text-sm font-medium mb-2">Inventory Status</h4>
              {hasShortages ? (
                <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="font-medium text-amber-300">Inventory Shortages Detected</div>
                    <div className="text-sm text-amber-400/80">
                      {shortageCount} items need to be ordered before fabrication can begin
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="font-medium text-emerald-300">Inventory Available</div>
                    <div className="text-sm text-emerald-400/80">All materials are in stock and ready</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'hangers' && (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-left py-2">Hanger</th>
                  <th className="text-left py-2">Type</th>
                  <th className="text-left py-2">System</th>
                  <th className="text-left py-2">Level/Grid</th>
                  <th className="text-right py-2">Est. Hours</th>
                </tr>
              </thead>
              <tbody>
                {packageHangers.map(hanger => (
                  <tr key={hanger.id} className="border-b border-border/50">
                    <td className="py-2 font-medium">{hanger.name}</td>
                    <td className="py-2">{hanger.type}</td>
                    <td className="py-2">{hanger.system}</td>
                    <td className="py-2">{hanger.level}/{hanger.grid}</td>
                    <td className="py-2 text-right">{hanger.estHours}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-left py-2">SKU</th>
                  <th className="text-left py-2">Description</th>
                  <th className="text-right py-2">Required</th>
                  <th className="text-right py-2">On Hand</th>
                  <th className="text-right py-2">Shortage</th>
                </tr>
              </thead>
              <tbody>
                {inventoryLines.map(line => (
                  <tr key={line.sku} className="border-b border-border/50">
                    <td className="py-2 font-medium">{line.sku}</td>
                    <td className="py-2">{line.desc}</td>
                    <td className="py-2 text-right">{line.required}</td>
                    <td className="py-2 text-right">{line.onHand}</td>
                    <td className={`py-2 text-right font-medium ${
                      line.shortfall > 0 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {line.shortfall > 0 ? line.shortfall : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {pkg.state === 'Submitted' ? 'Awaiting review and approval' : 
           pkg.state === 'Planned' ? 'Ready for inventory reservation' :
           'Package processed'}
        </div>
        
        <div className="flex items-center gap-2">
          {(pkg.state === 'Submitted' || pkg.state === 'Planned') && (
            <>
              <button
                onClick={() => setShowRejectDialog(true)}
                className="px-4 py-2 text-sm border border-destructive/40 text-destructive hover:bg-destructive/10 rounded transition-colors"
              >
                Reject
              </button>
              
              {/* Auto-assign button */}
              {onApproveAndAssign && !hasShortages && (
                <button
                  onClick={() => onApproveAndAssign(pkg)}
                  className="px-4 py-2 text-sm bg-primary/80 text-primary-foreground hover:bg-primary rounded transition-colors flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Approve & Auto-assign
                </button>
              )}
              
              <button
                onClick={() => onApprove(pkg)}
                className={`px-4 py-2 text-sm rounded transition-colors ${
                  hasShortages
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {hasShortages ? 'Approve with Shortages' : 'Approve for Fabrication'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Reject Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Reject Package</h3>
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Reason for rejection:</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Please provide a reason for rejecting this package..."
                className="w-full p-3 border border-border rounded bg-background text-sm resize-none"
                rows={3}
              />
            </div>
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => {
                  setShowRejectDialog(false)
                  setRejectReason('')
                }}
                className="px-4 py-2 text-sm border border-border hover:bg-muted rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
              >
                Reject Package
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}