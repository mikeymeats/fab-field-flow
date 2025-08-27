import { ExceptionManagementCenter } from '@/components/shop/ExceptionManagementCenter'

export default function CommandCenterExceptions() {
  return (
    <div className="space-y-6 p-6 bg-neutral-900 min-h-screen text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Exception Management</h1>
          <p className="text-gray-400">
            Monitor and resolve production exceptions and quality issues
          </p>
        </div>
      </div>

      {/* Exception Management Center */}
      <ExceptionManagementCenter />
    </div>
  )
}