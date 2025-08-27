import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { PersonaType } from '@/store/db';
import { useDB } from '@/store/db';

const PERSONAS: { value: PersonaType; label: string; description: string }[] = [
  { value: 'ShopManager', label: 'Shop Manager', description: 'Triage packages, assign teams, inventory management' },
  { value: 'ShopFabricator', label: 'Shop Fabricator', description: 'Execute work steps, log tool usage, complete tasks' },
  { value: 'ProjectManager', label: 'Project Manager', description: 'Approve field orders, set priorities, oversight' },
  { value: 'FieldManager', label: 'Field Manager', description: 'Site receiving, crew assignment, field coordination' },
  { value: 'Foreman', label: 'Foreman', description: 'Lead crew, create field orders, manage install progress' },
  { value: 'KittingLead', label: 'Kitting Lead', description: 'Build kits, print labels, stage for stations' },
  { value: 'ShopQAInspector', label: 'Shop QA Inspector', description: 'Quality control, torque checks, pass/fail decisions' },
  { value: 'InventoryCoordinator', label: 'Inventory Coordinator', description: 'Manage stock levels, reorders, substitutions' },
  { value: 'Executive', label: 'Executive', description: 'Portfolio dashboards, analytics, high-level oversight' },
  { value: 'ITAdmin', label: 'IT Admin', description: 'Full system access, user management, integrations' },
];

interface PersonaAuthProps {
  onLogin: (persona: PersonaType) => void;
}

export function PersonaAuth({ onLogin }: PersonaAuthProps) {
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>('ShopManager');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">MSUITE Fab & Field</CardTitle>
          <CardDescription className="text-center">
            Select your role to continue with personalized workflows
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Role</label>
            <Select value={selectedPersona} onValueChange={(value) => setSelectedPersona(value as PersonaType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PERSONAS.map((persona) => (
                  <SelectItem key={persona.value} value={persona.value}>
                    <div>
                      <div className="font-medium">{persona.label}</div>
                      <div className="text-xs text-muted-foreground">{persona.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={() => onLogin(selectedPersona)} 
            className="w-full"
          >
            Continue as {PERSONAS.find(p => p.value === selectedPersona)?.label}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}