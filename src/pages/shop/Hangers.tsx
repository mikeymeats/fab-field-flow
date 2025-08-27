import { useDB } from "@/store/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, Filter } from "lucide-react";

export function Hangers() {
  const { hangers } = useDB();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const filteredHangers = hangers.filter(hanger => 
    hanger.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter === "" || hanger.type === filter || hanger.system === filter || hanger.status === filter)
  );

  const uniqueTypes = [...new Set(hangers.map(h => h.type))];
  const uniqueSystems = [...new Set(hangers.map(h => h.system))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hangers</h1>
          <p className="text-muted-foreground">{hangers.length} total hangers loaded</p>
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search hangers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
        >
          <option value="">All Types</option>
          {uniqueTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredHangers.map((hanger) => (
          <Card key={hanger.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold truncate">{hanger.id}</CardTitle>
                <Badge variant={hanger.status === 'ApprovedForFab' ? 'default' : 'secondary'}>
                  {hanger.status}
                </Badge>
              </div>
              <CardDescription className="text-sm">
                {hanger.type} • {hanger.system} • Level {hanger.level}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Zone:</span>
                  <div className="font-medium">{hanger.zone}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Grid:</span>
                  <div className="font-medium">{hanger.grid}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Service:</span>
                  <div className="font-medium">{hanger.service}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Elevation:</span>
                  <div className="font-medium">{hanger.elevationFt}'</div>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <div className="text-xs text-muted-foreground mb-1">Upper Attachment</div>
                <div className="text-sm font-medium">
                  {hanger.upperAttachment.model} ({hanger.upperAttachment.type})
                </div>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Est: {hanger.estHours}h</span>
                <span className="text-muted-foreground">Act: {hanger.actHours}h</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHangers.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No hangers found matching your criteria.
        </div>
      )}
    </div>
  );
}