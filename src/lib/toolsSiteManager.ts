// UI-only simulation of DEWALT Site Manager data feeds for shop tools
export type ToolInfo = { 
  id: string; 
  name: string; 
  station: 'RodCut' | 'UnistrutCut' | 'Assembly' | 'ShopQA'; 
  calibrationDue?: string;
};

export const siteManager = {
  getToolsForStation(station: ToolInfo['station']): ToolInfo[] {
    const base = [
      { id: 'TW-001', name: 'DEWALT Torque Wrench', station: 'ShopQA' as const, calibrationDue: '2025-12-31' },
      { id: 'RC-010', name: 'DEWALT Rod Cutter', station: 'RodCut' as const },
      { id: 'UC-020', name: 'DEWALT Unistrut Cutter', station: 'UnistrutCut' as const },
      { id: 'ID-030', name: 'DEWALT Impact Driver', station: 'Assembly' as const },
      { id: 'TW-002', name: 'DEWALT Digital Torque Wrench', station: 'Assembly' as const, calibrationDue: '2025-11-15' },
    ];
    return base.filter(t => t.station === station);
  }
};