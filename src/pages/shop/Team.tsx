import { Link } from 'react-router-dom';
import { useDB } from '@/store/db';

export default function TeamHome() {
  const { assignments, teams, activeProjectId } = useDB();
  
  const byTeam = new Map<string, number>();
  assignments.filter(a => a.projectId === activeProjectId).forEach(a => {
    if (!a.teamId) return;
    byTeam.set(a.teamId, (byTeam.get(a.teamId) || 0) + 1);
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Team & Crew</h1>
      
      <div className="grid md:grid-cols-3 gap-4">
        {teams.map(t => {
          const count = byTeam.get(t.id) || 0;
          return (
            <div key={t.id} className="border border-neutral-800 rounded-xl p-4">
              <div className="font-medium">{t.name}</div>
              <div className="text-xs opacity-70 mt-1">
                Stations: {t.stations.join(', ')}
              </div>
              <div className="text-xs opacity-70 mt-1">
                Members: {t.members.map(m => m.name).join(', ')}
              </div>
              <div className="mt-2 text-sm">
                <b>{count}</b> assignments
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="text-lg font-semibold mt-6">My Work (All Assignments)</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left opacity-70">
            <tr>
              <th className="py-2">Assignment</th>
              <th>Package</th>
              <th>Hanger</th>
              <th>Team</th>
              <th>Priority</th>
              <th>State</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {assignments
              .filter(a => a.projectId === activeProjectId)
              .map(a => {
                return (
                  <tr key={a.id} className="border-t border-neutral-800">
                    <td className="py-2">{a.id}</td>
                    <td>{a.packageId}</td>
                    <td>{a.hangerId}</td>
                    <td>{a.teamId || '-'}</td>
                    <td>
                      <span className={`px-2 py-1 rounded text-xs ${
                        a.priority === 'High' ? 'bg-red-900/50 text-red-200' :
                        a.priority === 'Med' ? 'bg-yellow-900/50 text-yellow-200' :
                        'bg-green-900/50 text-green-200'
                      }`}>
                        {a.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`px-2 py-1 rounded text-xs ${
                        a.state === 'Done' ? 'bg-green-900/50 text-green-200' :
                        a.state === 'InProgress' ? 'bg-blue-900/50 text-blue-200' :
                        a.state === 'QA' ? 'bg-purple-900/50 text-purple-200' :
                        'bg-neutral-800 text-neutral-200'
                      }`}>
                        {a.state}
                      </span>
                    </td>
                    <td className="text-right">
                      <Link 
                        to={`/shop/task/${a.id}`} 
                        className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}