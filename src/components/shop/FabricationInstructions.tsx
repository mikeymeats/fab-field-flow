import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useDB } from '@/store/db';
import { siteManager } from '@/lib/toolsSiteManager';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  Wrench, 
  AlertTriangle,
  Camera,
  MessageSquare,
  Timer
} from 'lucide-react';

interface FabricationInstructionsProps {
  assignmentId: string;
  onStepComplete: (stepKey: string, data: any) => void;
  onToolEvent: (event: any) => void;
}

export function FabricationInstructions({ 
  assignmentId, 
  onStepComplete,
  onToolEvent 
}: FabricationInstructionsProps) {
  const { assignments, hangers } = useDB();
  const [activeStep, setActiveStep] = useState(0);
  const [stepData, setStepData] = useState<Record<string, any>>({});
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [stepTimer, setStepTimer] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  const assignment = assignments.find(a => a.id === assignmentId);
  const hanger = assignment ? hangers.find(h => h.id === assignment.hangerId) : null;
  
  if (!assignment || !hanger) return null;
  
  // Enhanced fabrication steps with detailed instructions
  const fabricationSteps = [
    {
      key: 'RodCut',
      title: 'Cut Threaded Rod',
      description: 'Cut threaded rod to specified length',
      estimatedTime: 5,
      safetyNotes: ['Wear safety glasses', 'Secure workpiece properly'],
      tools: ['RC-010'],
      instructions: [
        `Measure and mark threaded rod at 8 feet`,
        'Verify measurement twice before cutting',
        'Set up rod cutter with appropriate blade for rod diameter',
        'Make clean, square cut',
        'Check cut end for burrs and deburr if necessary',
        'Verify final length matches specification'
      ],
      qualityChecks: [
        'Length within ±1/16"',
        'Clean, square cut',
        'No burrs or sharp edges',
        'Threads not damaged'
      ],
      inputs: [
        { key: 'actualLength', label: 'Actual Length', type: 'number', unit: 'ft', required: true },
        { key: 'cutQuality', label: 'Cut Quality', type: 'text', required: false }
      ]
    },
    {
      key: 'UnistrutCut',
      title: 'Cut Support Elements',
      description: 'Cut unistrut or other support elements if required',
      estimatedTime: 3,
      safetyNotes: ['Use proper PPE', 'Check blade sharpness'],
      tools: ['UC-020'],
      instructions: [
        'Review drawing for support element requirements',
        'Measure and mark unistrut channels',
        'Set up unistrut cutter',
        'Make precise cuts at marked locations',
        'Deburr cut edges',
        'Sort cut pieces by assembly sequence'
      ],
      qualityChecks: [
        'Dimensions per drawing',
        'Clean cuts',
        'Proper sorting/labeling'
      ],
      inputs: [
        { key: 'elementsUsed', label: 'Support Elements Used', type: 'text', required: false }
      ]
    },
    {
      key: 'Assembly',
      title: 'Assemble Hanger',
      description: 'Assemble all components per drawing',
      estimatedTime: 15,
      safetyNotes: ['Use proper torque values', 'Check thread engagement'],
      tools: ['ID-030', 'TW-002'],
      instructions: [
        'Lay out all components per BOM',
        'Thread upper attachment onto rod',
        'Position at correct height per drawing',
        'Install hanger body at specified location',
        'Add washers and nuts per specification',
        'Hand-tighten all connections first',
        `Torque to specification using calibrated wrench`,
        'Verify all connections are secure',
        'Check final assembly against drawing'
      ],
      qualityChecks: [
        'All components present',
        'Proper thread engagement',
        'Torque values recorded',
        'Dimensions per drawing',
        'No damaged components'
      ],
      inputs: [
        { key: 'torqueValues', label: 'Torque Values', type: 'text', required: true },
        { key: 'finalDimensions', label: 'Final Height', type: 'number', unit: 'ft', required: true }
      ]
    },
    {
      key: 'QA',
      title: 'Quality Inspection',
      description: 'Final inspection and documentation',
      estimatedTime: 5,
      safetyNotes: ['Use proper measuring tools'],
      tools: ['TW-001'],
      instructions: [
        'Visually inspect entire assembly',
        'Verify all torque values with calibrated wrench',
        'Check dimensions against drawing',
        'Inspect for any damage or defects',
        'Take required photos for documentation',
        'Complete QA checklist',
        'Apply identification tags/labels',
        'Move to completed area'
      ],
      qualityChecks: [
        'Visual inspection complete',
        'Torque verification complete',
        'Dimensional check passed',
        'Photos taken',
        'Proper identification applied'
      ],
      inputs: [
        { key: 'finalInspection', label: 'Final Inspection Notes', type: 'text', required: false },
        { key: 'qaSignature', label: 'Inspector Initials', type: 'text', required: true }
      ]
    }
  ];
  
  const currentStep = fabricationSteps[activeStep];
  const availableTools = currentStep ? siteManager.getToolsForStation(currentStep.key as any) : [];
  
  const handleStepComplete = () => {
    if (currentStep) {
      const data = stepData[currentStep.key] || {};
      onStepComplete(currentStep.key, data);
      
      if (activeStep < fabricationSteps.length - 1) {
        setActiveStep(activeStep + 1);
        setStepTimer(0);
        setIsTimerRunning(false);
      }
    }
  };
  
  const updateStepData = (key: string, value: any) => {
    setStepData(prev => ({
      ...prev,
      [currentStep.key]: {
        ...prev[currentStep.key],
        [key]: value
      }
    }));
  };
  
  const startTimer = () => {
    setIsTimerRunning(true);
    // Timer implementation would go here
  };
  
  const pauseTimer = () => {
    setIsTimerRunning(false);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Step {activeStep + 1}: {currentStep?.title}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Est: {currentStep?.estimatedTime}min
            </Badge>
            <div className="flex items-center gap-1 text-sm">
              <Timer className="h-4 w-4" />
              {formatTime(stepTimer)}
            </div>
          </div>
        </CardTitle>
        
        {/* Step Progress */}
        <div className="flex items-center gap-2 mt-2">
          {fabricationSteps.map((step, index) => (
            <div
              key={step.key}
              className={`flex-1 h-2 rounded-full transition-colors ${
                index < activeStep ? 'bg-green-500' :
                index === activeStep ? 'bg-primary' :
                'bg-muted'
              }`}
            />
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Step Info */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-foreground mb-2">{currentStep?.description}</p>
          
          {/* Safety Notes */}
          {currentStep?.safetyNotes && currentStep.safetyNotes.length > 0 && (
            <div className="flex items-start gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div>
                <div className="text-xs font-medium text-yellow-600 mb-1">Safety Notes:</div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {currentStep.safetyNotes.map((note, index) => (
                    <li key={index}>• {note}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Timer Controls */}
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={isTimerRunning ? pauseTimer : startTimer}
              className="h-8 px-3"
            >
              {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isTimerRunning ? 'Pause' : 'Start'}
            </Button>
            <span className="text-xs text-muted-foreground">
              Target: {currentStep?.estimatedTime} minutes
            </span>
          </div>
        </div>
        
        {/* Instructions */}
        <div className="space-y-3">
          <h4 className="font-medium">Instructions:</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {currentStep?.instructions.map((instruction, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-muted-foreground">{instruction}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Tool Selection */}
        {availableTools.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Required Tools:</h4>
            <div className="flex flex-wrap gap-2">
              {availableTools.map(tool => (
                <Button
                  key={tool.id}
                  variant={selectedTool === tool.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTool(tool.id)}
                  className="text-xs"
                >
                  {tool.id} - {tool.name}
                </Button>
              ))}
            </div>
            
            {selectedTool && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onToolEvent({
                    assignmentId,
                    station: currentStep?.key,
                    toolId: selectedTool,
                    event: 'start'
                  })}
                >
                  Start Tool
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onToolEvent({
                    assignmentId,
                    station: currentStep?.key,
                    toolId: selectedTool,
                    event: 'stop'
                  })}
                >
                  Stop Tool
                </Button>
              </div>
            )}
          </div>
        )}
        
        {/* Step Inputs */}
        {currentStep?.inputs && currentStep.inputs.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Measurements & Data:</h4>
            <div className="grid gap-3">
              {currentStep.inputs.map(input => (
                <div key={input.key} className="space-y-1">
                  <label className="text-sm font-medium">
                    {input.label}
                    {input.unit && ` (${input.unit})`}
                    {input.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={input.type === 'number' ? 'number' : 'text'}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm"
                    placeholder={`Enter ${input.label.toLowerCase()}`}
                    onChange={(e) => updateStepData(
                      input.key, 
                      input.type === 'number' ? Number(e.target.value) : e.target.value
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Quality Checks */}
        {currentStep?.qualityChecks && currentStep.qualityChecks.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Quality Checks:</h4>
            <div className="space-y-2">
              {currentStep.qualityChecks.map((check, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Checkbox 
                    id={`check-${index}`}
                    onChange={(checked) => updateStepData(`check_${index}`, checked)}
                  />
                  <label htmlFor={`check-${index}`} className="text-sm text-muted-foreground">
                    {check}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleStepComplete}
            className="flex-1"
            disabled={!currentStep}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Complete Step
          </Button>
          
          <Button variant="outline" size="sm">
            <Camera className="h-4 w-4 mr-2" />
            Photo
          </Button>
          
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Note
          </Button>
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
          >
            Previous Step
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveStep(Math.min(fabricationSteps.length - 1, activeStep + 1))}
            disabled={activeStep === fabricationSteps.length - 1}
          >
            Next Step
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}