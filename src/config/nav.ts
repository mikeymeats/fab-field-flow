import { LayoutGrid, Factory, Users, Wrench, Package, Boxes, ClipboardCheck, BadgeCheck, Truck, ScanLine, ListChecks, BarChart3, Settings } from 'lucide-react'

export type NavItem = { label:string; to:string; icon:any }
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
      { label:'Shop Command Center', icon: Factory, to:'/shop/command-center' },
      { label:'Teams / My Work',     icon: Users,   to:'/shop/team' },
      { label:'Hangers',             icon: Wrench,  to:'/shop/hangers' },
      { label:'Packages',            icon: Package, to:'/shop/packages' },
      { label:'Scheduler',           icon: Boxes,   to:'/shop/scheduler' },
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