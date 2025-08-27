import { LayoutGrid, Factory, Users, Wrench, Package, Boxes, ClipboardCheck, BadgeCheck, Truck, ScanLine, ListChecks, BarChart3, Settings, AlertTriangle, Activity, FileText, UserCheck, Calendar } from 'lucide-react'

export type NavItem = { label:string; to?:string; icon:any; children?:NavItem[] }
export type NavGroup = { title:string; items:NavItem[] }

export const nav: NavGroup[] = [
  {
    title: 'Projects',
    items: [
      { label:'All Projects', icon: LayoutGrid, to:'/projects' },
    ],
  },
  {
    title: 'Shop Management',
    items: [
      { 
        label:'Shop Command Center', 
        icon: Factory, 
        children: [
          { label:'Package Review', icon: FileText, to:'/shop/command-center/review' },
          { label:'Inventory Check', icon: Package, to:'/shop/command-center/inventory' },
          { label:'Crew Assignment', icon: UserCheck, to:'/shop/command-center/assignment' },
          { label:'Scheduler', icon: Calendar, to:'/shop/scheduler' },
          { label:'Exception Management', icon: AlertTriangle, to:'/shop/command-center/exceptions' },
          { label:'Production Dashboard', icon: Activity, to:'/shop/command-center/production' }
        ]
      },
      { label:'Teams / My Work',     icon: Users,   to:'/shop/team' },
      { label:'Hangers',             icon: Wrench,  to:'/shop/hangers' },
      { label:'Packages',            icon: Package, to:'/shop/packages' },
      { label:'Work Orders',         icon: ClipboardCheck, to:'/shop/work-orders' },
      { label:'Kitting',             icon: Boxes,   to:'/shop/kitting' },
      { label:'Shop QA',             icon: BadgeCheck, to:'/shop/qa' },
      { label:'Shipping',            icon: Truck,   to:'/shop/shipping' },
      { label:'Shop Analytics',      icon: BarChart3, to:'/shop/analytics' },
    ],
  },
  {
    title: 'Field Management',
    items: [
      { label:'Receiving',       icon: ScanLine,   to:'/field/receiving' },
      { label:'Crew Assignment', icon: Users,      to:'/field/crew' },
      { label:'Install Board',   icon: ListChecks, to:'/field/install' },
      { label:'Field QA',        icon: BadgeCheck, to:'/field/qa' },
      { label:'Field Analytics', icon: BarChart3,  to:'/field/analytics' },
    ],
  },
  {
    title: 'Inventory',
    items: [
      { label:'Inventory Home',  icon: Boxes,      to:'/inventory' },
      { label:'Shortages',       icon: Boxes,      to:'/inventory/shortages' },
    ],
  },
  {
    title: 'Admin',
    items: [
      { label:'Settings',        icon: Settings,   to:'/admin/settings' },
      { label:'Roles',           icon: Users,      to:'/admin/roles' },
      { label:'Templates',       icon: ClipboardCheck, to:'/admin/templates' },
      { label:'Integrations',    icon: Settings,   to:'/admin/integrations' },
    ],
  },
]