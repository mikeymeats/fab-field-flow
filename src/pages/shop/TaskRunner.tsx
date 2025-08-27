import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDB } from '@/store/db';
import { siteManager } from '@/lib/toolsSiteManager';
import { useState } from 'react';

export default function TaskRunner() {
  const { assignmentId } = useParams();
  const nav = useNavigate();
  const { assignments, hangers, startAssignment, completeStep, finishAssignment, pushToolEvent } = useDB();
  const asn = assignments.find(a => a.id === assignmentId);
  const [selectedTool, setTool] = useState<string>('');

  if (!asn) return <div>Assignment not found.</div>;
  
  const h = hangers.find(x => x.id === asn.hangerId);

  return (
    <div className="space-y-4">
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

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Steps */}
        <div className="lg:col-span-2 border border-neutral-800 rounded-xl">
          <div className="p-3 border-b border-neutral-800 font-medium">Work Steps</div>
          <div className="p-3 space-y-3">
            {asn.steps.map(step => {
              const tools = siteManager.getToolsForStation(step.key as any);
              return (
                <div key={step.key} className="border border-neutral-800 rounded p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{step.label}</div>
                    <div className="text-xs">
                      {step.complete ? '✅ done' : '⏳ pending'}
                    </div>
                  </div>
                  <div className="mt-2 text-xs opacity-70">
                    Required tools: {tools.map(t => t.name).join(', ') || '—'}
                  </div>

                  {/* Tool simulator */}
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <select 
                      className="bg-transparent border border-neutral-700 rounded px-2 py-1" 
                      onChange={e => setTool(e.target.value)} 
                      defaultValue=""
                    >
                      <option value="" disabled>Select a tool</option>
                      {tools.map(t => (
                        <option key={t.id} value={t.id}>{t.id} — {t.name}</option>
                      ))}
                    </select>
                    <button 
                      className="text-xs px-2 py-1 rounded bg-emerald-900/50 text-emerald-200 hover:bg-emerald-900/70" 
                      onClick={() => selectedTool && pushToolEvent({ 
                        assignmentId: asn.id, 
                        station: step.key as any, 
                        toolId: selectedTool, 
                        event: 'start' 
                      })}
                    >
                      Start Tool
                    </button>
                    <button 
                      className="text-xs px-2 py-1 rounded bg-red-900/50 text-red-200 hover:bg-red-900/70" 
                      onClick={() => selectedTool && pushToolEvent({ 
                        assignmentId: asn.id, 
                        station: step.key as any, 
                        toolId: selectedTool, 
                        event: 'stop' 
                      })}
                    >
                      Stop Tool
                    </button>
                  </div>

                  {/* Inputs */}
                  <div className="mt-3 grid sm:grid-cols-2 gap-2">
                    {(step.inputs || []).map(inp => {
                      return (
                        <div key={inp.key} className="text-sm">
                          <label className="block text-xs opacity-70 mb-1">
                            {inp.label}{inp.unit ? ` (${inp.unit})` : ''}
                          </label>
                          <input
                            type={inp.type === 'number' ? 'number' : 'text'}
                            className="w-full bg-transparent border border-neutral-700 rounded px-2 py-2"
                            onChange={(e) => (step as any)._val = { 
                              ...(step as any)._val, 
                              [inp.key]: inp.type === 'number' ? Number(e.target.value) : e.target.value 
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3">
                    {!step.complete && (
                      <button 
                        className="px-3 py-2 rounded bg-white/10 border border-white/10 hover:bg-white/20"
                        onClick={() => {
                          const data = (step as any)._val || {};
                          completeStep(asn.id, step.key, data);
                        }}
                      >
                        Mark Step Complete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hanger / QA context */}
        <div className="border border-neutral-800 rounded-xl">
          <div className="p-3 border-b border-neutral-800 font-medium">Hanger Context</div>
          <div className="p-3 text-sm space-y-1">
            <div><b>Type:</b> {h?.type}</div>
            <div><b>System/Service:</b> {h?.system} / {h?.service}</div>
            <div><b>Level/Zone:</b> {h?.level} / {h?.zone}</div>
            <div><b>Upper Attachment:</b> {h?.upperAttachment?.model}</div>
            <div><b>Grid:</b> {h?.grid}</div>
            <div><b>Elevation:</b> {h?.elevationFt} ft</div>
          </div>

          <div className="p-3 border-t border-neutral-800">
            <div className="font-medium mb-2">Torque Entry (QA)</div>
            <input 
              type="number" 
              placeholder="Torque (ft·lb)" 
              className="w-full bg-transparent border border-neutral-700 rounded px-2 py-2 mb-2"
              onChange={(e) => (asn as any)._torque = Number(e.target.value)}
            />
            <button 
              className="w-full px-3 py-2 rounded bg-emerald-600/80 hover:bg-emerald-600"
              onClick={() => {
                const tq = (asn as any)._torque || 0;
                pushToolEvent({ 
                  assignmentId: asn.id, 
                  station: 'ShopQA', 
                  toolId: 'TW-001', 
                  event: 'torque', 
                  value: tq 
                });
                alert(`Torque recorded: ${tq} ft·lb`);
              }}
            >
              Record Torque
            </button>
          </div>

          {/* Tool Events Log */}
          <div className="p-3 border-t border-neutral-800">
            <div className="font-medium mb-2">Tool Events</div>
            <div className="max-h-32 overflow-auto text-xs space-y-1">
              {asn.toolEvents.map(te => (
                <div key={te.id} className="flex justify-between opacity-70">
                  <span>{te.toolId} - {te.event}</span>
                  <span>{te.value}</span>
                </div>
              ))}
              {asn.toolEvents.length === 0 && (
                <div className="opacity-50">No tool events yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}