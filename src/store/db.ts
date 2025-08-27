import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { mapCsvRow } from '@/lib/seedFromCsv';

export type Hanger = ReturnType<typeof mapCsvRow> & {
  status: string;
};

export type Package = {
  id: string;
  name: string;
  level?: string;
  zone?: string;
  state: 'Planned' | 'Kitted' | 'Assembled' | 'ShopQAPassed' | 'Staged' | 'Loaded' | 'Delivered';
  hangerIds: string[];
  pickListId?: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkOrder = {
  id: string;
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

type DB = {
  hangers: Hanger[];
  packages: Package[];
  workOrders: WorkOrder[];
  shipments: Shipment[];
  crews: Crew[];
  audits: Audit[];
  
  // Actions
  seedFromCsv: (rows: Hanger[]) => void;
  groupPackages: () => void;
  createWorkOrder: (pkgId: string, init?: Partial<WorkOrder>) => string;
  createPickList: (pkgId: string) => string;
  advancePackage: (pkgId: string, state: Package['state']) => void;
  setHangerState: (id: string, state: string) => void;
  createShipment: (pkgIds: string[], stops: Shipment['stops']) => string;
  updateWorkOrder: (id: string, updates: Partial<WorkOrder>) => void;
  deleteWorkOrder: (id: string) => void;
  autoSchedule: () => void;
  log: (e: Omit<Audit, 'id' | 'at'>) => void;
};

export const useDB = create<DB>()(
  persist(
    (set, get) => ({
      hangers: [],
      packages: [],
      workOrders: [],
      shipments: [],
      audits: [],
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

      seedFromCsv: (rows) => set({ hangers: rows }),

      groupPackages: () => {
        const hs = get().hangers;
        const groups = new Map<string, string[]>();
        
        hs.forEach(h => {
          const k = `${h.level || 'L?'}-${h.zone || 'Z?'}`;
          groups.set(k, [...(groups.get(k) || []), h.id]);
        });

        const pkgs: Package[] = Array.from(groups.entries()).map(([k, ids], i) => ({
          id: `PKG-${String(i + 1).padStart(3, '0')}`,
          name: `Package ${k}`,
          level: k.split('-')[0],
          zone: k.split('-')[1],
          state: 'Planned',
          hangerIds: ids,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));

        set({ packages: pkgs });
      },

      createWorkOrder: (pkgId, init = {}) => {
        const id = `WO-${String(get().workOrders.length + 1).padStart(3, '0')}`;
        const now = new Date().toISOString();
        const workOrder: WorkOrder = {
          id,
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
        const now = new Date().toISOString();
        
        set({
          packages: get().packages.map(p =>
            p.id === pkgId ? { ...p, pickListId: pid, state: 'Kitted', updatedAt: now } : p
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
        const now = new Date().toISOString();
        
        set({
          packages: get().packages.map(p =>
            p.id === pkgId ? { ...p, state, updatedAt: now } : p
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
        const now = new Date().toISOString();
        
        set({
          hangers: get().hangers.map(h =>
            h.id === id ? { ...h, status: state, updatedAt: now } : h
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
              ...e
            }
          ]
        })
    }),
    { name: 'msuite-demo-db' }
  )
);