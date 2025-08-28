import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SeedProject, SeedPackage, SeedHanger } from '@/data/seed';

export type Project = SeedProject;
export type Package = SeedPackage;
export type Hanger = SeedHanger;

// === PERSONA & USER SYSTEM ===
export type PersonaType = 
  | 'BIMCoordinator' 
  | 'ProjectManager' 
  | 'ShopManager' 
  | 'InventoryCoordinator' 
  | 'KittingLead' 
  | 'ShopFabricator' 
  | 'ShopQAInspector' 
  | 'ShippingCoordinator' 
  | 'Driver'
  | 'FieldManager' 
  | 'Foreman' 
  | 'Installer'
  | 'Executive' 
  | 'ITAdmin';

export type User = {
  id: string;
  name: string;
  email: string;  
  persona: PersonaType;
  permissions: string[];
  teamId?: string;
  crewId?: string;
  shift?: 'Day' | 'Swing' | 'Night';
};

// === ENHANCED STATE MODEL ===
export type HangerState = 
  | 'Draft' 
  | 'IssuedForFab' 
  | 'ApprovedForFab' 
  | 'Kitted' 
  | 'InFabrication' 
  | 'Assembled' 
  | 'ShopQA' 
  | 'ReadyToShip' 
  | 'InTransit' 
  | 'DeliveredToSite' 
  | 'Staged' 
  | 'Installed' 
  | 'FieldQA' 
  | 'AsBuilt' 
  | 'Closed'
  | 'Rework'
  | 'Hold';

export type FieldOrder = {
  id: string;
  projectId: string;
  createdBy: string;
  approvedBy?: string;
  template?: string;
  items: { hangerId?: string; hangerType: string; qty: number; notes?: string }[];
  priority: 'Low' | 'Med' | 'High';
  state: 'Draft' | 'Submitted' | 'Approved' | 'InFab' | 'Delivered';
  createdAt: string;
  approvedAt?: string;
};

export type QAResult = {
  id: string;
  hangerId: string;
  assignmentId?: string;
  type: 'ShopQA' | 'FieldQA';
  inspector: string;
  result: 'Pass' | 'Fail' | 'Rework';
  measurements?: { key: string; value: number; unit: string; spec?: string }[];
  photos?: string[];
  notes?: string;
  signature?: string;
  createdAt: string;
};

export type Exception = {
  id: string;
  type: 'InventoryShort' | 'ShippingMisscan' | 'QAFail' | 'ModelChange' | 'EquipmentDown' | 'Other';
  ref: string; // hangerId, packageId, shipmentId, etc.
  description: string;
  severity: 'Low' | 'Med' | 'High' | 'Critical';
  assignedTo?: string;
  resolvedBy?: string;
  state: 'Open' | 'InProgress' | 'Resolved' | 'Closed';
  resolutionNotes?: string;
  createdAt: string;
  resolvedAt?: string;
};

export type PickList = {
  id: string;
  packageId: string;
  items: { sku: string; desc: string; qty: number; pickedQty?: number; location?: string }[];
  assignedTo?: string;
  state: 'Open' | 'InProgress' | 'Complete';
  createdAt: string;
  completedAt?: string;
};

