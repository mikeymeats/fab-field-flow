// Additional hangers for all projects - appends to seed.ts hangers array
export const additionalHangers = [
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
    },

    // ---------- PRJ-002 Hangers (Downtown Office Complex) ----------
    // PKG-101 (B1-PARKING)
    {
      id:"HNG-2000", projectId:"PRJ-002", name:"HNG-RACK-6R-P3000-5/8ROD-B1-PARK", type:"Rack",
      system:"HVAC", service:"Exhaust", level:"B1", grid:"A1", zone:"PARK", elevationFt:9.0,
      coordinates:{x:100.0,y:200.0,z:108.0}, upperAttachment:{type:"CastIn",model:"Bang-It+",variant:"5/8"},
      bim:{documentGuid:"doc-456",elementId:6000,modelVersion:"2025-08-24T12:00:00Z"},
      status:"Planned", rev:1, estHours:3.0, actHours:0, estMatCost:125.50, actMatCost:0,
      items:[
        {sku:"P3000",desc:"Unistrut Channel P3000",uom:"ft",qty:8.0},
        {sku:"ROD-5/8",desc:"Threaded Rod 5/8",uom:"ft",qty:5.2},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:12},
        {sku:"ANCH-SET",desc:"Anchor (per attachment)",uom:"ea",qty:3}
      ]
    },
    {
      id:"HNG-2001", projectId:"PRJ-002", name:"HNG-CLEVIS-2R-1/2ROD-B1-PARK", type:"Clevis",
      system:"Fire", service:"Sprinkler", level:"B1", grid:"B2", zone:"PARK", elevationFt:10.2,
      coordinates:{x:150.0,y:225.0,z:122.4}, upperAttachment:{type:"Wedge",model:"Power-Stud+",variant:"1/2"},
      bim:{documentGuid:"doc-456",elementId:6001,modelVersion:"2025-08-24T12:00:00Z"},
      status:"Planned", rev:1, estHours:1.5, actHours:0, estMatCost:65.25, actMatCost:0,
      items:[
        {sku:"ROD-1/2",desc:"Threaded Rod 1/2",uom:"ft",qty:3.0},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
        {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:6},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:4}
      ]
    },
    {
      id:"HNG-2002", projectId:"PRJ-002", name:"HNG-TRAP-4R-P1000-3/8ROD-B1-PARK", type:"Trapeze",
      system:"Plumbing", service:"Domestic", level:"B1", grid:"C3", zone:"PARK", elevationFt:8.5,
      coordinates:{x:200.0,y:250.0,z:102.0}, upperAttachment:{type:"CastIn",model:"Bang-It+",variant:"3/8"},
      bim:{documentGuid:"doc-456",elementId:6002,modelVersion:"2025-08-24T12:00:00Z"},
      status:"Planned", rev:1, estHours:2.0, actHours:0, estMatCost:78.60, actMatCost:0,
      items:[
        {sku:"P1000",desc:"Unistrut Channel P1000",uom:"ft",qty:4.2},
        {sku:"ROD-3/8",desc:"Threaded Rod 3/8",uom:"ft",qty:3.5},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:8},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:2}
      ]
    },

    // Continue with more hangers...
    // PKG-102 (L1-RETAIL)
    {
      id:"HNG-2003", projectId:"PRJ-002", name:"HNG-CLEVIS-1R-3/8ROD-L1-RETAIL", type:"Clevis",
      system:"HVAC", service:"Supply", level:"L1", grid:"D1", zone:"RETAIL", elevationFt:12.0,
      coordinates:{x:75.0,y:100.0,z:144.0}, upperAttachment:{type:"Screw",model:"UltraCon+",variant:"3/8"},
      bim:{documentGuid:"doc-456",elementId:6003,modelVersion:"2025-08-24T12:00:00Z"},
      status:"Planned", rev:1, estHours:1.0, actHours:0, estMatCost:38.90, actMatCost:0,
      items:[
        {sku:"ROD-3/8",desc:"Threaded Rod 3/8",uom:"ft",qty:2.2},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
        {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:4},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:2}
      ]
    },
    {
      id:"HNG-2004", projectId:"PRJ-002", name:"HNG-TRAP-2R-P1000-1/2ROD-L1-RETAIL", type:"Trapeze",
      system:"HVAC", service:"Return", level:"L1", grid:"E2", zone:"RETAIL", elevationFt:13.5,
      coordinates:{x:125.0,y:125.0,z:162.0}, upperAttachment:{type:"CastIn",model:"Bang-It+",variant:"1/2"},
      bim:{documentGuid:"doc-456",elementId:6004,modelVersion:"2025-08-24T12:00:00Z"},
      status:"Planned", rev:1, estHours:1.5, actHours:0, estMatCost:55.80, actMatCost:0,
      items:[
        {sku:"P1000",desc:"Unistrut Channel P1000",uom:"ft",qty:2.6},
        {sku:"ROD-1/2",desc:"Threaded Rod 1/2",uom:"ft",qty:2.3},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:6},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1}
      ]
    },
    {
      id:"HNG-2005", projectId:"PRJ-002", name:"HNG-SEISMIC-CLEVIS-1R-1/2ROD-L1-RETAIL", type:"Seismic",
      system:"Fire", service:"Sprinkler", level:"L1", grid:"F3", zone:"RETAIL", elevationFt:11.8,
      coordinates:{x:175.0,y:150.0,z:141.6}, upperAttachment:{type:"Wedge",model:"Power-Stud+",variant:"1/2"},
      bim:{documentGuid:"doc-456",elementId:6005,modelVersion:"2025-08-24T12:00:00Z"},
      status:"Planned", rev:1, estHours:1.8, actHours:0, estMatCost:72.40, actMatCost:0,
      items:[
        {sku:"ROD-1/2",desc:"Threaded Rod 1/2",uom:"ft",qty:2.8},
        {sku:"CLV-STD",desc:"Clevis Hanger",uom:"ea",qty:1},
        {sku:"SEIS-BRACE",desc:"Seismic Brace",uom:"ea",qty:1},
        {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:4}
      ]
    },

    // ---------- PRJ-003 Hangers (Manufacturing Plant - Completed) ----------
    // PKG-201 (PROC-ZA)  
    {
      id:"HNG-3000", projectId:"PRJ-003", name:"HNG-RACK-8R-P5000-3/4ROD-L1-ZA", type:"Rack",
      system:"Process", service:"Steam", level:"L1", grid:"A1", zone:"ZA", elevationFt:15.0,
      coordinates:{x:500.0,y:100.0,z:180.0}, upperAttachment:{type:"CastIn",model:"Bang-It+",variant:"3/4"},
      bim:{documentGuid:"doc-789",elementId:7000,modelVersion:"2025-08-24T12:00:00Z"},
      status:"Delivered", rev:1, estHours:4.5, actHours:4.2, estMatCost:185.75, actMatCost:178.20,
      items:[
        {sku:"P5000",desc:"Unistrut Channel P5000",uom:"ft",qty:12.0},
        {sku:"ROD-3/4",desc:"Threaded Rod 3/4",uom:"ft",qty:8.5},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:16},
        {sku:"ANCH-SET",desc:"Anchor (per attachment)",uom:"ea",qty:4}
      ]
    },
    {
      id:"HNG-3001", projectId:"PRJ-003", name:"HNG-CLEVIS-3R-5/8ROD-L1-ZA", type:"Clevis",
      system:"Process", service:"Chemical", level:"L1", grid:"B2", zone:"ZA", elevationFt:12.5,
      coordinates:{x:550.0,y:125.0,z:150.0}, upperAttachment:{type:"Wedge",model:"Power-Stud+",variant:"5/8"},
      bim:{documentGuid:"doc-789",elementId:7001,modelVersion:"2025-08-24T12:00:00Z"},
      status:"Delivered", rev:1, estHours:2.5, actHours:2.3, estMatCost:95.60, actMatCost:92.15,
      items:[
        {sku:"ROD-5/8",desc:"Threaded Rod 5/8",uom:"ft",qty:4.2},
        {sku:"CLV-LRG",desc:"Large Clevis Hanger",uom:"ea",qty:2},
        {sku:"WASH-FLAT",desc:"Flat Washer",uom:"ea",qty:8},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:6}
      ]
    },
    {
      id:"HNG-3002", projectId:"PRJ-003", name:"HNG-SEISMIC-TRAP-4R-P3000-1/2ROD-L1-ZA", type:"Seismic",
      system:"Utilities", service:"Compressed Air", level:"L1", grid:"C3", zone:"ZA", elevationFt:14.0,
      coordinates:{x:600.0,y:150.0,z:168.0}, upperAttachment:{type:"CastIn",model:"Bang-It+",variant:"1/2"},
      bim:{documentGuid:"doc-789",elementId:7002,modelVersion:"2025-08-24T12:00:00Z"},
      status:"Delivered", rev:1, estHours:3.0, actHours:2.8, estMatCost:128.40, actMatCost:124.10,
      items:[
        {sku:"P3000",desc:"Unistrut Channel P3000",uom:"ft",qty:6.5},
        {sku:"ROD-1/2",desc:"Threaded Rod 1/2",uom:"ft",qty:4.8},
        {sku:"SEIS-BRACE",desc:"Seismic Brace",uom:"ea",qty:2},
        {sku:"NUT-STRUT",desc:"Strut Nut",uom:"ea",qty:10}
      ]
    }
];