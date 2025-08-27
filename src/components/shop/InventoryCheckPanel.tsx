import { AlertTriangle, CheckCircle2, Download, Package } from 'lucide-react'
import type { Package as PackageType } from '@/store/db'

interface InventoryCheckPanelProps {
  pkg: PackageType | null
  inventoryLines: any[]
  onReserveInventory: (pkg: PackageType) => void
  onExportShortage: (pkg: PackageType) => void
}

export function InventoryCheckPanel({ 
  pkg, 
  inventoryLines, 
  onReserveInventory, 
  onExportShortage 
}: InventoryCheckPanelProps) {
  if (!pkg) {
    return (
      <div className="border border-border rounded-xl bg-card">
        <div className="p-8 text-center text-muted-foreground">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Package Selected</h3>
          <p className="text-sm">Select a package to check inventory availability.</p>
        </div>
      </div>
    )
  }

  const shortages = inventoryLines.filter(line => line.shortfall > 0)
  const hasShortages = shortages.length > 0
  const totalItems = inventoryLines.length
  const availableItems = totalItems - shortages.length

  return (
    <div className="space-y-4">
      {/* Inventory Status Card */}
      <div className="border border-border rounded-xl bg-card">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold flex items-center gap-2">
            <Package className="w-4 h-4" />
            Inventory Status
          </h3>
        </div>
        
        <div className="p-4">
          {hasShortages ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0" />
                <div>
                  <div className="font-medium text-amber-300">Inventory Shortages</div>
                  <div className="text-sm text-amber-400/80">
                    {shortages.length} of {totalItems} items have insufficient stock
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                  <div className="text-lg font-semibold text-amber-400">{shortages.length}</div>
                  <div className="text-xs text-amber-400/80">Short Items</div>
                </div>
                <div className="text-center p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                  <div className="text-lg font-semibold text-emerald-400">{availableItems}</div>
                  <div className="text-xs text-emerald-400/80">Available</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <div className="font-medium text-emerald-300">Inventory Available</div>
                  <div className="text-sm text-emerald-400/80">
                    All {totalItems} items are in stock and ready to reserve
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Shortage Details */}
      {hasShortages && (
        <div className="border border-border rounded-xl bg-card">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-amber-300">Items with Shortages</h3>
          </div>
          
          <div className="overflow-auto max-h-60">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground bg-muted/30 sticky top-0">
                <tr>
                  <th className="text-left py-2 px-4">SKU</th>
                  <th className="text-left py-2 px-4">Description</th>
                  <th className="text-right py-2 px-4">Required</th>
                  <th className="text-right py-2 px-4">Available</th>
                  <th className="text-right py-2 px-4">Short</th>
                </tr>
              </thead>
              <tbody>
                {shortages.map(line => (
                  <tr key={line.sku} className="border-b border-border/50">
                    <td className="py-2 px-4 font-medium">{line.sku}</td>
                    <td className="py-2 px-4">{line.desc}</td>
                    <td className="py-2 px-4 text-right">{line.required}</td>
                    <td className="py-2 px-4 text-right">{line.onHand}</td>
                    <td className="py-2 px-4 text-right font-medium text-amber-400">
                      {line.shortfall}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="border border-border rounded-xl bg-card">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">Actions</h3>
        </div>
        
        <div className="p-4 space-y-3">
          {hasShortages ? (
            <>
              <button
                onClick={() => onExportShortage(pkg)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Shortage Report
              </button>
              
              <div className="p-3 bg-muted/30 border border-border rounded-lg">
                <div className="text-sm font-medium mb-1">Next Steps:</div>
                <div className="text-xs text-muted-foreground">
                  1. Export shortage report to procurement team<br/>
                  2. Wait for inventory to be restocked<br/>
                  3. Return to reserve inventory when available
                </div>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => onReserveInventory(pkg)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Reserve Inventory & Create Pick List
              </button>
              
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <div className="text-sm font-medium mb-1 text-emerald-300">Ready to Proceed:</div>
                <div className="text-xs text-emerald-400/80">
                  All materials are available and can be reserved for fabrication
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}