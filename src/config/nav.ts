import { LayoutGrid, Boxes, Package, Wrench, Factory, ClipboardCheck, Truck, Users, ScanLine, ListChecks, BarChart3, Settings, PackageCheck, BoxesIcon, BadgeCheck } from 'lucide-react'

export type NavItem = { label:string; icon:any; to?:string; children?:NavItem[]; badge?:()=>string|number|undefined }
export type NavGroup = { title:string; items:NavItem[] }

export const nav: NavGroup[] = [
  {
    title: 'Projects',
    items: [
      { label:'All Projects', icon: LayoutGrid, to:'/projects' },
    ]
  },
  {
    title: 'Shop Management',
    items: [
      { label:'Shop Manager Portal', icon: Factory, to:'/shop/manager' },
      { label:'Team/Crew', icon: Users, to:'/shop/team' },
      { label:'Hangers', icon: Wrench, to:'/shop/hangers' },
      { label:'Packages', icon: Package, to:'/shop/packages' },
      { label:'Scheduler', icon: Boxes, to:'/shop/scheduler' },
      { label:'Work Orders', icon: ClipboardCheck, to:'/shop/work-orders' },
      { label:'Kitting', icon: BoxesIcon, to:'/shop/kitting' },
      { label:'Shop QA', icon: BadgeCheck, to:'/shop/qa' },
      { label:'Shipping', icon: Truck, to:'/shop/shipping' },
      { label:'Analytics', icon: BarChart3, to:'/shop/analytics' }
    ]
  },
  {
    title: 'Field Management',
    items: [
      { label:'Receiving', icon: ScanLine, to:'/field/receiving' },
      { label:'Crew Assignment', icon: Users, to:'/field/crew' },
      { label:'Install Board', icon: ListChecks, to:'/field/install' },
      { label:'Field QA', icon: BadgeCheck, to:'/field/qa' },
      { label:'Field Analytics', icon: BarChart3, to:'/field/analytics' }
    ]
  },
  {
    title: 'Admin',
    items: [
      { label:'Settings', icon: Settings, to:'/admin/settings' }
    ]
  }
]