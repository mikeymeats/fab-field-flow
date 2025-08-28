import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDB } from '@/store/db';
import { FabricationInstructions } from '@/components/shop/FabricationInstructions';
import { BOMPanel } from '@/components/shop/BOMPanel';
import { HangerDrawingViewer } from '@/components/shop/HangerDrawingViewer';
import { ToolStatusPanel } from '@/components/shop/ToolStatusPanel';

export default function TaskRunner() {
  const { assignmentId } = useParams();
  const nav = useNavigate();
  const { assignments, hangers, startAssignment, completeStep, finishAssignment, pushToolEvent } = useDB();
  const asn = assignments.find(a => a.id === assignmentId);

  if (!asn) return <div>Assignment not found.</div>;
  
  const h = hangers.find(x => x.id === asn.hangerId);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm opacity-70">Assignment</div>
          <h1 className="text-xl font-semibold">{asn.id} — {h?.name}</h1>
          <div className="text-xs opacity-70">Package {asn.packageId} • Hanger {asn.hangerId} • Team {asn.teamId || '-'}</div>
        </div>
        <div className="flex gap-2">
          {asn.state === 'Queued' && (
            <button 
              className="px-3 py-2 rounded bg-emerald-600/80 hover:bg-emerald-600" 
              onClick={() => startAssignment(asn.id)}
            >
              Start
            </button>
          )}
          {asn.state !== 'Done' && (
            <button 
              className="px-3 py-2 rounded bg-white/10 border border-white/10 hover:bg-white/20" 
              onClick={() => { 
                finishAssignment(asn.id); 
                nav('/shop/team'); 
              }}
            >
              Finish
            </button>
          )}
          <Link to="/shop/team" className="px-3 py-2 rounded bg-white/10 border border-white/10 hover:bg-white/20">
            Back
          </Link>
        </div>
      </div>

      {/* 3-Panel Layout */}
      <div className="grid lg:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
        {/* Left Panel: Fabrication Instructions */}
        <FabricationInstructions
          assignmentId={asn.id}
          onStepComplete={completeStep}
          onToolEvent={pushToolEvent}
        />
        
        {/* Center Panel: Technical Drawing */}
        <HangerDrawingViewer hangerId={asn.hangerId} />
        
        {/* Right Panel: BOM and Tools */}
        <div className="space-y-4">
          <BOMPanel 
            hangerId={asn.hangerId}
            onItemVerified={(itemId, verified) => {
              // Handle BOM item verification
              console.log('BOM item verified:', itemId, verified);
            }}
          />
          <ToolStatusPanel 
            assignmentId={asn.id}
            currentStation={asn.steps.find(s => !s.complete)?.key}
            onToolSelected={(toolId) => {
              console.log('Tool selected:', toolId);
            }}
          />
        </div>
      </div>
    </div>
  );
}