export type WorkOrder = {
  id: string;
  projectId: string;
  packageId: string;
  team?: string;
  station?: string;
  due?: string;
  priority?: 'Low' | 'Med' | 'High';
  state: 'Planned' | 'InProgress' | 'Completed' | 'OnHold';
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type Shipment = {
  id: string;
  projectId: string;
  stops: {
    location: string;
    type: 'Shop' | 'Galvanizer' | 'Painter' | 'Site';
    date?: string;
  }[];
  packages: string[];
  bol?: {
    shipTo: string;
    items: {
      ref: string;
      desc: string;
      qty: number;
      weightLbs?: number;
    }[];
  };
  state: 'Planned' | 'InTransit' | 'Delivered';
  createdAt: string;
  updatedAt: string;
};

export type Crew = {
  id: string;
  name: string;
  shift: 'Day' | 'Swing' | 'Night';
  skills: string[];
  assignedZones: string[];
};

export type Audit = {
  id: string;
  at: string;
  user: string;
  action: string;
  before?: any;
  after?: any;
};

// --- New types for Shop Manager and Team workflows ---
export type InventoryItem = {
  sku: string;
  desc: string;
  uom: 'ea' | 'ft';
  onHand: number;
  min: number;
  reorderTo: number;
  locations: { name: string; qty: number }[];
};

export type Team = {
  id: string;
  name: string;
  stations: ('RodCut' | 'UnistrutCut' | 'Assembly' | 'ShopQA')[];
  members: { id: string; name: string; role?: string }[];
  dailyHours?: number; // default 8 × members.length if missing
};

export type AssignmentStep = {
  key: 'RodCut' | 'UnistrutCut' | 'Assembly' | 'ShopQA';
  label: string;
  requiredTools?: string[];   // tool IDs/types (stub)
  inputs?: { key: string; label: string; type: 'number' | 'text'; unit?: string; required?: boolean }[];
  complete?: boolean;
  data?: Record<string, any>;
  startedAt?: string;
  completedAt?: string;
};

export type ToolEvent = {
  id: string;
  assignmentId: string;
  station: 'RodCut' | 'UnistrutCut' | 'Assembly' | 'ShopQA';
  toolId: string;
  event: 'start' | 'stop' | 'torque' | 'note';
  value?: number | string;
  at: string;
};

export type Assignment = {
  id: string;
  projectId: string;
  packageId: string;
  hangerId: string;
  teamId?: string;
  assigneeId?: string;
  priority?: 'Low' | 'Med' | 'High'; 
  state: 'Queued' | 'InProgress' | 'Paused' | 'QA' | 'Done';
  steps: AssignmentStep[];
  order?: number; // NEW: sort within team lane
  eta?: string; // optional
  expedite?: boolean; // NEW: pin to top
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  toolEvents: ToolEvent[];
};

type DB = {
  // Data
  projects: Project[];
  packages: Package[];
  hangers: Hanger[];
  workOrders: WorkOrder[];
  shipments: Shipment[];
  crews: Crew[];
  audits: Audit[];
  inventory: InventoryItem[];
  teams: Team[];
  assignments: Assignment[];
  fieldOrders: FieldOrder[];
  qaResults: QAResult[];
  exceptions: Exception[];
  pickLists: PickList[];
  
  // User & Persona System
  currentUser: User | null;
  users: User[];
  
  // Scope
  activeProjectId: string | null;
  
  // Actions
  hydrate: (projects: Project[], packages: Package[], hangers: Hanger[]) => void;
  setActiveProject: (id: string) => void;
  seedFromCsv: (rows: Hanger[]) => void;
  groupPackages: () => void;
  createWorkOrder: (pkgId: string, init?: Partial<WorkOrder>) => string;
  createPickList: (pkgId: string) => string;
  advancePackage: (pkgId: string, state: string) => void;
  setHangerState: (id: string, state: string) => void;
  createShipment: (pkgIds: string[], stops: Shipment['stops']) => string;
  updateWorkOrder: (id: string, updates: Partial<WorkOrder>) => void;
  deleteWorkOrder: (id: string) => void;
  autoSchedule: () => void;
  log: (e: Omit<Audit, 'id' | 'at'>) => void;
  
  // User & Auth Actions
  loginAs: (persona: PersonaType) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  
  // Shop Manager & Team actions
  recomputeInventory: () => void;
  checkInventoryForPackage: (pkgId: string) => { sku: string; desc: string; uom: 'ea' | 'ft'; required: number; onHand: number; shortfall: number }[];
  reserveInventoryForPackage: (pkgId: string) => void;
  ensureTeamSeeds: () => void;
  createAssignmentsFromPackage: (pkgId: string, teamId?: string) => string[];
  assignToTeam: (assignmentIds: string[], teamId: string) => void;
  startAssignment: (id: string) => void;
  completeStep: (id: string, stepKey: AssignmentStep['key'], data?: any) => void;
  pushToolEvent: (e: Omit<ToolEvent, 'id' | 'at'>) => void;
  finishAssignment: (id: string) => void;
  
  // Field & QA Actions
  createFieldOrder: (items: FieldOrder['items'], priority: 'Low' | 'Med' | 'High') => string;
  approveFieldOrder: (id: string) => void;
  recordQAResult: (hangerId: string, type: 'ShopQA' | 'FieldQA', result: 'Pass' | 'Fail' | 'Rework', data: Partial<QAResult>) => string;
  createException: (type: Exception['type'], ref: string, description: string, severity: Exception['severity']) => string;
  updateException: (id: string, updates: Partial<Exception>) => void;
  resolveException: (id: string) => void;
  
  // Scheduler Actions
  setAssignmentOrder: (id: string, order: number) => void;
  bulkSetAssignmentOrder: (ids: string[], orders: number[]) => void;
  moveAssignmentToTeam: (assignmentId: string, teamId: string, order?: number) => void;
  expediteAssignment: (id: string, expedite: boolean) => void;
  
  // Command Center Actions
  updatePackage: (pkgId: string, patch: Partial<Package>) => void;
  bulkAdvancePackages: (pkgIds: string[], next: string) => void;
  setPackagePriority: (pkgId: string, priority: 'Low'|'Med'|'High') => void;
  setPackageDue: (pkgId: string, dueISO: string) => void;
  
  // Selectors
  scopedPackages: () => Package[];
  scopedHangers: () => Hanger[];
  scopedAssignments: () => Assignment[];
  
  // Shop Management Selectors (all projects by default)
  shopPackages: (projectIds?: string[]) => Package[];
  shopHangers: (projectIds?: string[]) => Hanger[];
  shopAssignments: (projectIds?: string[]) => Assignment[];
};

export const useDB = create<DB>()(
  persist(
    (set, get) => ({
      projects: [],
      packages: [],
      hangers: [],
      workOrders: [],
      shipments: [],
      audits: [],
      inventory: [],
      teams: [],
      assignments: [],
      fieldOrders: [],
      qaResults: [],
      exceptions: [],
      pickLists: [],
      currentUser: null,
      users: [],
      crews: [
        {
          id: 'CR-01',
          name: 'Crew Alpha',
          shift: 'Day',
          skills: ['Pipe', 'Rod Threading', 'Welding'],
          assignedZones: ['A', 'B']
        },
        {
          id: 'CR-02',
          name: 'Crew Bravo',
          shift: 'Day',
          skills: ['Duct', 'Seismic', 'Assembly'],
          assignedZones: ['C', 'D']
        },
        {
          id: 'CR-03',
          name: 'Crew Charlie',
          shift: 'Night',
          skills: ['Seismic', 'QA', 'Inspection'],
          assignedZones: ['D']
        }
      ],
      activeProjectId: "PRJ-001", // Default to Riverview Medical Tower for demo

      hydrate: (projects, packages, hangers) => set({ projects, packages, hangers }),
      setActiveProject: (id) => set({ activeProjectId: id }),

      seedFromCsv: (rows) => set({ hangers: rows }),

      groupPackages: () => {
        const hs = get().hangers;
        const projectId = get().activeProjectId || 'PRJ-001';
        const groups = new Map<string, string[]>();
        
        hs.forEach(h => {
          const k = `${h.level || 'L?'}-${h.zone || 'Z?'}`;
          groups.set(k, [...(groups.get(k) || []), h.id]);
        });

        const pkgs: Package[] = Array.from(groups.entries()).map(([k, ids], i) => ({
          id: `PKG-${String(i + 1).padStart(3, '0')}`,
          projectId,
          name: `Package ${k}`,
          level: k.split('-')[0],
          zone: k.split('-')[1],
          state: 'Planned',
          hangerIds: ids
        }));

        set({ packages: pkgs });
      },

      createWorkOrder: (pkgId, init = {}) => {
        const id = `WO-${String(get().workOrders.length + 1).padStart(3, '0')}`;
        const pkg = get().packages.find(p => p.id === pkgId);
        const projectId = pkg?.projectId || get().activeProjectId || 'PRJ-000';
        const now = new Date().toISOString();
        const workOrder: WorkOrder = {
          id,
          projectId,
          packageId: pkgId,
          state: 'Planned',
          priority: 'Med',
          createdAt: now,
          updatedAt: now,
          ...init
        };
        
        set({ workOrders: [...get().workOrders, workOrder] });
        get().log({ user: 'system', action: `CreateWorkOrder:${id}`, before: null, after: workOrder });
        return id;
      },

      createPickList: (pkgId) => {
        const pid = `PL-${String(Date.now()).slice(-4)}`;
        
        set({
          packages: get().packages.map(p =>
            p.id === pkgId ? { ...p, pickListId: pid, state: 'Kitted' } : p
          )
        });
        
        get().log({
          user: 'system',
          action: `CreatePickList:${pkgId}`,
          before: null,
          after: { pickListId: pid, state: 'Kitted' }
        });
        
        return pid;
      },

      advancePackage: (pkgId, state) => {
        const before = get().packages.find(p => p.id === pkgId);
        
        set({
          packages: get().packages.map(p =>
            p.id === pkgId ? { ...p, state } : p
          )
        });
        
        get().log({
          user: 'system',
          action: `AdvancePackage:${pkgId}->${state}`,
          before,
          after: { ...before, state }
        });
      },

      setHangerState: (id, state) => {
        const before = get().hangers.find(h => h.id === id);
        
        set({
          hangers: get().hangers.map(h =>
            h.id === id ? { ...h, status: state } : h
          )
        });
        
        get().log({
          user: 'system',
          action: `SetHanger:${id}->${state}`,
          before,
          after: { ...before, status: state }
        });
      },

      createShipment: (pkgIds, stops) => {
        const id = `SHP-${String(get().shipments.length + 1).padStart(3, '0')}`;
        const projectId = get().activeProjectId || 'PRJ-000';
        const now = new Date().toISOString();
        
        const items = pkgIds.flatMap(pid => {
          const p = get().packages.find(x => x.id === pid);
          return (p?.hangerIds || []).map(hid => ({
            ref: hid,
            desc: 'Hanger Assembly',
            qty: 1,
            weightLbs: 25
          }));
        });

        const shipment: Shipment = {
          id,
          projectId,
          stops,
          packages: pkgIds,
          bol: {
            shipTo: stops[stops.length - 1]?.location || 'Site',
            items
          },
          state: 'Planned',
          createdAt: now,
          updatedAt: now
        };

        set({ shipments: [...get().shipments, shipment] });
        get().log({ user: 'system', action: `CreateShipment:${id}`, before: null, after: shipment });
        return id;
      },

      updateWorkOrder: (id, updates) => {
        const before = get().workOrders.find(wo => wo.id === id);
        const now = new Date().toISOString();
        
        set({
          workOrders: get().workOrders.map(wo =>
            wo.id === id ? { ...wo, ...updates, updatedAt: now } : wo
          )
        });
        
        get().log({
          user: 'system',
          action: `UpdateWorkOrder:${id}`,
          before,
          after: { ...before, ...updates }
        });
      },

      deleteWorkOrder: (id) => {
        const before = get().workOrders.find(wo => wo.id === id);
        set({ workOrders: get().workOrders.filter(wo => wo.id !== id) });
        get().log({ user: 'system', action: `DeleteWorkOrder:${id}`, before, after: null });
      },

      autoSchedule: () => {
        const workOrders = get().workOrders;
        const teams = ['Team A', 'Team B', 'Team C'];
        const stations = ['Station 1', 'Station 2', 'Station 3', 'Station 4'];
        
        const scheduledWOs = workOrders.map((wo, index) => ({
          ...wo,
          team: teams[index % teams.length],
          station: stations[index % stations.length],
          due: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          updatedAt: new Date().toISOString()
        }));

        set({ workOrders: scheduledWOs });
        get().log({ user: 'system', action: 'AutoSchedule', before: null, after: 'Completed' });
      },

      log: (e) =>
        set({
          audits: [
            ...get().audits,
            {
              id: `AUD-${String(get().audits.length + 1).padStart(4, '0')}`,
              at: new Date().toISOString(),
              user: get().currentUser?.name || e.user,
              ...e
            }
          ]
        }),

      // === USER & AUTH ACTIONS ===
      loginAs: (persona) => {
        const user: User = {
          id: `USER-${persona}`,
          name: persona.replace(/([A-Z])/g, ' $1').trim(),
          email: `${persona.toLowerCase()}@msuite.demo`,
          persona,
          permissions: [], // Will be populated from PERSONA_PERMISSIONS
        };
        set({ currentUser: user });
        get().log({ user: user.name, action: `Login:${persona}`, before: null, after: { persona } });
      },

      logout: () => {
        const currentUser = get().currentUser;
        set({ currentUser: null });
        get().log({ user: 'system', action: 'Logout', before: currentUser, after: null });
      },

      hasPermission: (permission) => {
        const user = get().currentUser;
        if (!user) return false;
        // Import PERSONA_PERMISSIONS dynamically or hardcode basic permissions here
        const adminPermissions = ['admin:*', 'write:*'];
        if (user.persona === 'ITAdmin') return true;
        if (user.persona === 'ShopManager' && permission.startsWith('write:')) return true;
        if (user.persona === 'ProjectManager' && permission.includes('approve')) return true;
        return user.permissions.includes(permission);
      },

      scopedPackages: () => {
        const pid = get().activeProjectId;
        return pid ? get().packages.filter(p => p.projectId === pid) : get().packages;
      },
      
      scopedHangers: () => {
        const pid = get().activeProjectId;
        return pid ? get().hangers.filter(h => h.projectId === pid) : get().hangers;
      },

      // Create inventory by rolling up hanger items across the active (or all) project(s)
      recomputeInventory: () => {
        const { hangers, activeProjectId } = get();
        const scope = activeProjectId ? hangers.filter(h => h.projectId === activeProjectId) : hangers;
        const roll = new Map<string, { sku: string; desc: string; uom: 'ea' | 'ft'; required: number }>();
        scope.forEach(h => (h.items || []).forEach(it => {
          const k = it.sku;
          roll.set(k, {
            sku: k,
            desc: it.desc,
            uom: it.uom,
            required: (roll.get(k)?.required || 0) + Number(it.qty || 0)
          });
        }));
        // seed onHand = ~60% of required to drive interesting shortages
        const inv: InventoryItem[] = Array.from(roll.values()).map(r => ({
          sku: r.sku, desc: r.desc, uom: r.uom,
          onHand: Math.round(r.required * 0.6),
          min: Math.ceil(r.required * 0.2),
          reorderTo: Math.ceil(r.required * 1.0),
          locations: [{ name: 'Main', qty: Math.round(r.required * 0.6) }]
        }));
        set({ inventory: inv });
      },

      checkInventoryForPackage: (pkgId) => {
        const { packages, hangers, inventory } = get();
        const pkg = packages.find(p => p.id === pkgId);
        if (!pkg) return [];
        const hs = hangers.filter(h => pkg.hangerIds.includes(h.id));
        const need = new Map<string, { sku: string; desc: string; uom: 'ea' | 'ft'; required: number }>();
        hs.forEach(h => (h.items || []).forEach(it => {
          const k = it.sku;
          need.set(k, { sku: k, desc: it.desc, uom: it.uom, required: (need.get(k)?.required || 0) + Number(it.qty || 0) });
        }));
        return Array.from(need.values()).map(n => {
          const inv = inventory.find(i => i.sku === n.sku);
          const onHand = inv ? inv.onHand : 0;
          const shortfall = Math.max(0, Math.ceil(n.required - onHand));
          return { ...n, onHand, shortfall };
        });
      },

      reserveInventoryForPackage: (pkgId) => {
        const { inventory } = get();
        const delta = get().checkInventoryForPackage(pkgId);
        const next = inventory.map(it => {
          const need = delta.find(d => d.sku === it.sku);
          if (!need) return it;
          const take = Math.min(it.onHand, Math.ceil(need.required));
          return { ...it, onHand: it.onHand - take, locations: [{ ...it.locations[0], qty: Math.max(0, (it.locations[0]?.qty || 0) - take) }] };
        });
        set({ inventory: next });
        get().log({ user: 'manager', action: `ReserveInventory:${pkgId}`, before: null, after: delta });
      },

      ensureTeamSeeds: () => {
        const current = get().teams;
        if (current.length === 0) {
          const now = new Date().toISOString();
          set({
            teams: [
              {
                id: 'team-fab-a',
                name: 'Fabrication Team A',
                stations: ['RodCut', 'UnistrutCut', 'Assembly'],
                members: [
                  { id: 'fab-a-1', name: 'Mike Rodriguez', role: 'Lead' },
                  { id: 'fab-a-2', name: 'Sarah Chen', role: 'Assembler' },
                  { id: 'fab-a-3', name: 'David Kim', role: 'Cutter' }
                ],
                dailyHours: 24
              },
              {
                id: 'team-fab-b',
                name: 'Fabrication Team B', 
                stations: ['RodCut', 'UnistrutCut', 'Assembly'],
                members: [
                  { id: 'fab-b-1', name: 'Jessica Martinez', role: 'Lead' },
                  { id: 'fab-b-2', name: 'Tony Wilson', role: 'Assembler' },
                  { id: 'fab-b-3', name: 'Amanda Foster', role: 'Cutter' }
                ],
                dailyHours: 24
              },
              {
                id: 'team-qa',
                name: 'Quality Assurance Team',
                stations: ['ShopQA'],
                members: [
                  { id: 'qa-1', name: 'Robert Thompson', role: 'QA Lead' },
                  { id: 'qa-2', name: 'Lisa Park', role: 'Inspector' }
                ],
                dailyHours: 16
              }
            ],
            // Add comprehensive mock data
            assignments: [
              // Fabrication assignments
              {
                id: 'ASG-001',
                projectId: 'PRJ-007',
                packageId: 'PKG-602',
                hangerId: 'HNG-7004',
                teamId: 'team-fab-a',
                priority: 'High',
                state: 'InProgress',
                steps: [
                  { key: 'RodCut', label: 'Rod Cutting', complete: true, startedAt: now, completedAt: now },
                  { key: 'UnistrutCut', label: 'Unistrut Cutting', complete: true, startedAt: now, completedAt: now },
                  { key: 'Assembly', label: 'Assembly', complete: false, startedAt: now },
                  { key: 'ShopQA', label: 'Quality Check', complete: false }
                ],
                expedite: true,
                createdAt: now,
                startedAt: now,
                toolEvents: []
              },
              {
                id: 'ASG-002', 
                projectId: 'PRJ-001',
                packageId: 'PKG-018',
                hangerId: 'HNG-1055',
                teamId: 'team-fab-b',
                priority: 'Med',
                state: 'InProgress',
                steps: [
                  { key: 'RodCut', label: 'Rod Cutting', complete: true, startedAt: now, completedAt: now },
                  { key: 'UnistrutCut', label: 'Unistrut Cutting', complete: false, startedAt: now },
                  { key: 'Assembly', label: 'Assembly', complete: false },
                  { key: 'ShopQA', label: 'Quality Check', complete: false }
                ],
                createdAt: now,
                startedAt: now,
                toolEvents: []
              },
              // QA assignments
              {
                id: 'ASG-003',
                projectId: 'PRJ-007',
                packageId: 'PKG-601', 
                hangerId: 'HNG-7000',
                teamId: 'team-qa',
                priority: 'High',
                state: 'QA',
                steps: [
                  { key: 'RodCut', label: 'Rod Cutting', complete: true },
                  { key: 'UnistrutCut', label: 'Unistrut Cutting', complete: true },
                  { key: 'Assembly', label: 'Assembly', complete: true },
                  { key: 'ShopQA', label: 'Quality Check', complete: false, startedAt: now }
                ],
                createdAt: now,
                toolEvents: []
              }
            ],
            exceptions: [
              {
                id: 'EXC-001',
                type: 'InventoryShort',
                ref: 'PKG-018',
                description: 'Short 2x P1000 Unistrut Channel for L2 Imaging package',
                severity: 'High',
                assignedTo: 'inventory-coord-1',
                state: 'Open',
                createdAt: now
              },
              {
                id: 'EXC-002',
                type: 'QAFail',
                ref: 'HNG-7001',
                description: 'Weld quality issue detected on OR Suite A hanger',
                severity: 'Critical',
                assignedTo: 'qa-1',
                state: 'InProgress',
                createdAt: now
              },
              {
                id: 'EXC-003',
                type: 'EquipmentDown', 
                ref: 'team-fab-a',
                description: 'Hydraulic saw needs maintenance - Team A station 2',
                severity: 'Med',
                assignedTo: 'maintenance-lead',
                state: 'Open',
                createdAt: now
              }
            ],
            workOrders: [
              {
                id: 'WO-001',
                projectId: 'PRJ-007',
                packageId: 'PKG-602',
                team: 'team-fab-a',
                station: 'Assembly',
                priority: 'High',
                state: 'InProgress',
                notes: 'Expedited for OR Suite B - critical path',
                createdAt: now,
                updatedAt: now
              },
              {
                id: 'WO-002',
                projectId: 'PRJ-001', 
                packageId: 'PKG-018',
                team: 'team-fab-b',
                station: 'UnistrutCut',
                priority: 'Med',
                state: 'InProgress',
                notes: 'Imaging department package - standard timeline',
                createdAt: now,
                updatedAt: now
              }
            ],
            pickLists: [
              {
                id: 'PL-001',
                packageId: 'PKG-021',
                items: [
                  { sku: 'P1000', desc: 'Unistrut Channel P1000', qty: 8, pickedQty: 8, location: 'A-14-B' },
                  { sku: 'ROD-3/8', desc: 'Threaded Rod 3/8', qty: 12, pickedQty: 10, location: 'B-22-C' },
                  { sku: 'NUT-STRUT', desc: 'Strut Nut', qty: 24, pickedQty: 24, location: 'C-05-A' }
                ],
                assignedTo: 'picker-1',
                state: 'InProgress',
                createdAt: now
              }
            ]
          });
        }
      },

      // Simple step template by hanger type
      createAssignmentsFromPackage: (pkgId, teamId) => {
        const { packages, hangers, activeProjectId } = get();
        const pkg = packages.find(p => p.id === pkgId); if (!pkg) return [];
        const ids: string[] = [];
        const now = new Date().toISOString();
        const stepTemplate = (type: string): AssignmentStep[] => {
          const base = [
            { key: 'RodCut', label: 'Cut threaded rods to length', requiredTools: ['TorqueWrench?', 'RodCutter'], inputs: [{ key: 'rodCount', label: '# rods cut', type: 'number', required: true }] },
            { key: 'UnistrutCut', label: 'Cut Unistrut to length', requiredTools: ['UnistrutCutter'], inputs: [{ key: 'strutLength', label: 'Total strut length (ft)', type: 'number', required: true }] },
            { key: 'Assembly', label: 'Assemble hanger hardware', requiredTools: ['ImpactDriver'], inputs: [{ key: 'notes', label: 'Assembly notes', type: 'text' }] },
            { key: 'ShopQA', label: 'Shop QA & torque check', requiredTools: ['TorqueWrench'], inputs: [{ key: 'torque', label: 'Torque (ft·lb)', type: 'number', required: true }] }
          ] as AssignmentStep[];
          if (type === 'Clevis') return [base[0], base[2], base[3]];
          if (type === 'Seismic') return [base[0], base[1], base[2], base[3]];
          return base;
        };
        const asns = pkg.hangerIds.map((hid, i) => {
          const h = hangers.find(x => x.id === hid)!;
          return {
            id: `ASG-${pkg.id}-${i + 1}`,
            projectId: activeProjectId || h.projectId,
            packageId: pkg.id,
            hangerId: h.id,
            teamId,
            state: 'Queued' as const,
            priority: 'Med' as const,
            steps: stepTemplate(h.type).map(s => ({ ...s })),
            createdAt: now,
            toolEvents: []
          } as Assignment;
        });
        set({ assignments: [...get().assignments, ...asns] });
        get().log({ user: 'manager', action: `CreateAssignmentsFromPackage:${pkgId}`, before: null, after: { count: asns.length, teamId } });
        return asns.map(a => a.id);
      },

      assignToTeam: (assignmentIds, teamId) => {
        set({ assignments: get().assignments.map(a => assignmentIds.includes(a.id) ? { ...a, teamId } : a) });
        get().log({ user: 'manager', action: `AssignToTeam:${teamId}`, before: null, after: { assignmentIds } });
      },

      startAssignment: (id) => {
        set({ assignments: get().assignments.map(a => a.id === id ? { ...a, state: 'InProgress', startedAt: new Date().toISOString() } : a) });
        get().log({ user: 'fabricator', action: `StartAssignment:${id}`, before: null, after: { state: 'InProgress' } });
      },

      completeStep: (id, stepKey, data) => {
        const as = get().assignments.find(a => a.id === id); if (!as) return;
        const steps = as.steps.map(s => s.key === stepKey ? { ...s, complete: true, data: { ...(s.data || {}), ...(data || {}) }, completedAt: new Date().toISOString() } : s);
        const nextState = steps.every(s => s.complete) ? 'QA' : as.state;
        set({ assignments: get().assignments.map(a => a.id === id ? { ...a, steps, state: nextState } : a) });
        get().log({ user: 'fabricator', action: `CompleteStep:${id}:${stepKey}`, before: null, after: { data } });
      },

      pushToolEvent: (e) => {
        const id = `TE-${String(get().audits.length + 1).padStart(5, '0')}`;
        const ev: ToolEvent = { id, at: new Date().toISOString(), ...e };
        set({ assignments: get().assignments.map(a => a.id === e.assignmentId ? { ...a, toolEvents: [...a.toolEvents, ev] } : a) });
        get().log({ user: 'fabricator', action: `ToolEvent:${e.assignmentId}:${e.event}`, before: null, after: e });
      },

      finishAssignment: (id) => {
        const as = get().assignments.find(a => a.id === id); if (!as) return;
        const done = { ...as, state: 'Done' as const, finishedAt: new Date().toISOString() };
        set({ assignments: get().assignments.map(a => a.id === id ? done : a) });
        get().log({ user: 'fabricator', action: `FinishAssignment:${id}`, before: as, after: done });
      },

      // === FIELD & QA ACTIONS ===
      createFieldOrder: (items, priority) => {
        const id = `FO-${String(get().fieldOrders.length + 1).padStart(3, '0')}`;
        const fieldOrder: FieldOrder = {
          id,
          projectId: get().activeProjectId || 'PRJ-001',
          createdBy: get().currentUser?.id || 'USER-FOREMAN',
          items,
          priority,
          state: 'Draft',
          createdAt: new Date().toISOString(),
        };
        set({ fieldOrders: [...get().fieldOrders, fieldOrder] });
        get().log({ user: 'foreman', action: `CreateFieldOrder:${id}`, before: null, after: fieldOrder });
        return id;
      },

      approveFieldOrder: (id) => {
        const fieldOrder = get().fieldOrders.find(fo => fo.id === id);
        if (!fieldOrder) return;
        const updated = { ...fieldOrder, state: 'Approved' as const, approvedBy: get().currentUser?.id, approvedAt: new Date().toISOString() };
        set({ fieldOrders: get().fieldOrders.map(fo => fo.id === id ? updated : fo) });
        get().log({ user: 'pm', action: `ApproveFieldOrder:${id}`, before: fieldOrder, after: updated });
      },

      recordQAResult: (hangerId, type, result, data) => {
        const id = `QA-${String(get().qaResults.length + 1).padStart(4, '0')}`;
        const qaResult: QAResult = {
          id,
          hangerId,
          type,
          inspector: get().currentUser?.id || 'QA-INSPECTOR',
          result,
          createdAt: new Date().toISOString(),
          ...data,
        };
        set({ qaResults: [...get().qaResults, qaResult] });
        get().log({ user: 'qa', action: `RecordQAResult:${hangerId}:${result}`, before: null, after: qaResult });
        return id;
      },

      createException: (type, ref, description, severity) => {
        const id = `EXC-${String(get().exceptions.length + 1).padStart(4, '0')}`;
        const exception: Exception = {
          id,
          type,
          ref,
          description,
          severity,
          state: 'Open',
          createdAt: new Date().toISOString(),
        };
        set({ exceptions: [...get().exceptions, exception] });
        get().log({ user: 'system', action: `CreateException:${type}:${ref}`, before: null, after: exception });
        return id;
      },

      updateException: (id, updates) => {
        const exception = get().exceptions.find(e => e.id === id);
        if (!exception) return;
        const updated = { ...exception, ...updates };
        set({ exceptions: get().exceptions.map(e => e.id === id ? updated : e) });
        get().log({ user: 'system', action: `UpdateException:${id}`, before: exception, after: updated });
      },

      resolveException: (id) => {
        const exception = get().exceptions.find(e => e.id === id);
        if (!exception) return;
        const resolved = { ...exception, state: 'Resolved' as const, resolvedAt: new Date().toISOString() };
        set({ exceptions: get().exceptions.map(e => e.id === id ? resolved : e) });
        get().log({ user: 'system', action: `ResolveException:${id}`, before: exception, after: resolved });
      },

      // === SCHEDULER ACTIONS ===
      setAssignmentOrder: (id, order) => {
        set({ 
          assignments: get().assignments.map(a => 
            a.id === id ? { ...a, order } : a
          ) 
        });
        get().log({ user: 'scheduler', action: `SetAssignmentOrder:${id}`, before: null, after: { order } });
      },

      bulkSetAssignmentOrder: (ids, orders) => {
        set({ 
          assignments: get().assignments.map(a => {
            const index = ids.indexOf(a.id);
            return index >= 0 ? { ...a, order: orders[index] } : a;
          })
        });
        get().log({ user: 'scheduler', action: `BulkSetAssignmentOrder`, before: null, after: { ids, orders } });
      },

      moveAssignmentToTeam: (assignmentId, teamId, order) => {
        const assignment = get().assignments.find(a => a.id === assignmentId);
        if (!assignment) return;
        
        const updated = { 
          ...assignment, 
          teamId, 
          order: order ?? Date.now() // default to timestamp for end-of-lane 
        };
        
        set({ assignments: get().assignments.map(a => a.id === assignmentId ? updated : a) });
        get().log({ user: 'scheduler', action: `MoveAssignmentToTeam:${assignmentId}:${teamId}`, before: assignment, after: updated });
      },

      expediteAssignment: (id, expedite) => {
        set({ 
          assignments: get().assignments.map(a => 
            a.id === id ? { ...a, expedite } : a
          ) 
        });
        get().log({ user: 'scheduler', action: `ExpediteAssignment:${id}`, before: null, after: { expedite } });
      },
      
      // === COMMAND CENTER ACTIONS ===
      updatePackage: (pkgId, patch) => {
        set({ packages: get().packages.map(p => p.id === pkgId ? { ...p, ...patch } : p) });
        get().log({ user: 'manager', action: `UpdatePackage:${pkgId}`, before: null, after: patch });
      },
      
      bulkAdvancePackages: (pkgIds, next) => {
        pkgIds.forEach(id => get().advancePackage(id, next));
        get().log({ user: 'manager', action: `BulkAdvancePackages`, before: null, after: { pkgIds, state: next } });
      },
      
      setPackagePriority: (pkgId, priority) => {
        get().updatePackage(pkgId, { priority } as any);
        get().log({ user: 'manager', action: `SetPackagePriority:${pkgId}`, before: null, after: { priority } });
      },
      
      setPackageDue: (pkgId, dueISO) => {
        get().updatePackage(pkgId, { due: dueISO } as any);
        get().log({ user: 'manager', action: `SetPackageDue:${pkgId}`, before: null, after: { due: dueISO } });
      },

      scopedAssignments: () => {
        const pid = get().activeProjectId;
        return pid ? get().assignments.filter(a => a.projectId === pid) : get().assignments;
      },

      // Shop Management Selectors (all projects by default, with optional filtering)
      shopPackages: (projectIds) => {
        const packages = get().packages;
        return projectIds && projectIds.length > 0 
          ? packages.filter(p => projectIds.includes(p.projectId))
          : packages;
      },
      
      shopHangers: (projectIds) => {
        const hangers = get().hangers;
        return projectIds && projectIds.length > 0 
          ? hangers.filter(h => projectIds.includes(h.projectId))
          : hangers;
      },
      
      shopAssignments: (projectIds) => {
        const assignments = get().assignments;
        return projectIds && projectIds.length > 0 
          ? assignments.filter(a => projectIds.includes(a.projectId))
          : assignments;
      },
    }),
    { name: 'msuite-demo-db' }
  )
);