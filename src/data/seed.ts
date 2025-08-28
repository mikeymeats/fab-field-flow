// MSUITE Fab & Field — Demo Seed (Projects → Packages → Hangers → Items)
export type SeedProject = { 
  id: string; 
  name: string; 
  address?: string; 
  startDate?: string; 
  endDate?: string;
  status: 'Planning' | 'Active' | 'OnHold' | 'Completed' | 'Cancelled';
  isActive: boolean;
  isArchived: boolean;
  description?: string;
  client?: string;
  value?: number;
};
export type SeedPackage = { id: string; projectId: string; name: string; level?: string; zone?: string; state: string; hangerIds: string[]; pickListId?: string };
export type SeedHangerItem = { sku: string; desc: string; uom: 'ea'|'ft'; qty: number };
export type SeedHanger = {
  id: string; projectId: string; name: string; type: 'Trapeze'|'Clevis'|'Seismic'|'Rack';
  system: string; service: string; level: string; grid?: string; zone?: string;
  elevationFt?: number; coordinates?: {x:number,y:number,z:number};
  upperAttachment?: {type:string; model?:string; variant?:string};
  bim?: { documentGuid:string; elementId:number; modelVersion:string };
  status: string; rev:number; estHours:number; actHours:number; estMatCost:number; actMatCost:number;
  items: SeedHangerItem[];
};

