'use client';

import { useState, useEffect } from 'react';
import { HelpCircle, Grid3X3, ExternalLink, MapPin, Users, Check, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ─── Risk Assessment multi-step sheet ──────────────────────────────────────

const RISK_STEPS = [
  { id: 'project',   label: 'Project' },
  { id: 'financial', label: 'Financial' },
  { id: 'risk',      label: 'Risk' },
  { id: 'summary',   label: 'Summary' },
] as const;

type RiskStep = typeof RISK_STEPS[number]['id'];

const RISK_CATEGORIES = [
  'Health & Safety Risk',
  'Design Liability',
  'Complex Construction',
  'Contractual Risk',
  'Supply Chain Risk',
  'None',
  'Other',
] as const;

const SUMMARY_ROWS = [
  { category: 'Boundaries of Work', status: 'Within scope', statusColor: 'bg-green-500', notes: 'Services align with approved delivery scope' },
  { category: 'Payment Terms',      status: 'Risk',         statusColor: 'bg-amber-400', notes: '90 day payment period' },
  { category: 'Insurance',          status: 'Standard',     statusColor: 'bg-green-500', notes: 'Coverage confirmed' },
  { category: 'Delivery Complexity',status: 'Moderate',     statusColor: 'bg-amber-400', notes: 'Multiple subcontractors' },
];

function RiskAssessmentSheet({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<RiskStep>('project');

  // Project step state
  const [projectScope, setProjectScope] = useState('');
  const [startDate, setStartDate] = useState('25/01/26');
  const [endDate, setEndDate] = useState('25/01/26');
  const [jointVenture, setJointVenture] = useState<'yes' | 'no'>('no');
  const [cbreReferred, setCbreReferred] = useState<'yes' | 'no'>('no');

  // Financial step state
  const [estimatedFee, setEstimatedFee] = useState('500,000');
  const [margin, setMargin] = useState('20');
  const [probabilityOfWinning, setProbabilityOfWinning] = useState('20');
  const [proposalDate, setProposalDate] = useState('25/01/26');

  // Risk step state
  const [boundaries, setBoundaries] = useState<'yes' | 'no' | 'not_sure'>('no');
  const [riskGuidanceReviewed, setRiskGuidanceReviewed] = useState<'yes' | 'no'>('no');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [otherText, setOtherText] = useState('');

  // Summary step state
  const [note, setNote] = useState('');

  const currentIndex = RISK_STEPS.findIndex(s => s.id === step);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const goNext = () => {
    const next = RISK_STEPS[currentIndex + 1];
    if (next) setStep(next.id);
  };

  const goToStep = (id: RiskStep) => {
    const targetIndex = RISK_STEPS.findIndex(s => s.id === id);
    if (targetIndex <= currentIndex) setStep(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="w-[660px] bg-white flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Create Risk Assessment Record</h2>
        </div>

        {/* Body: left stepper + right content */}
        <div className="flex flex-1 min-h-0">
          {/* Left stepper column */}
          <div className="w-44 bg-gray-50 border-r border-border flex-shrink-0 pt-6">
            <nav className="flex flex-col">
              {RISK_STEPS.map((s, i) => {
                const isCompleted = i < currentIndex;
                const isCurrent  = s.id === step;
                const isReachable = i <= currentIndex;
                return (
                  <button
                    key={s.id}
                    onClick={() => isReachable && goToStep(s.id)}
                    disabled={!isReachable}
                    className={`flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${
                      isCurrent  ? 'bg-white border-r-2 border-[#4a90d9] text-[#4a90d9] font-semibold' : ''
                    } ${
                      isCompleted ? 'text-foreground cursor-pointer hover:bg-white/60' : ''
                    } ${
                      !isCurrent && !isCompleted ? 'text-muted-foreground cursor-not-allowed' : ''
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      isCompleted ? 'bg-green-500 text-white' : ''
                    } ${
                      isCurrent  ? 'bg-[#4a90d9] text-white' : ''
                    } ${
                      !isCompleted && !isCurrent ? 'bg-gray-200 text-gray-400' : ''
                    }`}>
                      {isCompleted ? <Check size={12} /> : i + 1}
                    </span>
                    {s.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right content */}
          <div className="flex-1 overflow-y-auto p-6">

            {/* STEP 1: Project */}
            {step === 'project' && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Project Scope
                  </Label>
                  <textarea
                    value={projectScope}
                    onChange={e => setProjectScope(e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-border rounded text-sm bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[#4a90d9]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Start Date
                  </Label>
                  <Input value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-white" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    End Date
                  </Label>
                  <Input value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-white" />
                </div>
                <fieldset className="space-y-2">
                  <legend className="text-sm font-medium text-foreground mb-2">Joint venture?</legend>
                  {(['yes', 'no'] as const).map(v => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="jv" value={v} checked={jointVenture === v}
                        onChange={() => setJointVenture(v)}
                        className="accent-[#4a90d9]" />
                      <span className="text-sm capitalize">{v}</span>
                    </label>
                  ))}
                </fieldset>
                <fieldset className="space-y-2">
                  <legend className="text-sm font-medium text-foreground mb-2">CBRE Referred?</legend>
                  {(['yes', 'no'] as const).map(v => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="cbre" value={v} checked={cbreReferred === v}
                        onChange={() => setCbreReferred(v)}
                        className="accent-[#4a90d9]" />
                      <span className="text-sm capitalize">{v}</span>
                    </label>
                  ))}
                </fieldset>
              </div>
            )}

            {/* STEP 2: Financial */}
            {step === 'financial' && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Estimated Fee
                  </Label>
                  <div className="flex gap-2">
                    <Input value={estimatedFee} onChange={e => setEstimatedFee(e.target.value)} className="bg-white flex-1" />
                    <span className="flex items-center px-3 border border-border rounded bg-gray-50 text-sm text-muted-foreground">USD</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Margin
                  </Label>
                  <div className="flex gap-2">
                    <Input value={margin} onChange={e => setMargin(e.target.value)} className="bg-white flex-1" />
                    <span className="flex items-center px-3 border border-border rounded bg-gray-50 text-sm text-muted-foreground">%</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Probability of Winning
                  </Label>
                  <div className="flex gap-2">
                    <Input value={probabilityOfWinning} onChange={e => setProbabilityOfWinning(e.target.value)} className="bg-white flex-1" />
                    <span className="flex items-center px-3 border border-border rounded bg-gray-50 text-sm text-muted-foreground">%</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Proposal Date
                  </Label>
                  <Input value={proposalDate} onChange={e => setProposalDate(e.target.value)} className="bg-white" />
                </div>
              </div>
            )}

            {/* STEP 3: Risk */}
            {step === 'risk' && (
              <div className="space-y-6">
                <fieldset className="space-y-2">
                  <legend className="text-sm font-medium text-foreground mb-3">
                    Is the project within Turner &amp; Townsend / CBRE boundaries of work?
                  </legend>
                  {([['yes','Yes'],['no','No'],['not_sure','Not Sure']] as const).map(([v, label]) => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="boundaries" value={v} checked={boundaries === v}
                        onChange={() => setBoundaries(v)}
                        className="accent-[#4a90d9]" />
                      <span className="text-sm">{label}</span>
                    </label>
                  ))}
                </fieldset>

                <fieldset className="space-y-2">
                  <legend className="text-sm font-medium text-foreground mb-3">
                    Has the Opportunity Risk Guidance been reviewed?
                  </legend>
                  {(['yes','no'] as const).map(v => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="reviewed" value={v} checked={riskGuidanceReviewed === v}
                        onChange={() => setRiskGuidanceReviewed(v)}
                        className="accent-[#4a90d9]" />
                      <span className="text-sm capitalize">{v}</span>
                    </label>
                  ))}
                </fieldset>

                <fieldset>
                  <legend className="text-sm font-medium text-foreground mb-3">
                    Risk Categories Identified (Multiple Select)
                  </legend>
                  <div className="grid grid-cols-2 gap-2">
                    {RISK_CATEGORIES.filter(c => c !== 'Other').map(cat => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={selectedCategories.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                          className="accent-[#4a90d9]" />
                        <span className="text-sm">{cat}</span>
                      </label>
                    ))}
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer mt-2">
                    <input type="checkbox" checked={selectedCategories.includes('Other')}
                      onChange={() => toggleCategory('Other')}
                      className="accent-[#4a90d9]" />
                    <span className="text-sm">Other</span>
                  </label>
                  {selectedCategories.includes('Other') && (
                    <textarea
                      value={otherText}
                      onChange={e => setOtherText(e.target.value)}
                      rows={3}
                      placeholder="Please specify..."
                      className="mt-2 w-full p-3 border border-border rounded text-sm bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[#4a90d9]"
                    />
                  )}
                </fieldset>
              </div>
            )}

            {/* STEP 4: Summary */}
            {step === 'summary' && (
              <div className="space-y-6">
                {/* Risk table */}
                <div className="border border-border rounded overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-border">
                        <th className="text-left px-3 py-2 font-semibold text-xs uppercase text-muted-foreground">Risk Category</th>
                        <th className="text-left px-3 py-2 font-semibold text-xs uppercase text-muted-foreground">Status</th>
                        <th className="text-left px-3 py-2 font-semibold text-xs uppercase text-muted-foreground">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SUMMARY_ROWS.map((row, i) => (
                        <tr key={i} className="border-b border-border last:border-0">
                          <td className="px-3 py-2.5 text-foreground">{row.category}</td>
                          <td className="px-3 py-2.5">
                            <span className="flex items-center gap-1.5">
                              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${row.statusColor}`} />
                              {row.status}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-muted-foreground">{row.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Approvers */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Approvers for this Opportunity are:</p>
                  <div className="flex gap-3">
                    {[{ initials: 'JD', name: 'John Douglas', title: 'Associate Director', location: 'London' },
                      { initials: 'MW', name: 'Mary Watkins',  title: 'Director',            location: 'London' }
                    ].map(person => (
                      <div key={person.name} className="flex items-center gap-2 border border-border rounded p-2.5 flex-1">
                        <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-blue-800">{person.initials}</span>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[#4a90d9]">{person.name}</div>
                          <div className="text-xs text-muted-foreground">{person.title}</div>
                          <div className="text-xs text-muted-foreground">{person.location}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Note */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">
                    Attach a note to this risk assessment:
                  </Label>
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-border rounded text-sm bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[#4a90d9]"
                  />
                </div>

                {/* Disclaimer */}
                <div className="space-y-2 text-xs text-muted-foreground border-t border-border pt-4">
                  <p>Please review the opportunity risk assessment before submitting for approval.</p>
                  <p>This step is intended to identify any known risks associated with pursuing the opportunity and confirm that the engagement is appropriate to progress.</p>
                  <p>Submitting this opportunity confirms that the information provided is complete and accurate to the best of your knowledge.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-white">
          <Button variant="outline" onClick={onClose} className="border-border text-foreground">
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" className="border-border text-foreground">
              Save
            </Button>
            {step !== 'summary' ? (
              <Button onClick={goNext} className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white flex items-center gap-1">
                Next <ChevronRight size={16} />
              </Button>
            ) : (
              <Button onClick={onClose} className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white">
                Create record
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Opportunity Page ───────────────────────────────────────────────────────

export default function OpportunityPage() {
  const [isRiskSheetOpen, setIsRiskSheetOpen] = useState(false);
  const [isContractSheetOpen, setIsContractSheetOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(true);

  // Hide success message after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSuccess(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1e2a5e] to-[#3d4eaa] text-white">
        <div className="px-4 py-3">
          {/* Top nav */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button className="p-1.5 hover:bg-white/10 rounded transition-colors">
                <Grid3X3 size={18} />
              </button>
              <Search size={18} className="text-white/70" />
              <div className="flex items-center gap-1.5 ml-2">
                <div className="w-5 h-5 rounded bg-amber-400 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-amber-900">H</span>
                </div>
                <span className="text-sm font-semibold tracking-wide">HIVE</span>
              </div>
              <span className="text-sm text-white/70 ml-2">Contracts App</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">Hi [User first name]</span>
              <button className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                <span className="text-xs font-medium">U</span>
              </button>
              <div className="flex items-center gap-1.5 text-sm">
                <HelpCircle size={16} />
                <span>Support</span>
              </div>
            </div>
          </div>

          {/* Title section */}
          <div>
            <h1 className="text-2xl font-semibold mb-1">HSBC</h1>
            <p className="text-white/70 text-sm">1 LOMBARD STREET · LONDON</p>
          </div>
        </div>
      </header>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mx-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-green-800 font-medium">Opportunity record created successfully</span>
            </div>
            <button onClick={() => setShowSuccess(false)} className="text-green-600 hover:text-green-700">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 px-4 py-6">
        {/* Next Step Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-2">Next step: Complete a Risk Assessment</h2>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            A risk assessment is required on this opportunity before assigning contracts. You can create and manage your contracts here, but a risk assessment must be completed to progress the opportunity. It is a 1 to 1 relationship.
          </p>
          <div className="flex gap-3">
            <Button
              onClick={() => setIsRiskSheetOpen(true)}
              className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white font-medium"
            >
              Create a Risk
            </Button>
            <Button
              onClick={() => setIsContractSheetOpen(true)}
              variant="outline"
              className="border-[#4a90d9] text-[#4a90d9] hover:bg-blue-50"
            >
              Create a Contract
            </Button>
          </div>
        </Card>

        {/* Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - General Information */}
          <Card className="bg-white border border-border p-6 col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              General Information
            </h3>

            <div className="space-y-6">
              {/* Client */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Client
                </h4>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded bg-red-100 flex items-center justify-center flex-shrink-0">
                    <div className="text-center">
                      <div className="text-red-600 font-bold text-xl leading-none">H</div>
                      <div className="text-red-600 font-bold text-xl leading-none">S</div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">HSBC</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      <div>123 Lombard Road</div>
                      <div>London</div>
                      <div>UK</div>
                    </div>
                    <a href="#" className="text-xs text-[#4a90d9] hover:underline mt-2 inline-flex items-center gap-1">
                      VIEW WEBSITE
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold">Client</div>
                  <div className="text-foreground">HSBC</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold">Address</div>
                  <div className="text-foreground">1 LOMBARD STREET</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold">City</div>
                  <div className="text-foreground">LONDON</div>
                </div>
              </div>

              {/* Director */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Director
                </h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold">MW</span>
                  </div>
                  <div>
                    <div className="font-semibold text-[#4a90d9]">Mary Watkins</div>
                    <div className="text-xs text-muted-foreground">London</div>
                  </div>
                </div>
              </div>

              {/* Opportunity Manager */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Opportunity Manager
                </h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-300 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold">JD</span>
                  </div>
                  <div>
                    <div className="font-semibold text-[#4a90d9]">John Douglas</div>
                    <div className="text-xs text-muted-foreground">London</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Middle Column - Pre-Engagement Records */}
          <Card className="bg-white border border-border p-6 col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6">
              Pre-Engagement Records
            </h3>

            <div className="space-y-4 text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                <MapPin size={32} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  There are no pre-engagement records linked to this engagement.
                </p>
                <p className="text-xs text-muted-foreground">
                  Use the button below to create a pre-engagement record.
                </p>
              </div>
              <Button
                onClick={() => setIsRiskSheetOpen(true)}
                className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white font-medium w-full mt-6"
              >
                Create a Risk Assessment
              </Button>
            </div>
          </Card>

          {/* Right Column - Contract Records */}
          <Card className="bg-white border border-border p-6 col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6">
              Contract Records
            </h3>

            <div className="space-y-4 text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                <Users size={32} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  There are no contracts linked to this Engagement.
                </p>
                <p className="text-xs text-muted-foreground">
                  Use the button below to create a contract record.
                </p>
              </div>
              <Button
                onClick={() => setIsContractSheetOpen(true)}
                className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white font-medium w-full mt-6"
              >
                Create a contract record
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Changes Section */}
        <div className="mt-8">
          <Card className="bg-white border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Recent Changes</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-gray-50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">
                      Date
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">
                      Action
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">
                      Performed by
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-sm text-foreground">25/04/2026</td>
                    <td className="px-6 py-3 text-sm text-foreground">Opportunity Created</td>
                    <td className="px-6 py-3 text-sm text-[#4a90d9] hover:underline cursor-pointer">
                      John Douglas
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Archive Link */}
        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-red-600 hover:text-red-700 font-medium">
            Archive this Opportunity
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-[#1e2a5e] text-white mt-auto">
        <div className="px-4 py-4 text-xs text-white/60 space-y-1">
          <div className="flex gap-3">
            <a href="#" className="hover:text-white transition-colors uppercase text-[10px] tracking-wide">
              Terms & Conditions
            </a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors uppercase text-[10px] tracking-wide">
              Privacy Policy
            </a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors uppercase text-[10px] tracking-wide">
              Cookies Policy
            </a>
          </div>
          <div className="text-[10px]">All rights reserved. Turner & Townsend © 2025</div>
        </div>
      </footer>

      {/* Create Risk Assessment Sheet */}
      {isRiskSheetOpen && (
        <RiskAssessmentSheet onClose={() => setIsRiskSheetOpen(false)} />
      )}

      {/* Create Contract Sheet */}
      <Sheet open={isContractSheetOpen} onOpenChange={setIsContractSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-xl font-semibold">Create Contract Record</SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground leading-relaxed">
              Set up a new contract record for this opportunity. Complete all required fields to proceed.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 px-4 pb-4">
            <div className="space-y-2">
              <Label>Contract Name*</Label>
              <Input placeholder="Enter contract name" className="bg-white" />
            </div>

            <div className="space-y-2">
              <Label>Contract Value*</Label>
              <Input placeholder="Enter contract value" type="number" className="bg-white" />
            </div>

            <div className="space-y-2">
              <Label>Contract Status*</Label>
              <Select>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <textarea className="w-full p-2 border border-border rounded bg-white text-sm" rows={4} placeholder="Enter contract description" />
            </div>
          </div>

          <SheetFooter className="px-4 py-4 border-t border-border">
            <Button
              onClick={() => setIsContractSheetOpen(false)}
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white">
              Create Contract
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
