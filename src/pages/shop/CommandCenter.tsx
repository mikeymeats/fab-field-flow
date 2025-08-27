import { Navigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useDB } from '@/store/db'
import { Search, Plus, Filter, MoreHorizontal, Calendar, Flag, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { format } from 'date-fns'

type ColumnConfig = {
  id: string
  title: string  
  states: string[]
  color: string
}

const COLUMNS: ColumnConfig[] = [
  { id: 'submitted', title: 'Submitted/Planned', states: ['Submitted', 'Planned'], color: 'amber' },
  { id: 'approved', title: 'Approved', states: ['ApprovedForFab'], color: 'emerald' },
  { id: 'kitted', title: 'Kitted', states: ['Kitted'], color: 'purple' },
  { id: 'fabrication', title: 'In Fabrication', states: ['InFabrication', 'Assembled'], color: 'blue' },
  { id: 'qa', title: 'Shop QA', states: ['ShopQA', 'ShopQAPassed'], color: 'orange' },
  { id: 'ready', title: 'Ready to Ship', states: ['ReadyToShip', 'Staged'], color: 'green' }
]

export default function CommandCenter() {
  const {
    scopedPackages,
    teams,
    checkInventoryForPackage,
    reserveInventoryForPackage,
    createAssignmentsFromPackage,
    assignToTeam,
    advancePackage,
    bulkAdvancePackages,
    setPackagePriority,
    setPackageDue,
    updatePackage,
    log
  } = useDB()

  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPackageIds, setSelectedPackageIds] = useState<Set<string>>(new Set())
  const [draggedPackage, setDraggedPackage] = useState<string | null>(null)

  // Data
  const packages = scopedPackages()
  
  // Filter packages by search
  const filteredPackages = useMemo(() => {
    if (!searchQuery.trim()) return packages
    
    const query = searchQuery.toLowerCase()
    return packages.filter(pkg => 
      pkg.id.toLowerCase().includes(query) ||
      pkg.name.toLowerCase().includes(query) ||
      pkg.level?.toLowerCase().includes(query) ||
      pkg.zone?.toLowerCase().includes(query)
    )
  }, [packages, searchQuery])

  // Group packages by column
  const packagesByColumn = useMemo(() => {
    const groups: Record<string, any[]> = {}
    
    COLUMNS.forEach(col => {
      groups[col.id] = filteredPackages
        .filter(pkg => col.states.includes(pkg.state))
        .sort((a, b) => {
          // Sort by priority (High > Med > Low), then by due date
          const priorityOrder = { High: 3, Med: 2, Low: 1 }
          const aPriority = priorityOrder[(a as any).priority] || 1
          const bPriority = priorityOrder[(b as any).priority] || 1
          
          if (aPriority !== bPriority) return bPriority - aPriority
          
          const aDue = (a as any).due ? new Date((a as any).due).getTime() : Infinity
          const bDue = (b as any).due ? new Date((b as any).due).getTime() : Infinity
          return aDue - bDue
        })
    })
    
    return groups
  }, [filteredPackages])

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, packageId: string) => {
    setDraggedPackage(packageId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    if (!draggedPackage) return
    
    const targetColumn = COLUMNS.find(col => col.id === columnId)
    if (!targetColumn) return
    
    const newState = targetColumn.states[0] // Use first state of target column
    advancePackage(draggedPackage, newState)
    
    log({
      user: 'shop-manager',
      action: `DragPackage:${draggedPackage}:${newState}`,
      before: { column: 'previous' },
      after: { column: columnId, state: newState }
    })
    
    setDraggedPackage(null)
  }

  // Package selection
  const togglePackageSelection = (packageId: string) => {
    const newSelection = new Set(selectedPackageIds)
    if (newSelection.has(packageId)) {
      newSelection.delete(packageId)
    } else {
      newSelection.add(packageId)
    }
    setSelectedPackageIds(newSelection)
  }

  const selectAllInColumn = (columnId: string) => {
    const columnPackages = packagesByColumn[columnId] || []
    const newSelection = new Set(selectedPackageIds)
    columnPackages.forEach(pkg => newSelection.add(pkg.id))
    setSelectedPackageIds(newSelection)
  }

  // Bulk actions
  const handleBulkReserveAndPick = () => {
    Array.from(selectedPackageIds).forEach(pkgId => {
      reserveInventoryForPackage(pkgId)
      advancePackage(pkgId, 'Kitted')
    })
    setSelectedPackageIds(new Set())
  }

  const handleBulkCreateAssignments = () => {
    const firstTeamId = teams[0]?.id
    if (!firstTeamId) return
    
    Array.from(selectedPackageIds).forEach(pkgId => {
      const assignmentIds = createAssignmentsFromPackage(pkgId, firstTeamId)
      assignToTeam(assignmentIds, firstTeamId)
      advancePackage(pkgId, 'InFabrication')
    })
    setSelectedPackageIds(new Set())
  }

  const handleBulkAdvance = (targetState: string) => {
    bulkAdvancePackages(Array.from(selectedPackageIds), targetState)
    setSelectedPackageIds(new Set())
  }

  // Single package actions
  const handleSetPriority = (packageId: string, priority: 'Low' | 'Med' | 'High') => {
    setPackagePriority(packageId, priority)
  }

  const handleSetDueDate = (packageId: string, date: Date) => {
    setPackageDue(packageId, date.toISOString())
  }

  const handleRoutePackage = (packageId: string) => {
    const firstTeamId = teams[0]?.id
    if (!firstTeamId) return
    
    const assignmentIds = createAssignmentsFromPackage(packageId, firstTeamId)
    assignToTeam(assignmentIds, firstTeamId)
    advancePackage(packageId, 'InFabrication')
  }

  const handleAdvanceOne = (pkg: any) => {
    const currentColumn = COLUMNS.find(col => col.states.includes(pkg.state))
    const currentIndex = COLUMNS.findIndex(col => col.id === currentColumn?.id)
    const nextColumn = COLUMNS[currentIndex + 1]
    
    if (nextColumn) {
      advancePackage(pkg.id, nextColumn.states[0])
    }
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'High': return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'Med': return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
      case 'Low': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const getColumnColor = (color: string) => {
    const colors = {
      amber: 'border-amber-500/30 bg-amber-500/5',
      emerald: 'border-emerald-500/30 bg-emerald-500/5',
      purple: 'border-purple-500/30 bg-purple-500/5',
      blue: 'border-blue-500/30 bg-blue-500/5',
      orange: 'border-orange-500/30 bg-orange-500/5',
      green: 'border-green-500/30 bg-green-500/5'
    }
    return colors[color as keyof typeof colors] || 'border-gray-500/30 bg-gray-500/5'
  }

  return (
    <div className="space-y-6 p-6 bg-neutral-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Shop Command Center</h1>
          <p className="text-gray-400">
            Manage package workflow from submission to shipping
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-neutral-800 border-neutral-700 text-white"
            />
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            New Package
          </Button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedPackageIds.size > 0 && (
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 flex items-center justify-between">
          <span className="text-white">{selectedPackageIds.size} packages selected</span>
          <div className="flex gap-2">
            <Button onClick={handleBulkReserveAndPick} size="sm" variant="outline">
              Reserve & Create Pick
            </Button>
            <Button onClick={handleBulkCreateAssignments} size="sm" variant="outline">
              Create Assignments & Route
            </Button>
            <Select onValueChange={handleBulkAdvance}>
              <SelectTrigger className="w-48 bg-neutral-700 border-neutral-600 text-white">
                <SelectValue placeholder="Advance to..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ApprovedForFab">Approved for Fab</SelectItem>
                <SelectItem value="Kitted">Kitted</SelectItem>
                <SelectItem value="InFabrication">In Fabrication</SelectItem>
                <SelectItem value="ShopQA">Shop QA</SelectItem>
                <SelectItem value="ReadyToShip">Ready to Ship</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={() => setSelectedPackageIds(new Set())} 
              size="sm" 
              variant="ghost"
              className="text-gray-400"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-6 gap-4 min-h-[600px]">
        {COLUMNS.map(column => {
          const columnPackages = packagesByColumn[column.id] || []
          
          return (
            <div
              key={column.id}
              className={`border rounded-xl p-4 ${getColumnColor(column.color)}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">{column.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {columnPackages.length}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => selectAllInColumn(column.id)}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Select All
                  </Button>
                </div>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {columnPackages.map(pkg => {
                  const isSelected = selectedPackageIds.has(pkg.id)
                  const hasShortages = checkInventoryForPackage(pkg.id).some(line => line.shortfall > 0)
                  const priority = (pkg as any).priority || 'Med'
                  const dueDate = (pkg as any).due

                  return (
                    <Card
                      key={pkg.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, pkg.id)}
                      className={`cursor-move bg-neutral-800 border-neutral-700 hover:border-neutral-600 transition-colors ${
                        isSelected ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => togglePackageSelection(pkg.id)}
                              className="border-gray-600"
                            />
                            <div>
                              <h4 className="font-medium text-white text-sm">{pkg.name}</h4>
                              <p className="text-xs text-gray-400">{pkg.id}</p>
                            </div>
                          </div>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                <MoreHorizontal className="w-3 h-3" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48 bg-neutral-800 border-neutral-700">
                              <div className="space-y-2">
                                <Select onValueChange={(value: 'Low' | 'Med' | 'High') => handleSetPriority(pkg.id, value)}>
                                  <SelectTrigger className="bg-neutral-700 border-neutral-600 text-white">
                                    <SelectValue placeholder="Set Priority" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="High">High Priority</SelectItem>
                                    <SelectItem value="Med">Medium Priority</SelectItem>
                                    <SelectItem value="Low">Low Priority</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="outline" size="sm" className="w-full justify-start bg-neutral-700 border-neutral-600 text-white">
                                      <Calendar className="w-4 h-4 mr-2" />
                                      Set Due Date
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0 bg-neutral-800 border-neutral-700">
                                    <CalendarComponent
                                      mode="single"
                                      onSelect={(date) => date && handleSetDueDate(pkg.id, date)}
                                      className="bg-neutral-800 text-white p-3 pointer-events-auto"
                                    />
                                  </PopoverContent>
                                </Popover>
                                <Button 
                                  onClick={() => handleRoutePackage(pkg.id)}
                                  size="sm" 
                                  variant="outline"
                                  className="w-full bg-neutral-700 border-neutral-600 text-white"
                                >
                                  Route to Team
                                </Button>
                                <Button 
                                  onClick={() => handleAdvanceOne(pkg)}
                                  size="sm" 
                                  variant="outline"
                                  className="w-full bg-neutral-700 border-neutral-600 text-white"
                                >
                                  <ArrowRight className="w-4 h-4 mr-2" />
                                  Next Step
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="text-xs text-gray-400 mb-2">
                          Level {pkg.level} / Zone {pkg.zone} • {pkg.hangerIds.length} hangers
                        </div>

                        <div className="flex flex-wrap gap-1 mb-2">
                          <Badge className={getPriorityColor(priority)} variant="outline">
                            <Flag className="w-3 h-3 mr-1" />
                            {priority}
                          </Badge>
                          
                          {hasShortages && (
                            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30" variant="outline">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Shortages
                            </Badge>
                          )}

                          {dueDate && (
                            <Badge variant="outline" className="text-xs">
                              <Calendar className="w-3 h-3 mr-1" />
                              {format(new Date(dueDate), 'MM/dd')}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}