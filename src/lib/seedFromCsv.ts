export type CsvRow = Record<string, string>;

export function idFromBim(docGuid: string, elementId: string | number) {
  const s = `${docGuid}:${elementId}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return 'HNG-' + h.toString(36).toUpperCase();
}

export function mapCsvRow(r: CsvRow) {
  return {
    id: idFromBim(r.BimDocumentGuid, r.BimElementId),
    projectId: r.ProjectId,
    name: r.Name,
    type: r.Type,
    system: r.System,
    service: r.Service,
    level: r.Level,
    grid: r.Grid,
    zone: r.Zone,
    elevationFt: Number(r.ElevationFt || 0),
    coordinates: {
      x: Number(r.X || 0),
      y: Number(r.Y || 0),
      z: Number(r.Z || 0)
    },
    upperAttachment: {
      type: r.UpperAttachmentType || 'Unknown',
      model: r.UpperAttachmentModel,
      variant: r.UpperAttachmentVariant
    },
    hangerSize: r.HangerSize,
    rodSize1: r.RodSize1,
    totalRodLength1Ft: Number(r.TotalRodLength1Ft || 0),
    rodExtensionIn: Number(r.RodExtensionIn || 0),
    bim: {
      documentGuid: r.BimDocumentGuid,
      elementId: Number(r.BimElementId),
      modelVersion: r.ModelVersion
    },
    status: 'ApprovedForFab',
    rev: 1,
    estHours: 1.2,
    actHours: 0,
    estMatCost: 45,
    actMatCost: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}