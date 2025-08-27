import { ProductionDashboard } from '@/components/shop/ProductionDashboard'

export default function CommandCenterProduction() {
  return (
    <div className="space-y-6 p-6 bg-neutral-900 min-h-screen text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Production Dashboard</h1>
          <p className="text-gray-400">
            Real-time monitoring of equipment, teams, and production performance
          </p>
        </div>
      </div>

      {/* Production Dashboard */}
      <ProductionDashboard />
    </div>
  )
}