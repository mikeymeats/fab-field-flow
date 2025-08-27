import type { PersonaType } from '@/store/db';

export const PERSONA_PERMISSIONS: Record<PersonaType, string[]> = {
  BIMCoordinator: [
    'read:*',
    'write:bim_publish',
    'write:model_params',
  ],
  ProjectManager: [
    'read:*',
    'write:field_orders',
    'write:priorities', 
    'write:state_overrides',
    'write:approvals',
  ],
  ShopManager: [
    'read:*',
    'write:approve_for_fab',
    'write:team_assignments',
    'write:inventory_reserve',
    'write:shipments',
    'write:expedite',
  ],
  InventoryCoordinator: [
    'read:*',
    'write:inventory_levels',
    'write:reorders',
    'write:substitutions',
    'write:lot_numbers',
  ],
  KittingLead: [
    'read:packages',
    'read:pick_lists',
    'read:inventory',
    'write:kitting',
    'write:labels',
    'write:staging',
  ],
  ShopFabricator: [
    'read:assignments',
    'read:hangers',
    'read:tools',
    'write:fabrication_steps',
    'write:tool_events',
  ],
  ShopQAInspector: [
    'read:hangers',
    'read:assignments',
    'write:shop_qa',
    'write:qa_results',
    'write:rework_orders',
  ],
  ShippingCoordinator: [
    'read:packages',
    'read:shipments',
    'write:bol',
    'write:loads',
    'write:shipping_states',
  ],
  Driver: [
    'read:shipments',
    'read:stops',
    'write:delivery_scans',
    'write:signatures',
  ],
  FieldManager: [
    'read:*',
    'write:receiving',
    'write:staging',
    'write:crew_assignments',
    'write:field_qa_approval',
  ],
  Foreman: [
    'read:field_work',
    'read:crew_assignments', 
    'write:field_orders',
    'write:install_progress',
    'write:field_exceptions',
  ],
  Installer: [
    'read:install_work',
    'write:install_steps',
    'write:field_qa_capture',
  ],
  Executive: [
    'read:analytics',
    'read:dashboards',
    'read:reports',
  ],
  ITAdmin: [
    'write:*',
    'admin:*',
  ],
};

export const PERSONA_NAV_SECTIONS: Record<PersonaType, string[]> = {
  BIMCoordinator: ['projects', 'bim'],
  ProjectManager: ['projects', 'analytics', 'field'],
  ShopManager: ['projects', 'shop', 'inventory', 'shipping'],
  InventoryCoordinator: ['inventory', 'shop'],
  KittingLead: ['shop', 'inventory'],
  ShopFabricator: ['shop'],
  ShopQAInspector: ['shop'],
  ShippingCoordinator: ['shop', 'shipping'],
  Driver: ['mobile', 'shipping'],
  FieldManager: ['field', 'projects', 'analytics'],
  Foreman: ['field', 'mobile'],
  Installer: ['mobile', 'field'],
  Executive: ['analytics', 'projects'],
  ITAdmin: ['admin', 'projects', 'shop', 'field', 'analytics'],
};

export function hasPermission(userPermissions: string[], required: string): boolean {
  if (userPermissions.includes('admin:*') || userPermissions.includes('write:*')) {
    return true;
  }
  return userPermissions.includes(required) || userPermissions.includes(`${required.split(':')[0]}:*`);
}

export function canViewSection(persona: PersonaType, section: string): boolean {
  return PERSONA_NAV_SECTIONS[persona].includes(section);
}