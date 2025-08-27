import { Link } from 'react-router-dom';
import { useDB } from '@/store/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProjectsIndex() {
  const { projects, packages, hangers } = useDB();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">Manage your fabrication and field projects</p>
      </div>
      
      <div className="grid gap-6">
        {projects.map(p => {
          const pkgCount = packages.filter(x => x.projectId === p.id).length;
          const hCount = hangers.filter(x => x.projectId === p.id).length;
          
          return (
            <Link key={p.id} to={`/projects/${p.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-xl">{p.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{p.address}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="font-semibold text-2xl">{pkgCount}</span>
                      <p className="text-muted-foreground">Packages</p>
                    </div>
                    <div>
                      <span className="font-semibold text-2xl">{hCount}</span>
                      <p className="text-muted-foreground">Hangers</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">
                        {p.startDate} → {p.endDate}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}