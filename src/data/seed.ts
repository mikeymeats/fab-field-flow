// MSUITE Fab & Field — Demo Seed (Projects → Packages → Hangers → Items)
export type SeedProject = { id: string; name: string; address?: string; startDate?: string; endDate?: string };
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
      endDate: "2026-03-31"
    }
  ],
  packages: [
    { id:"PKG-001", projectId:"PRJ-001", name:"PKG L2-ZA", level:"L2", zone:"ZA", state:"Planned", hangerIds:["HNG-1000","HNG-1001","HNG-1002"] },
    { id:"PKG-002", projectId:"PRJ-001", name:"PKG L2-ZB", level:"L2", zone:"ZB", state:"Planned", hangerIds:["HNG-1003","HNG-1004","HNG-1005"] },
    { id:"PKG-003", projectId:"PRJ-001", name:"PKG L3-ZA", level:"L3", zone:"ZA", state:"Planned", hangerIds:["HNG-1006","HNG-1007","HNG-1008"] },
    { id:"PKG-004", projectId:"PRJ-001", name:"PKG L3-ZB", level:"L3", zone:"ZB", state:"Planned", hangerIds:["HNG-1009","HNG-1010","HNG-1011"] },
    { id:"PKG-005", projectId:"PRJ-001", name:"PKG L4-ZA", level:"L4", zone:"ZA", state:"Planned", hangerIds:["HNG-1012","HNG-1013","HNG-1014"] },
    { id:"PKG-006", projectId:"PRJ-001", name:"PKG L4-ZB", level:"L4", zone:"ZB", state:"Planned", hangerIds:["HNG-1015","HNG-1016","HNG-1017"] },
    { id:"PKG-007", projectId:"PRJ-001", name:"PKG L5-ZA", level:"L5", zone:"ZA", state:"Planned", hangerIds:["HNG-1018","HNG-1019","HNG-1020"] },
    { id:"PKG-008", projectId:"PRJ-001", name:"PKG L5-ZB", level:"L5", zone:"ZB", state:"Planned", hangerIds:["HNG-1021","HNG-1022","HNG-1023"] }
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
    }
  ]
};