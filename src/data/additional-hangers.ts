// Additional hangers to support the full workflow demonstration
import type { SeedHanger } from './seed';

export const workflowHangers: SeedHanger[] = [
  // PKG-017 (L1-CAFETERIA) - Approved state
  {
    id:"HNG-1052", projectId:"PRJ-001", name:"HNG-TRAP-3R-P1000-1/2ROD-L1-CAF", type:"Trapeze",
    system:"HVAC", service:"Supply", level:"L1", grid:"A5", zone:"CAF", elevationFt:11.5,
    coordinates:{x:400.1,y:150.2,z:138.0}, upperAttachment:{type:"CastIn",model:"Bang-It+",variant:"1/2"},
    bim:{documentGuid:"doc-123",elementId:5010,modelVersion:"2025-08-24T12:00:00Z"},
    status:"Approved", rev:1, estHours:1.8, actHours:0, estMatCost:68.45, actMatCost:0,
    items:[
      {sku:"P1000",desc:"Unistrut Channel P1000",uom:"ft",qty:3.6},
      {sku:"ROD-1/2",desc:"Threaded Rod 1/2",uom:"ft",qty:3.2},
      {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:6},
      {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1}
    ]
  },
  {
    id:"HNG-1053", projectId:"PRJ-001", name:"HNG-CLEVIS-2R-3/8ROD-L1-CAF", type:"Clevis",
    system:"Plumbing", service:"Domestic", level:"L1", grid:"B5", zone:"CAF", elevationFt:10.2,
    coordinates:{x:425.3,y:175.8,z:122.4}, upperAttachment:{type:"Screw",model:"UltraCon+",variant:"3/8"},
    bim:{documentGuid:"doc-123",elementId:5011,modelVersion:"2025-08-24T12:00:00Z"},
    status:"Approved", rev:1, estHours:1.2, actHours:0, estMatCost:42.30, actMatCost:0,
    items:[
      {sku:"ROD-3/8",desc:"Threaded Rod 3/8",uom:"ft",qty:2.8},
      {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
      {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:6},
      {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:4}
    ]
  },
  {
    id:"HNG-1054", projectId:"PRJ-001", name:"HNG-SEISMIC-TRAP-2R-P1000-1/2ROD-L1-CAF", type:"Seismic",
    system:"Fire", service:"Sprinkler", level:"L1", grid:"C5", zone:"CAF", elevationFt:12.8,
    coordinates:{x:450.7,y:200.1,z:153.6}, upperAttachment:{type:"Wedge",model:"Power-Stud+",variant:"1/2"},
    bim:{documentGuid:"doc-123",elementId:5012,modelVersion:"2025-08-24T12:00:00Z"},
    status:"Approved", rev:1, estHours:2.0, actHours:0, estMatCost:74.85, actMatCost:0,
    items:[
      {sku:"P1000",desc:"Unistrut Channel P1000",uom:"ft",qty:2.8},
      {sku:"ROD-1/2",desc:"Threaded Rod 1/2",uom:"ft",qty:2.5},
      {sku:"SEIS-BRACE",desc:"Seismic Brace",uom:"ea",qty:1},
      {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:6}
    ]
  },

  // PKG-018 (L2-IMAGING) - Fabrication state
  {
    id:"HNG-1055", projectId:"PRJ-001", name:"HNG-RACK-4R-P3000-5/8ROD-L2-IMG", type:"Rack",
    system:"Medical", service:"Equipment", level:"L2", grid:"D3", zone:"IMG", elevationFt:13.5,
    coordinates:{x:200.5,y:300.2,z:162.0}, upperAttachment:{type:"CastIn",model:"Bang-It+",variant:"5/8"},
    bim:{documentGuid:"doc-123",elementId:5013,modelVersion:"2025-08-24T12:00:00Z"},
    status:"InFabrication", rev:1, estHours:2.8, actHours:1.2, estMatCost:95.60, actMatCost:42.15,
    items:[
      {sku:"P3000",desc:"Unistrut Channel P3000",uom:"ft",qty:5.2},
      {sku:"ROD-5/8",desc:"Threaded Rod 5/8",uom:"ft",qty:4.8},
      {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:8},
      {sku:"ANCH-SET",desc:"Anchor (per attachment)",uom:"ea",qty:2}
    ]
  },
  {
    id:"HNG-1056", projectId:"PRJ-001", name:"HNG-CLEVIS-3R-1/2ROD-L2-IMG", type:"Clevis",
    system:"Medical", service:"Gas", level:"L2", grid:"E3", zone:"IMG", elevationFt:11.8,
    coordinates:{x:225.8,y:325.5,z:141.6}, upperAttachment:{type:"Screw",model:"UltraCon+",variant:"1/2"},
    bim:{documentGuid:"doc-123",elementId:5014,modelVersion:"2025-08-24T12:00:00Z"},
    status:"InFabrication", rev:1, estHours:1.5, actHours:0.8, estMatCost:58.25, actMatCost:28.10,
    items:[
      {sku:"ROD-1/2",desc:"Threaded Rod 1/2",uom:"ft",qty:3.5},
      {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:2},
      {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:8},
      {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:6}
    ]
  },
  {
    id:"HNG-1057", projectId:"PRJ-001", name:"HNG-TRAP-2R-P1000-3/8ROD-L2-IMG", type:"Trapeze",
    system:"HVAC", service:"Supply", level:"L2", grid:"F3", zone:"IMG", elevationFt:12.2,
    coordinates:{x:250.1,y:350.8,z:146.4}, upperAttachment:{type:"CastIn",model:"Bang-It+",variant:"3/8"},
    bim:{documentGuid:"doc-123",elementId:5015,modelVersion:"2025-08-24T12:00:00Z"},
    status:"InFabrication", rev:1, estHours:1.3, actHours:0, estMatCost:52.75, actMatCost:0,
    items:[
      {sku:"P1000",desc:"Unistrut Channel P1000",uom:"ft",qty:2.4},
      {sku:"ROD-3/8",desc:"Threaded Rod 3/8",uom:"ft",qty:2.1},
      {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:4},
      {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1}
    ]
  },

  // PKG-019 (L3-RADIOLOGY) - InProduction state  
  {
    id:"HNG-1058", projectId:"PRJ-001", name:"HNG-SEISMIC-RACK-6R-P5000-3/4ROD-L3-RAD", type:"Seismic",
    system:"Medical", service:"Shielding", level:"L3", grid:"A4", zone:"RAD", elevationFt:14.8,
    coordinates:{x:100.2,y:400.5,z:177.6}, upperAttachment:{type:"Wedge",model:"Power-Stud+",variant:"3/4"},
    bim:{documentGuid:"doc-123",elementId:5016,modelVersion:"2025-08-24T12:00:00Z"},
    status:"InProduction", rev:1, estHours:3.5, actHours:2.1, estMatCost:145.80, actMatCost:87.25,
    items:[
      {sku:"P5000",desc:"Unistrut Channel P5000",uom:"ft",qty:8.0},
      {sku:"ROD-3/4",desc:"Threaded Rod 3/4",uom:"ft",qty:6.5},
      {sku:"SEIS-BRACE",desc:"Seismic Brace",uom:"ea",qty:3},
      {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:12}
    ]
  },
  {
    id:"HNG-1059", projectId:"PRJ-001", name:"HNG-CLEVIS-4R-5/8ROD-L3-RAD", type:"Clevis",
    system:"HVAC", service:"Exhaust", level:"L3", grid:"B4", zone:"RAD", elevationFt:12.5,
    coordinates:{x:125.5,y:425.8,z:150.0}, upperAttachment:{type:"CastIn",model:"Bang-It+",variant:"5/8"},
    bim:{documentGuid:"doc-123",elementId:5017,modelVersion:"2025-08-24T12:00:00Z"},
    status:"InProduction", rev:1, estHours:2.2, actHours:1.5, estMatCost:82.40, actMatCost:55.80,
    items:[
      {sku:"ROD-5/8",desc:"Threaded Rod 5/8",uom:"ft",qty:4.8},
      {sku:"CLV-LRG",desc:"Large Clevis Hanger",uom:"ea",qty:2},
      {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:10},
      {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:8}
    ]
  },
  {
    id:"HNG-1060", projectId:"PRJ-001", name:"HNG-TRAP-3R-P3000-1/2ROD-L3-RAD", type:"Trapeze",
    system:"Plumbing", service:"Medical", level:"L3", grid:"C4", zone:"RAD", elevationFt:13.2,
    coordinates:{x:150.8,y:450.1,z:158.4}, upperAttachment:{type:"Screw",model:"UltraCon+",variant:"1/2"},
    bim:{documentGuid:"doc-123",elementId:5018,modelVersion:"2025-08-24T12:00:00Z"},
    status:"InProduction", rev:1, estHours:1.8, actHours:1.0, estMatCost:68.90, actMatCost:38.25,
    items:[
      {sku:"P3000",desc:"Unistrut Channel P3000",uom:"ft",qty:4.2},
      {sku:"ROD-1/2",desc:"Threaded Rod 1/2",uom:"ft",qty:3.6},
      {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:6},
      {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1}
    ]
  },

  // Additional hangers for other packages...
  {
    id:"HNG-1061", projectId:"PRJ-001", name:"HNG-CLEVIS-2R-3/8ROD-L4-WEST", type:"Clevis",
    system:"HVAC", service:"Return", level:"L4", grid:"A6", zone:"WEST", elevationFt:11.5,
    coordinates:{x:75.2,y:500.3,z:138.0}, upperAttachment:{type:"Screw",model:"UltraCon+",variant:"3/8"},
    bim:{documentGuid:"doc-123",elementId:5019,modelVersion:"2025-08-24T12:00:00Z"},
    status:"Inspection", rev:1, estHours:1.2, actHours:1.2, estMatCost:45.60, actMatCost:45.60,
    items:[
      {sku:"ROD-3/8",desc:"Threaded Rod 3/8",uom:"ft",qty:2.5},
      {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
      {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:6},
      {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:4}
    ]
  },

  // Data Center hangers for additional workflow states
  {
    id:"HNG-6013", projectId:"PRJ-006", name:"HNG-RACK-8R-P5000-3/4ROD-L1-SEC", type:"Rack",
    system:"Security", service:"Monitoring", level:"L1", grid:"S1", zone:"SEC", elevationFt:15.0,
    coordinates:{x:800.0,y:100.0,z:180.0}, upperAttachment:{type:"CastIn",model:"Bang-It+",variant:"3/4"},
    bim:{documentGuid:"doc-678",elementId:8000,modelVersion:"2025-08-24T12:00:00Z"},
    status:"QA", rev:1, estHours:3.8, actHours:3.8, estMatCost:165.75, actMatCost:165.75,
    items:[
      {sku:"P5000",desc:"Unistrut Channel P5000",uom:"ft",qty:10.0},
      {sku:"ROD-3/4",desc:"Threaded Rod 3/4",uom:"ft",qty:7.5},
      {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:16},
      {sku:"ANCH-SET",desc:"Anchor (per attachment)",uom:"ea",qty:4}
    ]
  },
  {
    id:"HNG-6014", projectId:"PRJ-006", name:"HNG-CLEVIS-3R-5/8ROD-L1-SEC", type:"Clevis",
    system:"Fire", service:"Detection", level:"L1", grid:"S2", zone:"SEC", elevationFt:12.8,
    coordinates:{x:825.5,y:125.3,z:153.6}, upperAttachment:{type:"Wedge",model:"Power-Stud+",variant:"5/8"},
    bim:{documentGuid:"doc-678",elementId:8001,modelVersion:"2025-08-24T12:00:00Z"},
    status:"QA", rev:1, estHours:2.0, actHours:2.0, estMatCost:78.25, actMatCost:78.25,
    items:[
      {sku:"ROD-5/8",desc:"Threaded Rod 5/8",uom:"ft",qty:3.8},
      {sku:"CLV-LRG",desc:"Large Clevis Hanger",uom:"ea",qty:2},
      {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:8},
      {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:6}
    ]
  }
];