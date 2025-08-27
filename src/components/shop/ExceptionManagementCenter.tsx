import { useState, useMemo } from 'react'
import { useDB } from '@/store/db'
import { 
  AlertTriangle, 
  AlertCircle, 
  Clock, 
  Wrench, 
  Package, 
  CheckCircle2, 
  XCircle, 
  User,
  Calendar,
  Filter,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

export function ExceptionManagementCenter() {
  const { 
    exceptions, 
    teams, 
    inventory,
    assignments,
    createException, 
    resolveException, 
    updateException,
    log 
  } = useDB()

  const [selectedSeverity, setSelectedSeverity] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('Open')
  const [searchQuery, setSearchQuery] = useState('')
  const [resolutionNotes, setResolutionNotes] = useState<{[key: string]: string}>({})

  // Filter exceptions
  const filteredExceptions = useMemo(() => {
    let filtered = exceptions.filter(exc => {
      if (selectedStatus !== 'all' && exc.state !== selectedStatus) return false
      if (selectedSeverity !== 'all' && exc.severity !== selectedSeverity) return false
      if (selectedType !== 'all' && exc.type !== selectedType) return false
      if (searchQuery && !exc.description.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !exc.ref.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })

    // Sort by severity and creation time
    return filtered.sort((a, b) => {
      const severityOrder = { Critical: 4, High: 3, Med: 2, Low: 1 }
      const severityDiff = severityOrder[b.severity] - severityOrder[a.severity]
      if (severityDiff !== 0) return severityDiff
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [exceptions, selectedSeverity, selectedType, selectedStatus, searchQuery])

  // Exception statistics
  const stats = useMemo(() => {
    const open = exceptions.filter(e => e.state === 'Open')
    return {
      critical: open.filter(e => e.severity === 'Critical').length,
      high: open.filter(e => e.severity === 'High').length,
      medium: open.filter(e => e.severity === 'Med').length,
      total: open.length,
      resolved24h: exceptions.filter(e => 
        e.state === 'Resolved' && 
        e.resolvedAt && 
        Date.now() - new Date(e.resolvedAt).getTime() < 24 * 60 * 60 * 1000
      ).length
    }
  }, [exceptions])

  const handleResolveException = (exceptionId: string) => {
    const notes = resolutionNotes[exceptionId] || ''
    if (notes.trim()) {
      updateException(exceptionId, { 
        resolutionNotes: notes,
        resolvedBy: 'shop-manager',
        state: 'Resolved',
        resolvedAt: new Date().toISOString()
      })
      setResolutionNotes(prev => ({ ...prev, [exceptionId]: '' }))
      log({
        user: 'shop-manager',
        action: `ResolveException:${exceptionId}`,
        before: { state: 'Open' },
        after: { state: 'Resolved', notes }
      })
    }
  }

  const handleAssignException = (exceptionId: string, assignedTo: string) => {
    updateException(exceptionId, { assignedTo, state: 'InProgress' })
    log({
      user: 'shop-manager', 
      action: `AssignException:${exceptionId}:${assignedTo}`,
      before: { assignedTo: null },
      after: { assignedTo }
    })
  }

  const getExceptionIcon = (type: string) => {
    switch(type) {
      case 'QAFail': return <XCircle className="w-5 h-5 text-red-400" />
      case 'InventoryShort': return <Package className="w-5 h-5 text-amber-400" />
      case 'ShippingMisscan': return <AlertTriangle className="w-5 h-5 text-orange-400" />
      case 'ModelChange': return <AlertCircle className="w-5 h-5 text-blue-400" />
      case 'EquipmentDown': return <Wrench className="w-5 h-5 text-purple-400" />
      default: return <AlertTriangle className="w-5 h-5 text-gray-400" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'Critical': return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'High': return 'bg-orange-500/20 text-orange-300 border-orange-500/30'
      case 'Med': return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
      case 'Low': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-400">{stats.critical}</div>
                <div className="text-sm text-muted-foreground">Critical</div>
              </div>
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-500/30 bg-orange-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-400">{stats.high}</div>
                <div className="text-sm text-muted-foreground">High Priority</div>
              </div>
              <AlertCircle className="w-5 h-5 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-amber-400">{stats.medium}</div>
                <div className="text-sm text-muted-foreground">Medium</div>
              </div>
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Open</div>
              </div>
              <AlertTriangle className="w-5 h-5 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-emerald-400">{stats.resolved24h}</div>
                <div className="text-sm text-muted-foreground">Resolved (24h)</div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Exception Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search exceptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="InProgress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger>
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Med">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="QAFail">Quality Failure</SelectItem>
                <SelectItem value="InventoryShort">Inventory Shortage</SelectItem>
                <SelectItem value="ShippingMisscan">Shipping Issue</SelectItem>
                <SelectItem value="ModelChange">Model Change</SelectItem>
                <SelectItem value="EquipmentDown">Equipment Down</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('')
                setSelectedStatus('Open')
                setSelectedSeverity('all')
                setSelectedType('all')
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exceptions List */}
      <div className="space-y-4">
        {filteredExceptions.map(exception => (
          <Card key={exception.id} className={`border ${
            exception.severity === 'Critical' ? 'border-red-500/50' :
            exception.severity === 'High' ? 'border-orange-500/50' :
            exception.severity === 'Med' ? 'border-amber-500/50' :
            'border-border'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  {getExceptionIcon(exception.type)}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{exception.type.replace(/([A-Z])/g, ' $1').trim()}</h3>
                      <Badge className={getSeverityColor(exception.severity)}>
                        {exception.severity}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {exception.ref}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {exception.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(exception.createdAt).toLocaleDateString()}
                      </span>
                      {exception.assignedTo && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {exception.assignedTo}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <Badge variant={
                  exception.state === 'Open' ? 'destructive' :
                  exception.state === 'InProgress' ? 'default' :
                  'secondary'
                }>
                  {exception.state}
                </Badge>
              </div>

              {exception.state === 'Open' || exception.state === 'InProgress' ? (
                <div className="space-y-3 border-t pt-3">
                  <div className="flex gap-2">
                    <Select onValueChange={(value) => handleAssignException(exception.id, value)}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Assign to team member" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.flatMap(team => 
                          team.members.map(member => (
                            <SelectItem key={member.id} value={member.name}>
                              {member.name} ({team.name})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Resolution notes..."
                      value={resolutionNotes[exception.id] || ''}
                      onChange={(e) => setResolutionNotes(prev => ({
                        ...prev,
                        [exception.id]: e.target.value
                      }))}
                      className="flex-1"
                      rows={2}
                    />
                    <Button
                      onClick={() => handleResolveException(exception.id)}
                      disabled={!(resolutionNotes[exception.id] || '').trim()}
                      className="self-end"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Resolve
                    </Button>
                  </div>
                </div>
              ) : exception.resolutionNotes && (
                <div className="border-t pt-3 mt-3">
                  <p className="text-sm"><strong>Resolution:</strong> {exception.resolutionNotes}</p>
                  {exception.resolvedAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Resolved on {new Date(exception.resolvedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredExceptions.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No exceptions match your current filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}