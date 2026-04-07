'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { HelpCircle, Grid3X3, ExternalLink, MapPin, Users, Check, ChevronRight, Search, Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  getOpportunityById,
  getOpportunityByIdFromDB,
  createRiskAssessmentInDB,
  createContractInDB,
  OPPORTUNITY_ROWS,
  getRiskAssessmentStatusStyle,
  getContractStatusStyle,
} from '@/lib/contract-data';
import type {
  OpportunityRow,
  OpportunityRiskAssessment,
  OpportunityContract,
  CreateRiskAssessmentInput,
  CreateContractInput,
} from '@/lib/contract-data';
import { useUser, canCreateContract, canCreateOpportunity, getRoleLabel } from '@/lib/user-context';
import { UserSwitcher } from '@/components/user-switcher';

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

function RiskAssessmentSheet({
  onClose,
  onComplete,
}: {
  onClose: () => void;
  onComplete: (data: {
    projectScope: string;
    startDate: string;
    endDate: string;
    jointVenture: boolean;
    cbreReferred: boolean;
    estimatedFee: string;
    margin: string;
    probabilityOfWinning: string;
    proposalDate: string;
    boundaries: string;
    riskGuidanceReviewed: boolean;
    riskCategories: string[];
    otherText: string;
    note: string;
  }) => void;
}) {
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
              <Button
                onClick={() => {
                  onComplete({
                    projectScope,
                    startDate,
                    endDate,
                    jointVenture: jointVenture === 'yes',
                    cbreReferred: cbreReferred === 'yes',
                    estimatedFee,
                    margin,
                    probabilityOfWinning,
                    proposalDate,
                    boundaries,
                    riskGuidanceReviewed: riskGuidanceReviewed === 'yes',
                    riskCategories: selectedCategories,
                    otherText,
                    note,
                  });
                  onClose();
                }}
                className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white"
              >
                Create record
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Contract Create multi-step sheet ──────────────────────────────────────

const CONTRACT_STEPS = [
  { id: 'contract_flow',    label: 'Contract Flow' },
  { id: 'contract_type',    label: 'Contract Type' },
  { id: 'contract_details', label: 'Contract Details' },
  { id: 'creation_method',  label: 'Creation Method' },
  { id: 'document_upload',  label: 'Document Upload' },
  { id: 'summary',          label: 'Summary' },
] as const;

type ContractStep = typeof CONTRACT_STEPS[number]['id'];

const UPSTREAM_TYPES = [
  { id: 'msa_tt',     label: 'MSA/Framework (T&T Only)',             desc: 'A free-standing Services Agreement or Framework Agreement between T&T and a client, covering multiple projects or services under one overarching contract.' },
  { id: 'cbre_msa',   label: 'CBRE-led MSA',                         desc: 'Also known as a T&T master services agreement, there are two MSAs where the contracting will be facilitated to CBRE, but where the MSA will cover T&T services.' },
  { id: 'msa_calloff',label: 'MSA/Framework Call-offs and Work Orders', desc: 'Individual project or service instructions through a call-off contract or work order that sit under an existing Master Services Agreement (MSA) or Framework agreement.' },
  { id: 'client_msa', label: 'Client MSA',                           desc: 'A Non-Disclosure or confidentiality Agreement used solely to govern confidentiality and information sharing between T&T and the proposed client, with no services or fees attached.' },
];

const DOWNSTREAM_TYPES = [
  { id: 'standalone_sub',   label: 'Standalone Sub-contract',                    desc: "One-off contracts between T&T and suppliers or subcontractors engaged to deliver part of the scheme under a client-facing agreement." },
  { id: 'supplier_msa',     label: 'Supplier MSA/Framework',                     desc: 'A supplier master services framework or framework agreement between T&T and a supplier that can cover multiple projects or services under one overarching contract.' },
  { id: 'supplier_calloff', label: 'Supplier MSA/Framework Call-offs and Work Orders', desc: 'Individual project or service instructions through a call-off contract or work order that sit under an existing Supplier Master Services Agreement (MSA) or framework agreement.' },
  { id: 'supplier_nda',     label: 'Supplier NDA',                               desc: 'A Non-Disclosure or confidentiality Agreement used solely to govern confidentiality and information sharing between T&T and the proposed supplier contract party, with no services or fees attached.' },
];

function ContractCreateSheet({
  onClose,
  onComplete,
}: {
  onClose: () => void;
  onComplete: (data: {
    contractFlow: 'client' | 'supplier';
    contractType: string;
    contractTitle: string;
    reviewDate: string;
    creationMethod: 'builder' | 'upload';
    msaLinked: boolean;
    uploadedFiles: string[];
  }) => void;
}) {
  const router = useRouter();
  const [step, setStep] = useState<ContractStep>('contract_flow');

  // Step state
  const [creationMethod, setCreationMethod] = useState<'builder' | 'upload' | null>(null);
  const [contractFlow, setContractFlow]     = useState<'client' | 'supplier' | null>(null);
  const [contractType, setContractType]     = useState<string | null>(null);
  const [msaLinked, setMsaLinked]           = useState(false);
  const [contractTitle, setContractTitle]   = useState('');
  const [reviewDate, setReviewDate]         = useState('');
  const [uploadedFiles, setUploadedFiles]   = useState<string[]>([]);

  const currentIndex = CONTRACT_STEPS.findIndex(s => s.id === step);

  // Steps shown in sidebar depend on chosen method
  const visibleSteps = CONTRACT_STEPS.filter(s => {
    // hide document_upload and summary until creation_method is chosen
    if (s.id === 'document_upload' && creationMethod === 'builder') return false;
    return true;
  });

  const goNext = () => {
    if (step === 'creation_method' && creationMethod === 'builder') {
      // Go to builder full-page
      onClose();
      router.push('/contract/builder');
      return;
    }
    const allIds = CONTRACT_STEPS.map(s => s.id);
    const nextId = allIds[allIds.indexOf(step) + 1] as ContractStep | undefined;
    if (nextId) setStep(nextId);
  };

  const goToStep = (id: ContractStep) => {
    const targetIndex = CONTRACT_STEPS.findIndex(s => s.id === id);
    if (targetIndex <= currentIndex) setStep(id);
  };

  const typeOptions = contractFlow === 'supplier' ? DOWNSTREAM_TYPES : UPSTREAM_TYPES;

  const canProceed = () => {
    if (step === 'contract_flow')    return contractFlow !== null;
    if (step === 'contract_type')    return contractType !== null;
    if (step === 'contract_details') return contractTitle.trim() !== '' && reviewDate !== '';
    if (step === 'creation_method')  return creationMethod !== null;
    return true;
  };

  const nextLabel = step === 'creation_method' && creationMethod === 'builder' ? 'Open Contract Builder' : 'Next';

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-[680px] bg-white flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Create a contract record</h2>
        </div>

        {/* Body */}
        <div className="flex flex-1 min-h-0">
          {/* Left stepper */}
          <div className="w-48 bg-gray-50 border-r border-border flex-shrink-0 pt-6">
            <nav className="flex flex-col">
              {visibleSteps.map((s, i) => {
                const globalIndex = CONTRACT_STEPS.findIndex(cs => cs.id === s.id);
                const isCompleted = globalIndex < currentIndex;
                const isCurrent   = s.id === step;
                const isReachable = globalIndex <= currentIndex;
                return (
                  <button
                    key={s.id}
                    onClick={() => isReachable && goToStep(s.id)}
                    disabled={!isReachable}
                    className={`flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${
                      isCurrent ? 'bg-white border-r-2 border-[#4a90d9] text-[#4a90d9] font-semibold' :
                      isCompleted ? 'text-foreground cursor-pointer hover:bg-white/60' :
                      'text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      isCompleted ? 'bg-green-500 text-white' :
                      isCurrent   ? 'bg-[#4a90d9] text-white' :
                      'bg-gray-200 text-gray-400'
                    }`}>
                      {isCompleted ? <Check size={12} /> : i + 1}
                    </span>
                    <span className="leading-tight">{s.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right content */}
          <div className="flex-1 overflow-y-auto p-6">

            {/* STEP 4: Creation Method */}
            {step === 'creation_method' && (
              <div className="space-y-4">
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-foreground mb-1">How do you want to create this contract?</h3>
                  <p className="text-sm text-muted-foreground">Use a client-supplied contract, or start from one of our standard templates, so we can capture the details and route it through the appropriate process.</p>
                </div>
                {[
                  { id: 'builder', label: 'Contract builder', desc: 'Create a contract from scratch using our templates.' },
                  { id: 'upload',  label: 'Upload contract',  desc: 'Upload a file to create a contract.' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setCreationMethod(opt.id as 'builder' | 'upload')}
                    className={`w-full flex items-center justify-between p-4 border rounded text-left transition-colors ${
                      creationMethod === opt.id ? 'border-[#4a90d9] bg-blue-50' : 'border-border hover:border-gray-400 bg-white'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold text-foreground">{opt.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{opt.desc}</div>
                    </div>
                    <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ml-4 ${
                      creationMethod === opt.id ? 'border-[#4a90d9] bg-[#4a90d9]' : 'border-gray-300'
                    }`} />
                  </button>
                ))}

                {/* Builder config fields */}
                {creationMethod === 'builder' && (
                  <div className="mt-6 space-y-4 border-t border-border pt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Builder Configuration</p>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Service Line</Label>
                      <select className="w-full border border-border rounded px-3 py-2 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#4a90d9]">
                        <option>Upstream</option>
                        <option>Downstream</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Region</Label>
                      <select className="w-full border border-border rounded px-3 py-2 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#4a90d9]">
                        <option>EMEA</option>
                        <option>Americas</option>
                        <option>APAC</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Country</Label>
                      <select className="w-full border border-border rounded px-3 py-2 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#4a90d9]">
                        <option>United Kingdom</option>
                        <option>United States</option>
                        <option>Germany</option>
                        <option>France</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Select Template</Label>
                      <select className="w-full border border-border rounded px-3 py-2 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#4a90d9]">
                        <option>T&amp;T Terms &amp; Conditions</option>
                        <option>NDA Template</option>
                        <option>MSA Template</option>
                        <option>Sub-contract Template</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 1: Contract Flow */}
            {step === 'contract_flow' && (
              <div className="space-y-4">
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-foreground mb-1">Is this a client or supplier contract?</h3>
                  <p className="text-sm text-muted-foreground">Choose whether this is a client-facing (upstream) or supplier/subcontract (downstream) contract so we only show the relevant contract types on the next step.</p>
                </div>
                {[
                  { id: 'client',   label: 'Client contract',   desc: 'Contracts between us and the client or customer, covering the services we deliver and the commercial terms agreed with them.' },
                  { id: 'supplier', label: 'Supplier contract',  desc: 'Contracts between us and our suppliers or subcontractors, covering the work they deliver to support our client-facing commitments.' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { setContractFlow(opt.id as 'client' | 'supplier'); setContractType(null); }}
                    className={`w-full flex items-center justify-between p-4 border rounded text-left transition-colors ${
                      contractFlow === opt.id ? 'border-[#4a90d9] bg-blue-50' : 'border-border hover:border-gray-400 bg-white'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold text-foreground">{opt.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{opt.desc}</div>
                    </div>
                    <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ml-4 ${
                      contractFlow === opt.id ? 'border-[#4a90d9] bg-[#4a90d9]' : 'border-gray-300'
                    }`} />
                  </button>
                ))}
              </div>
            )}

            {/* STEP 2: Contract Type */}
            {step === 'contract_type' && (
              <div className="space-y-4">
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    {contractFlow === 'supplier' ? 'What type of downstream contract is this?' : 'What type of upstream contract is this?'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {contractFlow === 'supplier'
                      ? 'Choose the option that best describes this supplier or subcontract agreement so we can capture the right details and route it through the appropriate process.'
                      : 'Choose the option that best describes this master or framework agreement so we can capture the right details and route it through the appropriate process.'}
                  </p>
                </div>
                {typeOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setContractType(opt.id)}
                    className={`w-full flex items-center justify-between p-4 border rounded text-left transition-colors ${
                      contractType === opt.id ? 'border-[#4a90d9] bg-blue-50' : 'border-border hover:border-gray-400 bg-white'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold text-foreground">{opt.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{opt.desc}</div>
                    </div>
                    <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ml-4 ${
                      contractType === opt.id ? 'border-[#4a90d9] bg-[#4a90d9]' : 'border-gray-300'
                    }`} />
                  </button>
                ))}
              </div>
            )}

            {/* STEP 3: Contract Details */}
            {step === 'contract_details' && (
              <div className="space-y-5">
                <div className="mb-2">
                  <h3 className="text-base font-semibold text-foreground mb-1">Contract Details</h3>
                  <p className="text-sm text-muted-foreground">Use this section to capture the key details for this contract document. Give it a clear title, link it to any related contracts, and set the review date so it can be picked up by the right team at the right time.</p>
                </div>

                {/* Link to MSA */}
                <div className="border border-border rounded p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Link to an MSA</span>
                    <button className="text-xs text-[#4a90d9] hover:underline">+</button>
                  </div>
                  <p className="text-xs text-muted-foreground">Search for a MSA by Engagement record number or Contract record number</p>
                  {!msaLinked ? (
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Search MSA..." className="pl-8 bg-white text-sm" />
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded p-3 space-y-1">
                      <div className="text-sm font-semibold text-[#4a90d9]">HSBC 1 London Place MSA</div>
                      <div className="text-xs text-muted-foreground">Contract record id: CR12345</div>
                      <div className="text-xs text-muted-foreground">Services covered: Agency PM, Principal</div>
                      <div className="text-xs text-muted-foreground">Geographical coverage: United Kingdom</div>
                      <div className="text-xs text-muted-foreground">End date: 01 January 2027</div>
                      <button onClick={() => setMsaLinked(false)} className="text-xs text-red-500 hover:underline mt-1">Remove linked contract</button>
                    </div>
                  )}
                  {!msaLinked && (
                    <button onClick={() => setMsaLinked(true)} className="text-xs text-[#4a90d9] hover:underline">+ Link MSA result</button>
                  )}
                </div>

                {/* Contract Title */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contract record title*</Label>
                  <Input
                    value={contractTitle}
                    onChange={e => setContractTitle(e.target.value)}
                    placeholder="Suggested format for title goes here"
                    className="bg-white"
                  />
                  <p className="text-xs text-muted-foreground">Suggested format for title goes here</p>
                </div>

                {/* Review Date */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Review date*</Label>
                  <Input
                    type="date"
                    value={reviewDate}
                    onChange={e => setReviewDate(e.target.value)}
                    className="bg-white"
                  />
                  <p className="text-xs text-muted-foreground">Enter the date this contract needs to be reviewed to.</p>
                </div>
              </div>
            )}

            {/* STEP 5: Document Upload */}
            {step === 'document_upload' && (
              <div className="space-y-5">
                <div className="mb-2">
                  <h3 className="text-base font-semibold text-foreground mb-1">Document Upload</h3>
                  <p className="text-sm text-muted-foreground">Use this section to upload the contract and any supporting documents or everything else in one place against this record. You can add multiple files and flag the primary contract document to make it clear which version should be used for review and approvals.</p>
                </div>

                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">Upload your contract document(s)</Label>
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-10 text-center cursor-pointer hover:border-[#4a90d9] transition-colors"
                    onClick={() => setUploadedFiles(prev => [...prev, `Contract_Document_${prev.length + 1}.docx`])}
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
                      <Upload size={22} className="text-[#4a90d9]" />
                    </div>
                    <p className="text-sm font-medium text-foreground">Browse to upload</p>
                    <p className="text-xs text-muted-foreground mt-1">File types supported: docx, PDF. Maximum file size: 12mb</p>
                  </div>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    {uploadedFiles.map((f, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border border-border rounded bg-white">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-muted-foreground" />
                          <span className="text-sm text-[#4a90d9]">{f}</span>
                          {i === 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-[#4a90d9] text-white font-medium">PRIMARY</span>}
                        </div>
                        <button onClick={() => setUploadedFiles(prev => prev.filter((_, j) => j !== i))}>
                          <X size={14} className="text-muted-foreground hover:text-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STEP 6: Summary */}
            {step === 'summary' && (
              <div className="space-y-5">
                <div className="mb-2">
                  <h3 className="text-base font-semibold text-foreground mb-1">Summary</h3>
                  <p className="text-sm text-muted-foreground">Use this page to review everything before you continue — check the linked contract, key contract details and the documents you have uploaded. If anything looks wrong or missing, go back and update it now so the right version is routed through the process.</p>
                </div>

                {/* Contract Type summary */}
                <div className="border border-border rounded overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-border">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contract Type</span>
                    <button onClick={() => setStep('contract_type')} className="text-xs text-[#4a90d9] font-semibold hover:underline">EDIT</button>
                  </div>
                  <div className="px-4 py-3 space-y-1">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Contract type</div>
                    <div className="text-sm font-medium text-foreground">
                      {typeOptions.find(t => t.id === contractType)?.label ?? '—'}
                    </div>
                  </div>
                </div>

                {/* Contract Details summary */}
                <div className="border border-border rounded overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-border">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contract Details</span>
                    <button onClick={() => setStep('contract_details')} className="text-xs text-[#4a90d9] font-semibold hover:underline">EDIT</button>
                  </div>
                  <div className="px-4 py-3 space-y-3">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">Linked MSA</div>
                      <div className="text-sm font-medium text-foreground">{msaLinked ? 'HSBC 1 London Place MSA' : '—'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">Contract record title</div>
                      <div className="text-sm font-medium text-foreground">{contractTitle || '—'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">Required Review Date</div>
                      <div className="text-sm font-medium text-foreground">
                        {reviewDate ? new Date(reviewDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documents summary */}
                <div className="border border-border rounded overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-border">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Uploaded Document(s)</span>
                    <button onClick={() => setStep('document_upload')} className="text-xs text-[#4a90d9] font-semibold hover:underline">EDIT</button>
                  </div>
                  <div className="px-4 py-3 space-y-2">
                    {uploadedFiles.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No documents uploaded.</p>
                    ) : uploadedFiles.map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <FileText size={14} className="text-muted-foreground" />
                        <span className="text-sm text-[#4a90d9]">{f}</span>
                        {i === 0 && <span className="text-xs px-1.5 py-0.5 rounded bg-[#4a90d9] text-white font-medium">PRIMARY</span>}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-white flex-shrink-0">
          <Button variant="outline" onClick={onClose} className="border-border text-foreground">
            Cancel
          </Button>
          <div className="flex gap-2">
            {step === 'summary' ? (
              <>
                <Button variant="outline" className="border-border text-foreground text-sm">
                  Save as draft
                </Button>
                <Button
                  variant="outline"
                  className="border-border text-foreground text-sm"
                  onClick={() => {
                    onComplete({
                      contractFlow: contractFlow || 'client',
                      contractType: contractType || '',
                      contractTitle,
                      reviewDate,
                      creationMethod: creationMethod || 'upload',
                      msaLinked,
                      uploadedFiles,
                    });
                    onClose();
                  }}
                >
                  Create Record
                </Button>
                <Button
                  onClick={() => {
                    onComplete({
                      contractFlow: contractFlow || 'client',
                      contractType: contractType || '',
                      contractTitle,
                      reviewDate,
                      creationMethod: creationMethod || 'upload',
                      msaLinked,
                      uploadedFiles,
                    });
                    onClose();
                  }}
                  className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white text-sm"
                >
                  Create Record &amp; Submit for Review
                </Button>
              </>
            ) : (
              <Button
                onClick={goNext}
                disabled={!canProceed()}
                className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white disabled:opacity-40 flex items-center gap-1"
              >
                {nextLabel} <ChevronRight size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Opportunity Page ───────────────────────────────────────────────────────

function OpportunityPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const opportunityId = searchParams.get('id') || 'OPP-001';
  const { currentUser } = useUser();

  const [isRiskSheetOpen, setIsRiskSheetOpen] = useState(false);
  const [isContractSheetOpen, setIsContractSheetOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Permission checks based on role
  const canCreate = canCreateOpportunity(currentUser.role);
  const canCreateContracts = canCreateContract(currentUser.role);

  // Opportunity state — loaded async from Supabase with hardcoded fallback
  const [opportunity, setOpportunity] = useState<OpportunityRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [riskAssessments, setRiskAssessments] = useState<OpportunityRiskAssessment[]>([]);
  const [contracts, setContracts] = useState<OpportunityContract[]>([]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    getOpportunityByIdFromDB(opportunityId)
      .then((data) => {
        if (cancelled) return;
        if (data) {
          setOpportunity(data);
          setRiskAssessments(data.riskAssessments);
          setContracts(data.contracts);
        } else {
          // Fall back to hardcoded data if not found in Supabase
          const fallback = getOpportunityById(opportunityId) || OPPORTUNITY_ROWS[0];
          setOpportunity(fallback);
          setRiskAssessments(fallback.riskAssessments);
          setContracts(fallback.contracts);
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        const fallback = getOpportunityById(opportunityId) || OPPORTUNITY_ROWS[0];
        setOpportunity(fallback);
        setRiskAssessments(fallback.riskAssessments);
        setContracts(fallback.contracts);
        setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [opportunityId]);

  // Hide success message after 5 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);
  
 // Show loading state while fetching from Supabase
  if (isLoading || !opportunity) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading opportunity...</div>
      </div>
    );
  }

  // Determine next step based on risk assessment status
  const needsRiskAssessment = opportunity.riskAssessmentStatus === 'required' || opportunity.riskAssessmentStatus === 'in_progress';
  const riskAwaitingApproval = opportunity.riskAssessmentStatus === 'awaiting_approval';
  const riskComplete = opportunity.riskAssessmentStatus === 'complete';

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
              <UserSwitcher />
              <div className="flex items-center gap-1.5 text-sm">
                <HelpCircle size={16} />
                <span>Support</span>
              </div>
            </div>
          </div>

          {/* Title section */}
          <div>
            <h1 className="text-2xl font-semibold mb-1">{opportunity.client}</h1>
            <p className="text-white/70 text-sm">{opportunity.address.toUpperCase()} · {opportunity.city.toUpperCase()}</p>
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
        <Card className={`border p-6 mb-6 ${
          needsRiskAssessment ? 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200' :
          riskAwaitingApproval ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200' :
          'bg-gradient-to-r from-green-50 to-green-100 border-green-200'
        }`}>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            {needsRiskAssessment ? 'Next step: Complete a Risk Assessment' :
             riskAwaitingApproval ? 'Risk Assessment Awaiting Approval' :
             riskComplete && contracts.length === 0 ? 'Next step: Create a Contract' :
             'Opportunity In Progress'}
          </h2>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {needsRiskAssessment ? 
              'A risk assessment is required on this opportunity before assigning contracts. You can create and manage your contracts here, but a risk assessment must be completed to progress the opportunity.' :
             riskAwaitingApproval ?
              'The risk assessment for this opportunity is awaiting approval. Once approved, you can proceed with contract creation.' :
             riskComplete && contracts.length === 0 ?
              'The risk assessment is complete. You can now create contracts for this opportunity.' :
              `This opportunity has ${riskAssessments.length} risk assessment(s) and ${contracts.length} contract(s) associated with it.`}
          </p>
          <div className="flex gap-3">
            {needsRiskAssessment && canCreate && (
              <Button
                onClick={() => setIsRiskSheetOpen(true)}
                className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white font-medium"
              >
                {riskAssessments.length === 0 ? 'Create a Risk Assessment' : 'Continue Risk Assessment'}
              </Button>
            )}
            {riskComplete && canCreateContracts && (
              <Button
                onClick={() => setIsContractSheetOpen(true)}
                className={needsRiskAssessment ? 'border-[#4a90d9] text-[#4a90d9] hover:bg-blue-50' : 'bg-[#4a90d9] hover:bg-[#3a7fc9] text-white font-medium'}
                variant={needsRiskAssessment ? 'outline' : 'default'}
              >
                Create a Contract
              </Button>
            )}
            {!canCreate && !canCreateContracts && (
              <p className="text-sm text-muted-foreground italic">
                You are viewing as {getRoleLabel(currentUser.role)}. Only Opportunity Managers can create records.
              </p>
            )}
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
                  <div className="w-12 h-12 rounded bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-700 font-bold text-sm">{opportunity.clientInitials}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">{opportunity.client}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      <div>{opportunity.address}</div>
                      <div>{opportunity.city}</div>
                      <div>{opportunity.country}</div>
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
                  <div className="text-xs text-muted-foreground uppercase font-semibold">Reference</div>
                  <div className="text-foreground">{opportunity.reference}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold">Opportunity</div>
                  <div className="text-foreground">{opportunity.name}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold">Location</div>
                  <div className="text-foreground">{opportunity.city}, {opportunity.country}</div>
                </div>
              </div>

              {/* Director */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Opportunity Director
                </h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold">{opportunity.directorInitials}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-[#4a90d9]">{opportunity.director}</div>
                    <div className="text-xs text-muted-foreground">{opportunity.city}</div>
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
                    <span className="text-xs font-bold">{opportunity.managerInitials}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-[#4a90d9]">{opportunity.manager}</div>
                    <div className="text-xs text-muted-foreground">{opportunity.city}</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Right Column - Risk Assessment Records + Contract Records stacked */}
          <div className="col-span-2 flex flex-col gap-6">

            {/* Risk Assessment Records */}
            <Card className="bg-white border border-border p-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Risk Assessment Records
              </h3>

              {riskAssessments.length === 0 ? (
                <div className="space-y-4 text-center py-10">
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                    <MapPin size={28} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      There are no risk assessment records linked to this engagement.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Use the button below to create a risk assessment record.
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsRiskSheetOpen(true)}
                    className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white font-medium"
                  >
                    Create a Risk Assessment
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {riskAssessments.map(ra => {
                    const statusStyle = getRiskAssessmentStatusStyle(ra.status);
                    return (
                      <div key={ra.id} className="flex items-center justify-between p-3 border border-border rounded hover:bg-gray-50 transition-colors">
                        <div>
                          <div className="text-sm font-medium text-[#4a90d9] hover:underline cursor-pointer">{ra.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            Created {ra.date} {ra.serviceType && `· ${ra.serviceType}`} {ra.riskScore !== undefined && `· Risk Score: ${ra.riskScore}`}
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle.className}`}>{statusStyle.label}</span>
                      </div>
                    );
                  })}
                  <Button
                    disabled
                    variant="outline"
                    className="w-full mt-2 text-xs text-muted-foreground border-dashed"
                    title="Only one risk assessment per opportunity"
                  >
                    Risk assessment already created
                  </Button>
                </div>
              )}
            </Card>

            {/* Contract Records */}
            <Card className="bg-white border border-border p-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Contract Records
              </h3>

              {contracts.length === 0 ? (
                <div className="space-y-4 text-center py-10">
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                    <Users size={28} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      There are no contracts linked to this Engagement.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {riskComplete ? 'Use the button below to create a contract record.' : 'Complete the risk assessment first to create contracts.'}
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsContractSheetOpen(true)}
                    disabled={!riskComplete}
                    className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white font-medium disabled:opacity-50"
                  >
                    Create a contract record
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {contracts.map(c => {
                    const statusStyle = getContractStatusStyle(c.status);
                    return (
                      <div
                        key={c.id}
                        onClick={() => router.push('/contract')}
                        className="flex items-center justify-between p-3 border border-border rounded hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div>
                          <div className="text-sm font-medium text-[#4a90d9] hover:underline">{c.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            Created {c.date} {c.contractType && `· ${c.contractType}`}
                          </div>
                        </div>
                        {statusStyle && (
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle.className}`}>{statusStyle.label}</span>
                        )}
                      </div>
                    );
                  })}
                  <Button
                    onClick={() => setIsContractSheetOpen(true)}
                    variant="outline"
                    className="w-full mt-2 text-xs border-dashed"
                  >
                    + Create another contract record
                  </Button>
                </div>
              )}
            </Card>

          </div>
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
                      {opportunity.manager}
                    </td>
                  </tr>
                  {riskAssessments.map(ra => (
                    <tr key={ra.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 text-sm text-foreground">{ra.date}</td>
                      <td className="px-6 py-3 text-sm text-foreground">Risk Assessment Created: {ra.name}</td>
                      <td className="px-6 py-3 text-sm text-[#4a90d9] hover:underline cursor-pointer">
                        {opportunity.manager}
                      </td>
                    </tr>
                  ))}
                  {contracts.map(c => (
                    <tr key={c.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 text-sm text-foreground">{c.date}</td>
                      <td className="px-6 py-3 text-sm text-foreground">Contract Created: {c.name}</td>
                      <td className="px-6 py-3 text-sm text-[#4a90d9] hover:underline cursor-pointer">
                        {opportunity.manager}
                      </td>
                    </tr>
                  ))}
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
              Terms &amp; Conditions
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
          <div className="text-[10px]">All rights reserved. Turner &amp; Townsend &copy; 2025</div>
        </div>
      </footer>

      {/* Create Risk Assessment Sheet */}
      {isRiskSheetOpen && (
        <RiskAssessmentSheet
          onClose={() => setIsRiskSheetOpen(false)}
          onComplete={async (data) => {
            try {
              const newRA = await createRiskAssessmentInDB({
                opportunityId: opportunity.id,
                name: `${opportunity.name} Risk Assessment`,
                serviceType: 'Project Management',
                projectScope: data.projectScope,
                startDate: data.startDate,
                endDate: data.endDate,
                jointVenture: data.jointVenture,
                cbreReferred: data.cbreReferred,
                estimatedFee: data.estimatedFee,
                margin: data.margin,
                probabilityOfWinning: data.probabilityOfWinning,
                proposalDate: data.proposalDate,
                boundaries: data.boundaries,
                riskGuidanceReviewed: data.riskGuidanceReviewed,
                riskCategories: data.riskCategories,
                otherText: data.otherText,
                note: data.note,
              });
              setRiskAssessments(prev => [...prev, newRA]);
              // Update the parent opportunity's status in local state too
              setOpportunity(prev =>
                prev ? { ...prev, riskAssessmentStatus: 'awaiting_approval' } : prev
              );
              setShowSuccess(true);
            } catch (err) {
              console.error('Failed to create risk assessment:', err);
              alert('Failed to create risk assessment. Please try again.');
            }
          }}
        />
      )}

      {/* Create Contract Sheet */}
      {isContractSheetOpen && (
        <ContractCreateSheet
          onClose={() => setIsContractSheetOpen(false)}
          onComplete={async (data) => {
            try {
              const newContract = await createContractInDB({
                opportunityId: opportunity.id,
                contractFlow: data.contractFlow,
                contractType: data.contractType,
                contractTitle: data.contractTitle || `${opportunity.client} Contract`,
                reviewRequiredDate: data.reviewDate,
                creationMethod: data.creationMethod,
                uploadedFileNames: data.uploadedFiles,
              });
              setContracts(prev => [...prev, newContract]);
              // Update the parent opportunity's contract status in local state
              setOpportunity(prev =>
                prev ? { ...prev, contractStatus: 'rm_review' } : prev
              );
              setShowSuccess(true);
            } catch (err) {
              console.error('Failed to create contract:', err);
              alert('Failed to create contract. Please try again.');
            }
          }}
        />
      )}
    </div>
  );
}

function OpportunityPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="text-muted-foreground">Loading...</div></div>}>
      <OpportunityPageContent />
    </Suspense>
  );
}

export default function OpportunityPage() {
  return <OpportunityPageWrapper />;
}