export const seed: { projects: SeedProject[]; packages: SeedPackage[]; hangers: SeedHanger[] } = {
  projects: [
    {
      id: "PRJ-001",
      name: "Riverview Medical Tower",
      address: "1200 Riverside Dr, Austin, TX",
      startDate: "2025-07-15",
      endDate: "2026-03-31",
      status: "Active",
      isActive: true,
      isArchived: false,
      description: "5-story medical facility with complex MEP systems including chilled water, steam, and sanitary systems",
      client: "Austin Healthcare Partners",
      value: 2450000
    },
    {
      id: "PRJ-002",
      name: "Downtown Office Complex Phase 2",
      address: "800 Congress Ave, Austin, TX",
      startDate: "2025-09-01",
      endDate: "2026-08-15",
      status: "Planning",
      isActive: false,
      isArchived: false,
      description: "High-rise office building with state-of-the-art HVAC and plumbing systems",
      client: "Meridian Development Group",
      value: 3200000
    },
    {
      id: "PRJ-003",
      name: "Manufacturing Plant Expansion",
      address: "4500 Industrial Blvd, Round Rock, TX",
      startDate: "2024-11-01",
      endDate: "2025-04-30",
      status: "Completed",
      isActive: false,
      isArchived: false,
      description: "Process piping and equipment support systems for pharmaceutical manufacturing",
      client: "BioTech Industries LLC",
      value: 1850000
    },
    {
      id: "PRJ-004",
      name: "University Research Building",
      address: "2100 Speedway, Austin, TX",
      startDate: "2025-01-15",
      endDate: "2025-12-01",
      status: "OnHold",
      isActive: false,
      isArchived: false,
      description: "Laboratory and research facility with specialized exhaust and process systems",
      client: "University of Texas",
      value: 4100000
    },
    {
      id: "PRJ-005",
      name: "Retail Shopping Center",
      address: "1500 S Lamar Blvd, Austin, TX",
      startDate: "2024-03-01",
      endDate: "2024-10-15",
      status: "Completed",
      isActive: false,
      isArchived: true,
      description: "Multi-tenant retail space with individual HVAC zones and common area systems",
      client: "South Austin Properties",
      value: 950000
    },
    {
      id: "PRJ-006",
      name: "Austin Tech Data Center",
      address: "3300 Bee Cave Rd, Austin, TX",
      startDate: "2025-10-01",
      endDate: "2026-06-30",
      status: "Active",
      isActive: true,
      isArchived: false,
      description: "Tier IV data center with redundant cooling systems and power infrastructure",
      client: "Digital Edge Solutions",
      value: 5200000
    },
    {
      id: "PRJ-007", 
      name: "Central Texas Hospital Expansion",
      address: "1500 Red River St, Austin, TX",
      startDate: "2025-02-01",
      endDate: "2026-11-15",
      status: "Active",
      isActive: true,
      isArchived: false,
      description: "New surgical suites, ICU expansion with medical gas systems and specialized HVAC",
      client: "Central Texas Healthcare System",
      value: 6800000
    }
  ],
  packages: [
    // PRJ-001 packages (Riverview Medical Tower - 5 story medical facility)
    { id:"PKG-001", projectId:"PRJ-001", name:"PKG L2-ZA", level:"L2", zone:"ZA", state:"Kitted", hangerIds:["HNG-1000","HNG-1001","HNG-1002"] },
    { id:"PKG-002", projectId:"PRJ-001", name:"PKG L2-ZB", level:"L2", zone:"ZB", state:"Assembled", hangerIds:["HNG-1003","HNG-1004","HNG-1005"] },
    { id:"PKG-003", projectId:"PRJ-001", name:"PKG L3-ZA", level:"L3", zone:"ZA", state:"Planned", hangerIds:["HNG-1006","HNG-1007","HNG-1008"] },
    { id:"PKG-004", projectId:"PRJ-001", name:"PKG L3-ZB", level:"L3", zone:"ZB", state:"Planned", hangerIds:["HNG-1009","HNG-1010","HNG-1011"] },
    { id:"PKG-005", projectId:"PRJ-001", name:"PKG L4-ZA", level:"L4", zone:"ZA", state:"ShopQAPassed", hangerIds:["HNG-1012","HNG-1013","HNG-1014"] },
    { id:"PKG-006", projectId:"PRJ-001", name:"PKG L4-ZB", level:"L4", zone:"ZB", state:"Staged", hangerIds:["HNG-1015","HNG-1016","HNG-1017"] },
    { id:"PKG-007", projectId:"PRJ-001", name:"PKG L5-ZA", level:"L5", zone:"ZA", state:"Planned", hangerIds:["HNG-1018","HNG-1019","HNG-1020"] },
    { id:"PKG-008", projectId:"PRJ-001", name:"PKG L5-ZB", level:"L5", zone:"ZB", state:"Planned", hangerIds:["HNG-1021","HNG-1022","HNG-1023"] },
    { id:"PKG-009", projectId:"PRJ-001", name:"PKG B1-UTILITIES", level:"B1", zone:"UTIL", state:"ReadyToShip", hangerIds:["HNG-1024","HNG-1025","HNG-1026","HNG-1027"] },
    { id:"PKG-010", projectId:"PRJ-001", name:"PKG L1-LOBBY", level:"L1", zone:"LOBBY", state:"InFabrication", hangerIds:["HNG-1028","HNG-1029"] },
    
    // PRJ-002 packages (Downtown Office Complex Phase 2 - High-rise office building)
    { id:"PKG-101", projectId:"PRJ-002", name:"PKG B1-PARKING", level:"B1", zone:"PARK", state:"Submitted", hangerIds:["HNG-2000","HNG-2001","HNG-2002"] },
    { id:"PKG-102", projectId:"PRJ-002", name:"PKG L1-RETAIL", level:"L1", zone:"RETAIL", state:"Submitted", hangerIds:["HNG-2003","HNG-2004","HNG-2005"] },
    { id:"PKG-103", projectId:"PRJ-002", name:"PKG L2-OFFICE", level:"L2", zone:"OFFICE", state:"Submitted", hangerIds:["HNG-2006","HNG-2007","HNG-2008","HNG-2009"] },
    { id:"PKG-104", projectId:"PRJ-002", name:"PKG L3-OFFICE", level:"L3", zone:"OFFICE", state:"Submitted", hangerIds:["HNG-2010","HNG-2011","HNG-2012"] },
    { id:"PKG-105", projectId:"PRJ-002", name:"PKG L4-OFFICE", level:"L4", zone:"OFFICE", state:"Submitted", hangerIds:["HNG-2013","HNG-2014","HNG-2015"] },
    { id:"PKG-106", projectId:"PRJ-002", name:"PKG ROOF-MECH", level:"ROOF", zone:"MECH", state:"Submitted", hangerIds:["HNG-2016","HNG-2017","HNG-2018","HNG-2019","HNG-2020"] },
    
    // Additional submitted packages for Riverview Medical Tower - Need Shop Manager Review
    { id:"PKG-011", projectId:"PRJ-001", name:"PKG L1-EMERGENCY", level:"L1", zone:"ER", state:"Submitted", hangerIds:["HNG-1030","HNG-1031","HNG-1032"] },
    { id:"PKG-012", projectId:"PRJ-001", name:"PKG L2-PATIENT-EAST", level:"L2", zone:"EAST", state:"Submitted", hangerIds:["HNG-1033","HNG-1034","HNG-1035","HNG-1036"] },
    { id:"PKG-013", projectId:"PRJ-001", name:"PKG L3-SURGERY", level:"L3", zone:"SURG", state:"Submitted", hangerIds:["HNG-1037","HNG-1038","HNG-1039"] },
    { id:"PKG-014", projectId:"PRJ-001", name:"PKG L4-ICU", level:"L4", zone:"ICU", state:"Submitted", hangerIds:["HNG-1040","HNG-1041","HNG-1042","HNG-1043"] },
    { id:"PKG-015", projectId:"PRJ-001", name:"PKG L5-ADMIN", level:"L5", zone:"ADMIN", state:"Submitted", hangerIds:["HNG-1044","HNG-1045","HNG-1046"] },
    { id:"PKG-016", projectId:"PRJ-001", name:"PKG ROOF-MECHANICAL", level:"ROOF", zone:"MECH", state:"Submitted", hangerIds:["HNG-1047","HNG-1048","HNG-1049","HNG-1050","HNG-1051"] },
    
    // PRJ-003 packages (Manufacturing Plant Expansion - Completed project)
    { id:"PKG-201", projectId:"PRJ-003", name:"PKG PROC-ZA", level:"L1", zone:"ZA", state:"Delivered", hangerIds:["HNG-3000","HNG-3001","HNG-3002"] },
    { id:"PKG-202", projectId:"PRJ-003", name:"PKG PROC-ZB", level:"L1", zone:"ZB", state:"Delivered", hangerIds:["HNG-3003","HNG-3004","HNG-3005"] },
    { id:"PKG-203", projectId:"PRJ-003", name:"PKG PROC-ZC", level:"L1", zone:"ZC", state:"Delivered", hangerIds:["HNG-3006","HNG-3007","HNG-3008"] },
    { id:"PKG-204", projectId:"PRJ-003", name:"PKG UTILITIES", level:"L1", zone:"UTIL", state:"Delivered", hangerIds:["HNG-3009","HNG-3010","HNG-3011","HNG-3012"] },
    
    // PRJ-004 packages (University Research Building - On hold)
    { id:"PKG-301", projectId:"PRJ-004", name:"PKG LAB-L1", level:"L1", zone:"LAB", state:"OnHold", hangerIds:["HNG-4000","HNG-4001","HNG-4002","HNG-4003"] },
    { id:"PKG-302", projectId:"PRJ-004", name:"PKG LAB-L2", level:"L2", zone:"LAB", state:"OnHold", hangerIds:["HNG-4004","HNG-4005","HNG-4006"] },
    { id:"PKG-303", projectId:"PRJ-004", name:"PKG LAB-L3", level:"L3", zone:"LAB", state:"OnHold", hangerIds:["HNG-4007","HNG-4008","HNG-4009"] },
    { id:"PKG-304", projectId:"PRJ-004", name:"PKG EXHAUST-ROOF", level:"ROOF", zone:"EXHAUST", state:"OnHold", hangerIds:["HNG-4010","HNG-4011","HNG-4012","HNG-4013","HNG-4014"] },
    
    // PRJ-005 packages (Retail Shopping Center - Archived/completed)
    { id:"PKG-401", projectId:"PRJ-005", name:"PKG RETAIL-WEST", level:"L1", zone:"WEST", state:"Delivered", hangerIds:["HNG-5000","HNG-5001","HNG-5002"] },
    { id:"PKG-402", projectId:"PRJ-005", name:"PKG RETAIL-EAST", level:"L1", zone:"EAST", state:"Delivered", hangerIds:["HNG-5003","HNG-5004","HNG-5005"] },
    { id:"PKG-403", projectId:"PRJ-005", name:"PKG COMMON-HVAC", level:"L1", zone:"COMMON", state:"Delivered", hangerIds:["HNG-5006","HNG-5007","HNG-5008","HNG-5009"] },
    
    // PRJ-006 packages (New Data Center - Active)
    { id:"PKG-501", projectId:"PRJ-006", name:"PKG DC-COOLING", level:"L1", zone:"COOLING", state:"Kitted", hangerIds:["HNG-6000","HNG-6001","HNG-6002","HNG-6003"] },
    { id:"PKG-502", projectId:"PRJ-006", name:"PKG DC-POWER", level:"L1", zone:"POWER", state:"InFabrication", hangerIds:["HNG-6004","HNG-6005","HNG-6006"] },
    { id:"PKG-503", projectId:"PRJ-006", name:"PKG DC-SERVER", level:"L1", zone:"SERVER", state:"Assembled", hangerIds:["HNG-6007","HNG-6008","HNG-6009","HNG-6010"] },
    { id:"PKG-504", projectId:"PRJ-006", name:"PKG DC-ROOF", level:"ROOF", zone:"ROOF", state:"ReadyToShip", hangerIds:["HNG-6011","HNG-6012"] },
    
    // PRJ-007 packages (Hospital Expansion - Active) - Complete workflow demonstration
    { id:"PKG-601", projectId:"PRJ-007", name:"PKG OR-SUITE-A", level:"L3", zone:"OR-A", state:"QA", hangerIds:["HNG-7000","HNG-7001","HNG-7002","HNG-7003"] },
    { id:"PKG-602", projectId:"PRJ-007", name:"PKG OR-SUITE-B", level:"L3", zone:"OR-B", state:"Fabrication", hangerIds:["HNG-7004","HNG-7005","HNG-7006"] },
    { id:"PKG-603", projectId:"PRJ-007", name:"PKG ICU-LEVEL-4", level:"L4", zone:"ICU", state:"Packaging", hangerIds:["HNG-7007","HNG-7008","HNG-7009","HNG-7010"] },
    { id:"PKG-604", projectId:"PRJ-007", name:"PKG EMERGENCY", level:"L1", zone:"ER", state:"Shipping", hangerIds:["HNG-7011","HNG-7012","HNG-7013"] },
    { id:"PKG-605", projectId:"PRJ-007", name:"PKG MECHANICAL", level:"B1", zone:"MECH", state:"Shipped", hangerIds:["HNG-7014","HNG-7015","HNG-7016","HNG-7017"] },
    
    // Additional PRJ-001 packages for full workflow demonstration
    { id:"PKG-017", projectId:"PRJ-001", name:"PKG L1-CAFETERIA", level:"L1", zone:"CAF", state:"Approved", hangerIds:["HNG-1052","HNG-1053","HNG-1054"] },
    { id:"PKG-018", projectId:"PRJ-001", name:"PKG L2-IMAGING", level:"L2", zone:"IMG", state:"Fabrication", hangerIds:["HNG-1055","HNG-1056","HNG-1057"] },
    { id:"PKG-019", projectId:"PRJ-001", name:"PKG L3-RADIOLOGY", level:"L3", zone:"RAD", state:"InProduction", hangerIds:["HNG-1058","HNG-1059","HNG-1060"] },
    { id:"PKG-020", projectId:"PRJ-001", name:"PKG L4-PATIENT-WEST", level:"L4", zone:"WEST", state:"Inspection", hangerIds:["HNG-1061","HNG-1062","HNG-1063"] },
    { id:"PKG-021", projectId:"PRJ-001", name:"PKG L5-CONFERENCE", level:"L5", zone:"CONF", state:"Kitting", hangerIds:["HNG-1064","HNG-1065","HNG-1066"] },
    
    // PRJ-006 additional packages for more workflow states  
    { id:"PKG-506", projectId:"PRJ-006", name:"PKG DC-SECURITY", level:"L1", zone:"SEC", state:"QA", hangerIds:["HNG-6013","HNG-6014"] },
    { id:"PKG-507", projectId:"PRJ-006", name:"PKG DC-BACKUP", level:"L1", zone:"BACKUP", state:"Packaging", hangerIds:["HNG-6015","HNG-6016","HNG-6017"] },
    { id:"PKG-508", projectId:"PRJ-006", name:"PKG DC-NETWORK", level:"L1", zone:"NET", state:"Shipping", hangerIds:["HNG-6018","HNG-6019"] }
  ],
  hangers: [
    // ---------- PKG-001 (L2-ZA) ----------
    {
      id:"HNG-1000", projectId:"PRJ-001", name:"HNG-TRAP-2R-P1000-3/8ROD-L2-ZA", type:"Trapeze",
      system:"CHW", service:"Hydronic", level:"2", grid:"B4", zone:"A", elevationFt:12.5,
      coordinates:{x:123.4,y:22.1,z:150.2}, upperAttachment:{type:"CastIn",model:"Bang-It+",variant:"3/8-1/2"},
      bim:{documentGuid:"doc-123",elementId:4000,modelVersion:"2025-08-24T12:00:00Z"},
      status:"ApprovedForFab", rev:1, estHours:1.2, actHours:0, estMatCost:52.75, actMatCost:0,
      items:[
        {sku:"P1000",desc:"Unistrut Channel P1000",uom:"ft",qty:2.4},
        {sku:"ROD-3/8",desc:"Threaded Rod 3/8",uom:"ft",qty:2.1},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:4},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
        {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:4},
        {sku:"ANCH-SET",desc:"Anchor (per attachment)",uom:"ea",qty:1}
      ]
    },
    {
      id:"HNG-1001", projectId:"PRJ-001", name:"HNG-CLEVIS-1R-3/8ROD-L2-ZA", type:"Clevis",
      system:"Steam", service:"Process", level:"2", grid:"A2", zone:"A", elevationFt:10.1,
      coordinates:{x:44.2,y:18.5,z:132.0}, upperAttachment:{type:"Screw",model:"UltraCon+",variant:"3/8"},
      bim:{documentGuid:"doc-123",elementId:4001,modelVersion:"2025-08-24T12:00:00Z"},
      status:"ApprovedForFab", rev:1, estHours:1.0, actHours:0, estMatCost:38.10, actMatCost:0,
      items:[
        {sku:"ROD-3/8",desc:"Threaded Rod 3/8",uom:"ft",qty:2.2},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
        {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:4},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:2},
        {sku:"ANCH-SET",desc:"Anchor (per attachment)",uom:"ea",qty:1}
      ]
    },
    {
      id:"HNG-1002", projectId:"PRJ-001", name:"HNG-SEISMIC-TRAP-2R-P1000-1/2ROD-L2-ZA", type:"Seismic",
      system:"Sanitary", service:"Drain", level:"2", grid:"D6", zone:"A", elevationFt:14.0,
      coordinates:{x:210.1,y:5.2,z:168.0}, upperAttachment:{type:"Wedge",model:"Power-Stud+",variant:"1/2"},
      bim:{documentGuid:"doc-123",elementId:4002,modelVersion:"2025-08-24T12:00:00Z"},
      status:"ApprovedForFab", rev:1, estHours:1.5, actHours:0, estMatCost:64.00, actMatCost:0,
      items:[
        {sku:"P1000",desc:"Unistrut Channel P1000",uom:"ft",qty:3.2},
        {sku:"ROD-1/2",desc:"Threaded Rod 1/2",uom:"ft",qty:2.8},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:6},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
        {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:6},
        {sku:"ANCH-SET",desc:"Anchor (per attachment)",uom:"ea",qty:1}
      ]
    },

    // ---------- PKG-002 (L2-ZB) ----------
    {
      id:"HNG-1003", projectId:"PRJ-001", name:"HNG-TRAP-2R-P1000-3/8ROD-L2-ZB", type:"Trapeze",
      system:"CHW", service:"Hydronic", level:"2", grid:"C3", zone:"B", elevationFt:12.9,
      coordinates:{x:88.1,y:25.0,z:152.5}, upperAttachment:{type:"CastIn",model:"Bang-It+",variant:"3/8-1/2"},
      bim:{documentGuid:"doc-123",elementId:4003,modelVersion:"2025-08-24T12:00:00Z"},
      status:"ApprovedForFab", rev:1, estHours:1.2, actHours:0, estMatCost:50.55, actMatCost:0,
      items:[
        {sku:"P1000",desc:"Unistrut Channel P1000",uom:"ft",qty:2.0},
        {sku:"ROD-3/8",desc:"Threaded Rod 3/8",uom:"ft",qty:1.8},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:4},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
        {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:4},
        {sku:"ANCH-SET",desc:"Anchor (per attachment)",uom:"ea",qty:1}
      ]
    },
    {
      id:"HNG-1004", projectId:"PRJ-001", name:"HNG-CLEVIS-1R-3/8ROD-L2-ZB", type:"Clevis",
      system:"Steam", service:"Process", level:"2", grid:"B4", zone:"B", elevationFt:10.4,
      coordinates:{x:60.5,y:44.2,z:120.0}, upperAttachment:{type:"Screw",model:"UltraCon+",variant:"3/8"},
      bim:{documentGuid:"doc-123",elementId:4004,modelVersion:"2025-08-24T12:00:00Z"},
      status:"ApprovedForFab", rev:1, estHours:0.9, actHours:0, estMatCost:36.40, actMatCost:0,
      items:[
        {sku:"ROD-3/8",desc:"Threaded Rod 3/8",uom:"ft",qty:2.0},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
        {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:4},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:2},
        {sku:"ANCH-SET",desc:"Anchor (per attachment)",uom:"ea",qty:1}
      ]
    },
    {
      id:"HNG-1005", projectId:"PRJ-001", name:"HNG-SEISMIC-TRAP-2R-P1000-1/2ROD-L2-ZB", type:"Seismic",
      system:"Sanitary", service:"Drain", level:"2", grid:"D6", zone:"B", elevationFt:14.3,
      coordinates:{x:210.5,y:7.2,z:168.6}, upperAttachment:{type:"Wedge",model:"Power-Stud+",variant:"1/2"},
      bim:{documentGuid:"doc-123",elementId:4005,modelVersion:"2025-08-24T12:00:00Z"},
      status:"ApprovedForFab", rev:1, estHours:1.5, actHours:0, estMatCost:63.10, actMatCost:0,
      items:[
        {sku:"P1000",desc:"Unistrut Channel P1000",uom:"ft",qty:3.4},
        {sku:"ROD-1/2",desc:"Threaded Rod 1/2",uom:"ft",qty:3.1},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:6},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
        {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:6},
        {sku:"ANCH-SET",desc:"Anchor (per attachment)",uom:"ea",qty:1}
      ]
    },

    // ---------- PKG-003 (L3-ZA) ----------
    {
      id:"HNG-1006", projectId:"PRJ-001", name:"HNG-TRAP-2R-P1000-3/8ROD-L3-ZA", type:"Trapeze",
      system:"CHW", service:"Hydronic", level:"3", grid:"B4", zone:"A", elevationFt:12.8,
      coordinates:{x:130.2,y:28.1,z:151.0}, upperAttachment:{type:"CastIn",model:"Bang-It+",variant:"3/8-1/2"},
      bim:{documentGuid:"doc-123",elementId:4006,modelVersion:"2025-08-24T12:00:00Z"},
      status:"ApprovedForFab", rev:1, estHours:1.1, actHours:0, estMatCost:49.85, actMatCost:0,
      items:[
        {sku:"P1000",desc:"Unistrut Channel P1000",uom:"ft",qty:2.2},
        {sku:"ROD-3/8",desc:"Threaded Rod 3/8",uom:"ft",qty:2.0},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:4},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
        {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:4},
        {sku:"ANCH-SET",desc:"Anchor (per attachment)",uom:"ea",qty:1}
      ]
    },
    {
      id:"HNG-1007", projectId:"PRJ-001", name:"HNG-CLEVIS-1R-3/8ROD-L3-ZA", type:"Clevis",
      system:"Steam", service:"Process", level:"3", grid:"A2", zone:"A", elevationFt:10.3,
      coordinates:{x:42.9,y:20.4,z:121.0}, upperAttachment:{type:"Screw",model:"UltraCon+",variant:"3/8"},
      bim:{documentGuid:"doc-123",elementId:4007,modelVersion:"2025-08-24T12:00:00Z"},
      status:"ApprovedForFab", rev:1, estHours:0.9, actHours:0, estMatCost:35.30, actMatCost:0,
      items:[
        {sku:"ROD-3/8",desc:"Threaded Rod 3/8",uom:"ft",qty:2.1},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
        {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:4},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:2},
        {sku:"ANCH-SET",desc:"Anchor (per attachment)",uom:"ea",qty:1}
      ]
    },
    {
      id:"HNG-1008", projectId:"PRJ-001", name:"HNG-SEISMIC-TRAP-2R-P1000-1/2ROD-L3-ZA", type:"Seismic",
      system:"Sanitary", service:"Drain", level:"3", grid:"D6", zone:"A", elevationFt:14.6,
      coordinates:{x:215.3,y:6.9,z:169.1}, upperAttachment:{type:"Wedge",model:"Power-Stud+",variant:"1/2"},
      bim:{documentGuid:"doc-123",elementId:4008,modelVersion:"2025-08-24T12:00:00Z"},
      status:"ApprovedForFab", rev:1, estHours:1.6, actHours:0, estMatCost:66.25, actMatCost:0,
      items:[
        {sku:"P1000",desc:"Unistrut Channel P1000",uom:"ft",qty:3.6},
        {sku:"ROD-1/2",desc:"Threaded Rod 1/2",uom:"ft",qty:3.2},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:6},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
        {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:6},
        {sku:"ANCH-SET",desc:"Anchor (per attachment)",uom:"ea",qty:1}
      ]
    },

    // ---------- PKG-004 (L3-ZB) ----------
    {
      id:"HNG-1009", projectId:"PRJ-001", name:"HNG-TRAP-2R-P1000-3/8ROD-L3-ZB", type:"Trapeze",
      system:"CHW", service:"Hydronic", level:"3", grid:"C3", zone:"B", elevationFt:12.9,
      coordinates:{x:95.4,y:24.6,z:153.0}, upperAttachment:{type:"CastIn",model:"Bang-It+",variant:"3/8-1/2"},
      bim:{documentGuid:"doc-123",elementId:4009,modelVersion:"2025-08-24T12:00:00Z"},
      status:"ApprovedForFab", rev:1, estHours:1.2, actHours:0, estMatCost:51.90, actMatCost:0,
      items:[
        {sku:"P1000",desc:"Unistrut Channel P1000",uom:"ft",qty:2.3},
        {sku:"ROD-3/8",desc:"Threaded Rod 3/8",uom:"ft",qty:2.0},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:4},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
        {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:4},
        {sku:"ANCH-SET",desc:"Anchor (per attachment)",uom:"ea",qty:1}
      ]
    },
    {
      id:"HNG-1010", projectId:"PRJ-001", name:"HNG-CLEVIS-1R-3/8ROD-L3-ZB", type:"Clevis",
      system:"Steam", service:"Process", level:"3", grid:"B4", zone:"B", elevationFt:10.5,
      coordinates:{x:59.5,y:41.2,z:121.5}, upperAttachment:{type:"Screw",model:"UltraCon+",variant:"3/8"},
      bim:{documentGuid:"doc-123",elementId:4010,modelVersion:"2025-08-24T12:00:00Z"},
      status:"ApprovedForFab", rev:1, estHours:1.0, actHours:0, estMatCost:37.20, actMatCost:0,
      items:[
        {sku:"ROD-3/8",desc:"Threaded Rod 3/8",uom:"ft",qty:2.3},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
        {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:4},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:2},
        {sku:"ANCH-SET",desc:"Anchor (per attachment)",uom:"ea",qty:1}
      ]
    },
    {
      id:"HNG-1011", projectId:"PRJ-001", name:"HNG-SEISMIC-TRAP-2R-P1000-1/2ROD-L3-ZB", type:"Seismic",
      system:"Sanitary", service:"Drain", level:"3", grid:"D6", zone:"B", elevationFt:14.2,
      coordinates:{x:212.2,y:8.5,z:168.2}, upperAttachment:{type:"Wedge",model:"Power-Stud+",variant:"1/2"},
      bim:{documentGuid:"doc-123",elementId:4011,modelVersion:"2025-08-24T12:00:00Z"},
      status:"ApprovedForFab", rev:1, estHours:1.5, actHours:0, estMatCost:65.00, actMatCost:0,
      items:[
        {sku:"P1000",desc:"Unistrut Channel P1000",uom:"ft",qty:3.5},
        {sku:"ROD-1/2",desc:"Threaded Rod 1/2",uom:"ft",qty:3.0},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:6},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
        {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:6},
        {sku:"ANCH-SET",desc:"Anchor (per attachment)",uom:"ea",qty:1}
      ]
    },

    // ---------- PKG-005 (L4-ZA) ----------
    {
      id:"HNG-1012", projectId:"PRJ-001", name:"HNG-TRAP-2R-P1000-3/8ROD-L4-ZA", type:"Trapeze",
      system:"CHW", service:"Hydronic", level:"4", grid:"B4", zone:"A", elevationFt:12.7,
      coordinates:{x:127.3,y:26.4,z:151.2}, upperAttachment:{type:"CastIn",model:"Bang-It+",variant:"3/8-1/2"},
      bim:{documentGuid:"doc-123",elementId:4012,modelVersion:"2025-08-24T12:00:00Z"},
      status:"ApprovedForFab", rev:1, estHours:1.1, actHours:0, estMatCost:50.20, actMatCost:0,
      items:[
        {sku:"P1000",desc:"Unistrut Channel P1000",uom:"ft",qty:2.1},
        {sku:"ROD-3/8",desc:"Threaded Rod 3/8",uom:"ft",qty:2.0},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:4},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
        {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:4},
        {sku:"ANCH-SET",desc:"Anchor (per attachment)",uom:"ea",qty:1}
      ]
    },
    {
      id:"HNG-1013", projectId:"PRJ-001", name:"HNG-CLEVIS-1R-3/8ROD-L4-ZA", type:"Clevis",
      system:"Steam", service:"Process", level:"4", grid:"A2", zone:"A", elevationFt:10.2,
      coordinates:{x:41.9,y:21.1,z:121.2}, upperAttachment:{type:"Screw",model:"UltraCon+",variant:"3/8"},
      bim:{documentGuid:"doc-123",elementId:4013,modelVersion:"2025-08-24T12:00:00Z"},
      status:"ApprovedForFab", rev:1, estHours:1.0, actHours:0, estMatCost:36.90, actMatCost:0,
      items:[
        {sku:"ROD-3/8",desc:"Threaded Rod 3/8",uom:"ft",qty:2.0},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
        {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:4},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:2},
        {sku:"ANCH-SET",desc:"Anchor (per attachment)",uom:"ea",qty:1}
      ]
    },
    {
      id:"HNG-1014", projectId:"PRJ-001", name:"HNG-SEISMIC-TRAP-2R-P1000-1/2ROD-L4-ZA", type:"Seismic",
      system:"Sanitary", service:"Drain", level:"4", grid:"D6", zone:"A", elevationFt:14.4,
      coordinates:{x:214.1,y:7.1,z:168.9}, upperAttachment:{type:"Wedge",model:"Power-Stud+",variant:"1/2"},
      bim:{documentGuid:"doc-123",elementId:4014,modelVersion:"2025-08-24T12:00:00Z"},
      status:"ApprovedForFab", rev:1, estHours:1.6, actHours:0, estMatCost:66.60, actMatCost:0,
      items:[
        {sku:"P1000",desc:"Unistrut Channel P1000",uom:"ft",qty:3.6},
        {sku:"ROD-1/2",desc:"Threaded Rod 1/2",uom:"ft",qty:3.1},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:6},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
        {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:6},
        {sku:"ANCH-SET",desc:"Anchor (per attachment)",uom:"ea",qty:1}
      ]
    },

    // ---------- PKG-006 (L4-ZB) ----------
    {
      id:"HNG-1015", projectId:"PRJ-001", name:"HNG-TRAP-2R-P1000-3/8ROD-L4-ZB", type:"Trapeze",
      system:"CHW", service:"Hydronic", level:"4", grid:"C3", zone:"B", elevationFt:12.6,
      coordinates:{x:99.4,y:23.3,z:152.8}, upperAttachment:{type:"CastIn",model:"Bang-It+",variant:"3/8-1/2"},
      bim:{documentGuid:"doc-123",elementId:4015,modelVersion:"2025-08-24T12:00:00Z"},
      status:"ApprovedForFab", rev:1, estHours:1.1, actHours:0, estMatCost:49.70, actMatCost:0,
      items:[
        {sku:"P1000",desc:"Unistrut Channel P1000",uom:"ft",qty:2.0},
        {sku:"ROD-3/8",desc:"Threaded Rod 3/8",uom:"ft",qty:1.9},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:4},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
        {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:4},
        {sku:"ANCH-SET",desc:"Anchor (per attachment)",uom:"ea",qty:1}
      ]
    },
    {
      id:"HNG-1016", projectId:"PRJ-001", name:"HNG-CLEVIS-1R-3/8ROD-L4-ZB", type:"Clevis",
      system:"Steam", service:"Process", level:"4", grid:"B4", zone:"B", elevationFt:10.6,
      coordinates:{x:61.5,y:43.0,z:121.9}, upperAttachment:{type:"Screw",model:"UltraCon+",variant:"3/8"},
      bim:{documentGuid:"doc-123",elementId:4016,modelVersion:"2025-08-24T12:00:00Z"},
      status:"ApprovedForFab", rev:1, estHours:1.0, actHours:0, estMatCost:37.60, actMatCost:0,
      items:[
        {sku:"ROD-3/8",desc:"Threaded Rod 3/8",uom:"ft",qty:2.2},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
        {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:4},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:2},
        {sku:"ANCH-SET",desc:"Anchor (per attachment)",uom:"ea",qty:1}
      ]
    },
    {
      id:"HNG-1017", projectId:"PRJ-001", name:"HNG-SEISMIC-TRAP-2R-P1000-1/2ROD-L4-ZB", type:"Seismic",
      system:"Sanitary", service:"Drain", level:"4", grid:"D6", zone:"B", elevationFt:14.5,
      coordinates:{x:213.5,y:9.3,z:168.7}, upperAttachment:{type:"Wedge",model:"Power-Stud+",variant:"1/2"},
      bim:{documentGuid:"doc-123",elementId:4017,modelVersion:"2025-08-24T12:00:00Z"},
      status:"ApprovedForFab", rev:1, estHours:1.5, actHours:0, estMatCost:65.90, actMatCost:0,
      items:[
        {sku:"P1000",desc:"Unistrut Channel P1000",uom:"ft",qty:3.4},
        {sku:"ROD-1/2",desc:"Threaded Rod 1/2",uom:"ft",qty:3.0},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:6},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
        {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:6},
        {sku:"ANCH-SET",desc:"Anchor (per attachment)",uom:"ea",qty:1}
      ]
    },

    // ---------- PKG-007 (L5-ZA) ----------
    {
      id:"HNG-1018", projectId:"PRJ-001", name:"HNG-TRAP-2R-P1000-3/8ROD-L5-ZA", type:"Trapeze",
      system:"CHW", service:"Hydronic", level:"5", grid:"B4", zone:"A", elevationFt:12.6,
      coordinates:{x:129.0,y:27.2,z:151.6}, upperAttachment:{type:"CastIn",model:"Bang-It+",variant:"3/8-1/2"},
      bim:{documentGuid:"doc-123",elementId:4018,modelVersion:"2025-08-24T12:00:00Z"},
      status:"ApprovedForFab", rev:1, estHours:1.1, actHours:0, estMatCost:50.10, actMatCost:0,
      items:[
        {sku:"P1000",desc:"Unistrut Channel P1000",uom:"ft",qty:2.2},
        {sku:"ROD-3/8",desc:"Threaded Rod 3/8",uom:"ft",qty:2.0},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:4},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
        {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:4},
        {sku:"ANCH-SET",desc:"Anchor (per attachment)",uom:"ea",qty:1}
      ]
    },
    {
      id:"HNG-1019", projectId:"PRJ-001", name:"HNG-CLEVIS-1R-3/8ROD-L5-ZA", type:"Clevis",
      system:"Steam", service:"Process", level:"5", grid:"A2", zone:"A", elevationFt:10.7,
      coordinates:{x:43.7,y:20.8,z:122.1}, upperAttachment:{type:"Screw",model:"UltraCon+",variant:"3/8"},
      bim:{documentGuid:"doc-123",elementId:4019,modelVersion:"2025-08-24T12:00:00Z"},
      status:"ApprovedForFab", rev:1, estHours:1.0, actHours:0, estMatCost:37.10, actMatCost:0,
      items:[
        {sku:"ROD-3/8",desc:"Threaded Rod 3/8",uom:"ft",qty:2.2},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
        {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:4},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:2},
        {sku:"ANCH-SET",desc:"Anchor (per attachment)",uom:"ea",qty:1}
      ]
    },
    {
      id:"HNG-1020", projectId:"PRJ-001", name:"HNG-SEISMIC-TRAP-2R-P1000-1/2ROD-L5-ZA", type:"Seismic",
      system:"Sanitary", service:"Drain", level:"5", grid:"D6", zone:"A", elevationFt:14.7,
      coordinates:{x:216.1,y:6.6,z:169.4}, upperAttachment:{type:"Wedge",model:"Power-Stud+",variant:"1/2"},
      bim:{documentGuid:"doc-123",elementId:4020,modelVersion:"2025-08-24T12:00:00Z"},
      status:"ApprovedForFab", rev:1, estHours:1.6, actHours:0, estMatCost:66.90, actMatCost:0,
      items:[
        {sku:"P1000",desc:"Unistrut Channel P1000",uom:"ft",qty:3.6},
        {sku:"ROD-1/2",desc:"Threaded Rod 1/2",uom:"ft",qty:3.2},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:6},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
        {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:6},
        {sku:"ANCH-SET",desc:"Anchor (per attachment)",uom:"ea",qty:1}
      ]
    },

    // ---------- PKG-008 (L5-ZB) ----------
    {
      id:"HNG-1021", projectId:"PRJ-001", name:"HNG-TRAP-2R-P1000-3/8ROD-L5-ZB", type:"Trapeze",
      system:"CHW", service:"Hydronic", level:"5", grid:"C3", zone:"B", elevationFt:12.8,
      coordinates:{x:100.4,y:23.0,z:152.9}, upperAttachment:{type:"CastIn",model:"Bang-It+",variant:"3/8-1/2"},
      bim:{documentGuid:"doc-123",elementId:4021,modelVersion:"2025-08-24T12:00:00Z"},
      status:"ApprovedForFab", rev:1, estHours:1.2, actHours:0, estMatCost:51.40, actMatCost:0,
      items:[
        {sku:"P1000",desc:"Unistrut Channel P1000",uom:"ft",qty:2.3},
        {sku:"ROD-3/8",desc:"Threaded Rod 3/8",uom:"ft",qty:2.1},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:4},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
        {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:4},
        {sku:"ANCH-SET",desc:"Anchor (per attachment)",uom:"ea",qty:1}
      ]
    },
    {
      id:"HNG-1022", projectId:"PRJ-001", name:"HNG-CLEVIS-1R-3/8ROD-L5-ZB", type:"Clevis",
      system:"Steam", service:"Process", level:"5", grid:"B4", zone:"B", elevationFt:10.8,
      coordinates:{x:62.2,y:43.6,z:122.0}, upperAttachment:{type:"Screw",model:"UltraCon+",variant:"3/8"},
      bim:{documentGuid:"doc-123",elementId:4022,modelVersion:"2025-08-24T12:00:00Z"},
      status:"ApprovedForFab", rev:1, estHours:1.0, actHours:0, estMatCost:37.80, actMatCost:0,
      items:[
        {sku:"ROD-3/8",desc:"Threaded Rod 3/8",uom:"ft",qty:2.2},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
        {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:4},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:2},
        {sku:"ANCH-SET",desc:"Anchor (per attachment)",uom:"ea",qty:1}
      ]
    },
    {
      id:"HNG-1023", projectId:"PRJ-001", name:"HNG-SEISMIC-TRAP-2R-P1000-1/2ROD-L5-ZB", type:"Seismic",
      system:"Sanitary", service:"Drain", level:"5", grid:"D6", zone:"B", elevationFt:14.8,
      coordinates:{x:217.0,y:6.2,z:169.7}, upperAttachment:{type:"Wedge",model:"Power-Stud+",variant:"1/2"},
      bim:{documentGuid:"doc-123",elementId:4023,modelVersion:"2025-08-24T12:00:00Z"},
      status:"ApprovedForFab", rev:1, estHours:1.6, actHours:0, estMatCost:67.20, actMatCost:0,
      items:[
        {sku:"P1000",desc:"Unistrut Channel P1000",uom:"ft",qty:3.7},
        {sku:"ROD-1/2",desc:"Threaded Rod 1/2",uom:"ft",qty:3.3},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:6},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
        {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:6},
        {sku:"ANCH-SET",desc:"Anchor (per attachment)",uom:"ea",qty:1}
      ]
    },

    // ---------- PRJ-001 Additional Hangers ----------
    // PKG-009 (B1-UTILITIES)
    {
      id:"HNG-1024", projectId:"PRJ-001", name:"HNG-RACK-4R-P3000-1/2ROD-B1-UTIL", type:"Rack",
      system:"Utilities", service:"Electric", level:"B1", grid:"E1", zone:"UTIL", elevationFt:8.5,
      coordinates:{x:300.1,y:50.1,z:102.0}, upperAttachment:{type:"CastIn",model:"Bang-It+",variant:"1/2"},
      bim:{documentGuid:"doc-123",elementId:5000,modelVersion:"2025-08-24T12:00:00Z"},
      status:"ApprovedForFab", rev:1, estHours:2.5, actHours:0, estMatCost:85.50, actMatCost:0,
      items:[
        {sku:"P3000",desc:"Unistrut Channel P3000",uom:"ft",qty:6.0},
        {sku:"ROD-1/2",desc:"Threaded Rod 1/2",uom:"ft",qty:4.2},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:8},
        {sku:"ANCH-SET",desc:"Anchor (per attachment)",uom:"ea",qty:2}
      ]
    },
    {
      id:"HNG-1025", projectId:"PRJ-001", name:"HNG-CLEVIS-2R-5/8ROD-B1-UTIL", type:"Clevis",
      system:"Utilities", service:"Water", level:"B1", grid:"F2", zone:"UTIL", elevationFt:9.2,
      coordinates:{x:325.4,y:75.3,z:110.4}, upperAttachment:{type:"Wedge",model:"Power-Stud+",variant:"5/8"},
      bim:{documentGuid:"doc-123",elementId:5001,modelVersion:"2025-08-24T12:00:00Z"},
      status:"ApprovedForFab", rev:1, estHours:1.8, actHours:0, estMatCost:68.25, actMatCost:0,
      items:[
        {sku:"ROD-5/8",desc:"Threaded Rod 5/8",uom:"ft",qty:3.5},
        {sku:"CLV-LRG",desc:"Large Clevis Hanger",uom:"ea",qty:1},
        {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:6},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:4}
      ]
    },
    {
      id:"HNG-1026", projectId:"PRJ-001", name:"HNG-TRAP-4R-P1000-1/2ROD-B1-UTIL", type:"Trapeze",
      system:"Gas", service:"Medical", level:"B1", grid:"G3", zone:"UTIL", elevationFt:10.8,
      coordinates:{x:350.2,y:100.1,z:129.6}, upperAttachment:{type:"CastIn",model:"Bang-It+",variant:"1/2"},
      bim:{documentGuid:"doc-123",elementId:5002,modelVersion:"2025-08-24T12:00:00Z"},
      status:"ApprovedForFab", rev:1, estHours:2.2, actHours:0, estMatCost:78.90, actMatCost:0,
      items:[
        {sku:"P1000",desc:"Unistrut Channel P1000",uom:"ft",qty:4.5},
        {sku:"ROD-1/2",desc:"Threaded Rod 1/2",uom:"ft",qty:3.8},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:8},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:2}
      ]
    },
    {
      id:"HNG-1027", projectId:"PRJ-001", name:"HNG-SEISMIC-TRAP-2R-P1000-3/4ROD-B1-UTIL", type:"Seismic",
      system:"Fire", service:"Sprinkler", level:"B1", grid:"H4", zone:"UTIL", elevationFt:11.5,
      coordinates:{x:375.8,y:125.7,z:138.0}, upperAttachment:{type:"Wedge",model:"Power-Stud+",variant:"3/4"},
      bim:{documentGuid:"doc-123",elementId:5003,modelVersion:"2025-08-24T12:00:00Z"},
      status:"ApprovedForFab", rev:1, estHours:2.0, actHours:0, estMatCost:82.40, actMatCost:0,
      items:[
        {sku:"P1000",desc:"Unistrut Channel P1000",uom:"ft",qty:3.2},
        {sku:"ROD-3/4",desc:"Threaded Rod 3/4",uom:"ft",qty:2.9},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:6},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
        {sku:"SEIS-BRACE",desc:"Seismic Brace",uom:"ea",qty:2}
      ]
    },

    // PKG-010 (L1-LOBBY)
    {
      id:"HNG-1028", projectId:"PRJ-001", name:"HNG-CLEVIS-1R-3/8ROD-L1-LOBBY", type:"Clevis",
      system:"HVAC", service:"Supply", level:"L1", grid:"A1", zone:"LOBBY", elevationFt:12.0,
      coordinates:{x:25.0,y:25.0,z:144.0}, upperAttachment:{type:"Screw",model:"UltraCon+",variant:"3/8"},
      bim:{documentGuid:"doc-123",elementId:5004,modelVersion:"2025-08-24T12:00:00Z"},
      status:"ApprovedForFab", rev:1, estHours:1.0, actHours:0, estMatCost:42.10, actMatCost:0,
      items:[
        {sku:"ROD-3/8",desc:"Threaded Rod 3/8",uom:"ft",qty:2.4},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
        {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:4},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:2}
      ]
    },
    {
      id:"HNG-1029", projectId:"PRJ-001", name:"HNG-TRAP-2R-P1000-1/2ROD-L1-LOBBY", type:"Trapeze",
      system:"HVAC", service:"Return", level:"L1", grid:"B2", zone:"LOBBY", elevationFt:13.5,
      coordinates:{x:50.0,y:50.0,z:162.0}, upperAttachment:{type:"CastIn",model:"Bang-It+",variant:"1/2"},
      bim:{documentGuid:"doc-123",elementId:5005,modelVersion:"2025-08-24T12:00:00Z"},
      status:"ApprovedForFab", rev:1, estHours:1.5, actHours:0, estMatCost:58.75, actMatCost:0,
      items:[
        {sku:"P1000",desc:"Unistrut Channel P1000",uom:"ft",qty:2.8},
        {sku:"ROD-1/2",desc:"Threaded Rod 1/2",uom:"ft",qty:2.5},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:6},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1}
      ]
    }
  ]
};

// Import additional workflow hangers and merge them  
import { workflowHangers } from './additional-hangers';

// Append workflow hangers to the main seed data
seed.hangers.push(...workflowHangers);