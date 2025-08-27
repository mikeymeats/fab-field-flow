import { ProductionDashboard } from '@/components/shop/ProductionDashboard'

export default function CommandCenterProduction() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Production Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time monitoring of equipment, teams, and production performance
          </p>
        </div>
      </div>

      {/* Production Dashboard */}
      <ProductionDashboard />
    </div>
  )
}