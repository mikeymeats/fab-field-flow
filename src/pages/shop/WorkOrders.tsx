import { useState } from "react";
import { useDB, type WorkOrder } from "@/store/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Calendar, Users, Settings, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const priorityColors = {
  High: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Med: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
};

const stateColors = {
  Planned: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  InProgress: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  Completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  OnHold: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
};

export default function WorkOrders() {
  const { workOrders, packages, createWorkOrder, updateWorkOrder, deleteWorkOrder } = useDB();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [newWorkOrder, setNewWorkOrder] = useState({
    team: "",
    station: "",
    due: "",
    priority: "Med" as "High" | "Med" | "Low",
    notes: ""
  });

  const filteredWorkOrders = workOrders.filter(wo => {
    const pkg = packages.find(p => p.id === wo.packageId);
    return wo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
           pkg?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           wo.team?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const availablePackages = packages.filter(pkg => 
    !workOrders.some(wo => wo.packageId === pkg.id)
  );

  const handleCreateWorkOrder = () => {
    if (selectedPackage) {
      createWorkOrder(selectedPackage, newWorkOrder);
      setIsCreateOpen(false);
      setSelectedPackage("");
      setNewWorkOrder({
        team: "",
        station: "",
        due: "",
        priority: "Med",
        notes: ""
      });
    }
  };

  const handleUpdateState = (workOrderId: string, newState: string) => {
    updateWorkOrder(workOrderId, { state: newState as WorkOrder['state'] });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  const getPackageName = (packageId: string) => {
    return packages.find(p => p.id === packageId)?.name || "Unknown Package";
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Work Orders</h1>
          <p className="text-muted-foreground">Manage and track fabrication work orders</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Create Work Order
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Work Order</DialogTitle>
              <DialogDescription>
                Create a work order from an available package
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="package">Package</Label>
                <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a package" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePackages.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        {pkg.name} ({pkg.hangerIds.length} hangers)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="team">Team</Label>
                  <Input
                    id="team"
                    value={newWorkOrder.team}
                    onChange={(e) => setNewWorkOrder({...newWorkOrder, team: e.target.value})}
                    placeholder="e.g., Team A"
                  />
                </div>
                <div>
                  <Label htmlFor="station">Station</Label>
                  <Input
                    id="station"
                    value={newWorkOrder.station}
                    onChange={(e) => setNewWorkOrder({...newWorkOrder, station: e.target.value})}
                    placeholder="e.g., Station 1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="due">Due Date</Label>
                  <Input
                    id="due"
                    type="date"
                    value={newWorkOrder.due}
                    onChange={(e) => setNewWorkOrder({...newWorkOrder, due: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={newWorkOrder.priority} 
                    onValueChange={(value: "High" | "Med" | "Low") => setNewWorkOrder({...newWorkOrder, priority: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Med">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newWorkOrder.notes}
                  onChange={(e) => setNewWorkOrder({...newWorkOrder, notes: e.target.value})}
                  placeholder="Additional instructions or notes..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateWorkOrder} disabled={!selectedPackage}>
                  Create Work Order
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search work orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Work Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Work Order ID</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Station</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkOrders.map((wo) => (
                <TableRow key={wo.id}>
                  <TableCell className="font-medium">{wo.id}</TableCell>
                  <TableCell>{getPackageName(wo.packageId)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      {wo.team || "Unassigned"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                      {wo.station || "Unassigned"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={priorityColors[wo.priority || "Med"]}>
                      {wo.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {formatDate(wo.due)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={wo.state}
                      onValueChange={(value) => handleUpdateState(wo.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Planned">Planned</SelectItem>
                        <SelectItem value="InProgress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="OnHold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteWorkOrder(wo.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredWorkOrders.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No work orders found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search terms" : "Create work orders from packages to get started"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}