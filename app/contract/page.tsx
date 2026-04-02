'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Grid3X3, HelpCircle, ExternalLink, ChevronDown, ChevronUp, Flag, ZoomIn, ZoomOut, FileText, AlertTriangle, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const PIPELINE_STAGES = [
  { id: 'prep',        label: 'Contract Preparation',          done: true  },
  { id: 'rm_review',   label: 'RM Review',                     done: false, active: true },
  { id: 'negotiation', label: 'Negotiation',                   done: false },
  { id: 'approval',    label: 'Approval',                      done: false },
  { id: 'signing',     label: 'Contract Signing',              done: false },
  { id: 'key_deal',    label: 'Key Deal Summary Preparation',  done: false },
  { id: 'commission',  label: 'Commission Setup',              done: false },
  { id: 'complete',    label: 'Complete',                      done: false },
];

const CONTRACT_TABS = ['Overview', 'Documents', 'Review', 'Approve', 'Sign', 'Mitigations', 'History'];

const CONTRACT_INFO_ROWS = [
  { label: 'CONTRACT TYPE',                  value: 'STANDALONE' },
  { label: 'CLIENT SIGNING DATE',            value: '–' },
  { label: 'PRIMARY CONTRACT',               value: 'YES' },
  { label: 'LOD LEVEL',                      value: 'LEVEL 2' },
  { label: 'APPROVAL TO START WITHOUT SIGNING', value: '–' },
  { label: 'CONTRACT END DATE',              value: '–' },
  { label: 'CONTRACT TITLE',                 value: '1 LONDON STREET STANDALONE ONE OFF V1' },
  { label: 'REVIEW DATE REQUIRED',           value: '01/2/2026' },
  { label: 'OUR SIGNING DATE',               value: '–' },
];

const FLAGGED_CLAUSES = [
  {
    id: 1,
    title: 'Professional indemnity insurance / potential unlimited liability',
    risk: 'VERY HIGH',
    riskColor: 'bg-red-500',
    clauseType: 'Insurance',
    flaggedClause: '"When reasonably requested by us you are to provide documentary evidence that the insurance required under this Appointment is being maintained."',
    amendments: 'Clauses requiring you to maintain PI insurance and prove it — where the same area of the contract doesn\'t clearly cap your overall liability. It\'s flagging possible exposure above your insurance limits.',
  },
  {
    id: 2,
    title: 'Sub-consultant payment terms',
    risk: 'UNACCEPTABLE',
    riskColor: 'bg-gray-700',
    clauseType: 'Payment Terms',
    flaggedClause: 'Payment terms for sub-consultants extend beyond 60 days.',
    amendments: 'Standard payment terms should not exceed 30 days for sub-consultants.',
  },
  {
    id: 3,
    title: 'Liability cap above standard level',
    risk: 'HIGH',
    riskColor: 'bg-amber-500',
    clauseType: 'Liability / Limitation of liability',
    flaggedClause: '"The Consultant\'s aggregate liability to the Client arising out of or in connection with this Agreement shall be limited to an amount equal to 200% of the Fees or £10,000,000, whichever is greater, and shall apply regardless of the cause of action."',
    amendments: 'The Consultant\'s total aggregate liability to the Client arising out of or in connection with this Agreement, whether in contract, tort (including negligence), breach of statutory duty or otherwise, shall be limited to £5,000,000 (five million pounds). This cap applies to all claims in aggregate and excludes liability for death or personal injury caused by the Consultant\'s negligence and any other liability which cannot lawfully be excluded.',
    mitigation: 'We have agreed a higher PI cap of £10m (standard £5m) but confirmed with Insurance that cover is available on existing terms. The higher cap is limited to this project only and excludes consequential loss and indirect damages. Fee levels have been uplifted to reflect the additional exposure, and this position will be reviewed at each annual renewal.',
  },
  {
    id: 4,
    title: 'Indemnity wording broader than template',
    risk: 'MEDIUM',
    riskColor: 'bg-gray-400',
    clauseType: 'Indemnity',
    flaggedClause: 'Indemnity clause extends beyond standard template wording.',
    amendments: 'Review and narrow the indemnity scope to match template.',
  },
  {
    id: 5,
    title: 'Extended limitation period (beyond 6 years)',
    risk: 'MEDIUM',
    riskColor: 'bg-gray-400',
    clauseType: 'Limitation period / Time bar',
    flaggedClause: 'Limitation period extends to 12 years.',
    amendments: 'Standard limitation period is 6 years.',
  },
  {
    id: 6,
    title: 'Unfavourable payment terms (long payment period / pay-when-paid)',
    risk: 'LOW',
    riskColor: 'bg-green-500',
    clauseType: 'Payment Terms / Commercial',
    flaggedClause: 'Payment terms extend to 90 days.',
    amendments: 'Standard payment terms are 30 days.',
  },
];

const DOCUMENT_PARAGRAPHS = [
  { num: '4.2', text: 'A payment application in respect of an instalment may not be given until after the end of the relevant period.' },
  { num: '5', title: 'Payment notices', text: 'In relation to each instalment, the payer (or specified person, if any) must give a notice (payment notice) to the payee not later than five days after the payment due date, specifying:' },
  { num: '', sub: '(a)', text: 'the sum that, in the opinion of the payer (or specified person), is (or was) due at the payment due date; and' },
  { num: '', sub: '(b)', text: 'the basis on which that sum is calculated,' },
  { num: '', text: 'it being immaterial that such sum may be zero.' },
  { num: '6', title: 'Payments', text: 'Subject to paragraphs 7.4 and 8, the payer must pay the payee the notified sum (to the extent not already paid) no later than the final date for payment of that sum.' },
  { num: '7', title: 'Payment reduction notice' },
  { num: '7.1', text: 'The payer (or specified person, if any) may give the payee notice of the payer\'s intention to pay less than the notified sum (payment reduction notice) and such notice must specify:', highlighted: true },
  { num: '', sub: '(a)', text: 'the sum (adjusted sum) the payer considers to be due on the date the payment reduction notice is served; and' },
  { num: '', sub: '(b)', text: 'the basis on which that sum is calculated.' },
  { num: '7.2', text: 'A payment reduction notice may not be given:' },
  { num: '', sub: '(a)', text: 'before the notice by reference to which the notified sum is determined; nor' },
  { num: '', sub: '(b)', text: 'any later than five days before the final date for payment.' },
  { num: '7.3', text: 'It is immaterial that the sum referred to in paragraph 7.1 may be zero.' },
  { num: '7.4', text: 'If the payer (or a specified person) serves a payment reduction notice in accordance with this paragraph 7, the amount the payer must pay under paragraph 6 is the adjusted sum.' },
  { num: '8', title: 'Insolvency' },
  { num: '8.1', text: 'Paragraph 8.2 applies if:' },
  { num: '', sub: '(a)', text: 'the payee is or becomes insolvent; and' },
];

export default function ContractPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isReviewing, setIsReviewing] = useState(false);
  const [expandedClause, setExpandedClause] = useState<number | null>(1);
  const [reviewSubTab, setReviewSubTab] = useState<'details' | 'guardrails'>('guardrails');
  const [reviewComplete, setReviewComplete] = useState(false);
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadStep, setUploadStep] = useState<'upload' | 'action'>('upload');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [nextAction, setNextAction] = useState<'approval' | 're-review' | 'no-action' | null>(null);

  const handleStartReview = () => {
    setIsReviewing(true);
    setActiveTab('Review');
  };

  const handleMarkAsReviewed = () => {
    setReviewComplete(true);
    setIsReviewing(false);
  };

  const handleReviewComplete = () => {
    setIsNegotiating(true);
    setReviewComplete(false);
  };

  const handleSubmitForApproval = () => {
    setIsNegotiating(false);
    setIsApproving(true);
  };

  const handleOpenUploadModal = () => {
    setShowUploadModal(true);
    setUploadStep('upload');
    setUploadedFileName('');
    setNextAction(null);
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    setUploadStep('upload');
    setUploadedFileName('');
    setNextAction(null);
  };

  const handleUploadNext = () => {
    if (uploadedFileName) {
      setUploadStep('action');
    }
  };

  const handleAddVersion = () => {
    // Process the upload
    if (nextAction === 'approval') {
      // Contract ready for approval - move to approval stage
      setIsNegotiating(false);
      setActiveTab('Overview');
    } else if (nextAction === 're-review') {
      // Start review process again
      setIsReviewing(true);
      setActiveTab('Review');
    }
    // else: no action - just close modal
    handleCloseUploadModal();
  };

  // Compute current pipeline stage
  const currentStage = isNegotiating ? 'negotiation' : (reviewComplete || isReviewing) ? 'rm_review' : 'rm_review';

  // Document Review View - when reviewing contract
  if (isReviewing && activeTab === 'Review') {
    return (
      <div className="min-h-screen flex flex-col bg-background font-sans">
        {/* Header */}
        <header className="bg-[#1e2a5e] text-white">
          <div className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-3">
              <button className="p-1.5 hover:bg-white/10 rounded"><Grid3X3 size={18} /></button>
              <button className="p-1.5 hover:bg-white/10 rounded">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </button>
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full bg-blue-400 flex items-center justify-center"><span className="text-xs font-bold">H</span></div>
                <span className="text-sm font-semibold tracking-widest">HIVE</span>
              </div>
              <span className="text-white/50 text-sm">Contracts App</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/80">Hi [User first name]</span>
              <button className="p-1.5 hover:bg-white/10 rounded">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </button>
              <button className="p-1.5 hover:bg-white/10 rounded"><HelpCircle size={18} /></button>
              <span className="text-sm">Support</span>
            </div>
          </div>
          <div className="bg-[#1e2a5e] border-t border-white/10 px-4 py-2 flex items-center gap-3">
            <button onClick={() => setIsReviewing(false)} className="hover:bg-white/10 rounded p-1"><ArrowLeft size={16} /></button>
            <div>
              <div className="text-sm font-semibold">1 LONDON STREET – 1823456</div>
              <div className="text-xs text-white/60">CONTRACT: MSA 12345678</div>
            </div>
          </div>
          <div className="flex gap-0 border-t border-white/10 px-4">
            {CONTRACT_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); if (tab !== 'Review') setIsReviewing(false); }}
                className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab ? 'border-white text-white' : 'border-transparent text-white/60 hover:text-white/90'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        {/* Main content - Document Review */}
        <main className="flex-1 flex">
          {/* Page sidebar */}
          <div className="w-14 bg-gray-100 border-r border-border flex flex-col items-center py-4 gap-2">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Page</div>
            <button className="w-8 h-8 rounded border border-border bg-white text-xs font-medium hover:bg-gray-50">1</button>
            <button className="w-8 h-8 rounded border border-border bg-white text-xs font-medium hover:bg-gray-50">8</button>
            <div className="flex-1" />
            <button className="p-1.5 hover:bg-gray-200 rounded"><ChevronUp size={16} className="text-muted-foreground" /></button>
            <button className="p-1.5 hover:bg-gray-200 rounded"><ChevronDown size={16} className="text-muted-foreground" /></button>
            <button className="p-1.5 hover:bg-gray-200 rounded"><FileText size={16} className="text-muted-foreground" /></button>
            <button className="p-1.5 hover:bg-gray-200 rounded"><ZoomIn size={16} className="text-muted-foreground" /></button>
            <button className="p-1.5 hover:bg-gray-200 rounded"><ZoomOut size={16} className="text-muted-foreground" /></button>
          </div>

          {/* Document view */}
          <div className="flex-1 overflow-auto p-6 bg-gray-50">
            <div className="max-w-3xl mx-auto bg-white shadow-sm border border-border rounded p-8">
              <div className="text-center text-xs text-muted-foreground mb-6">Confidential – External</div>
              <div className="space-y-4 text-sm leading-relaxed">
                {DOCUMENT_PARAGRAPHS.map((para, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 flex-shrink-0 text-right">
                      {para.num && <span className="font-semibold">{para.num}</span>}
                      {para.sub && <span className="text-muted-foreground ml-4">{para.sub}</span>}
                    </div>
                    <div className="flex-1">
                      {para.title && <div className="font-semibold mb-1">{para.title}</div>}
                      {para.text && (
                        <div className="flex items-start gap-2">
                          <span className={para.highlighted ? 'bg-blue-100 px-1 -mx-1' : ''}>
                            {para.text}
                          </span>
                          {para.highlighted && (
                            <button className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1e2a5e] flex items-center justify-center">
                              <Flag size={12} className="text-white" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-10 pt-4 border-t border-border text-xs text-muted-foreground">
                <span>August 2021</span>
                <span>making the <span className="text-[#4a90d9]">difference</span></span>
                <span>11</span>
              </div>
            </div>
          </div>

          {/* Right panel - Contract Review */}
          <div className="w-80 bg-white border-l border-border flex flex-col">
            <div className="p-5 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground mb-2">Contract review</h2>
              <p className="text-sm text-muted-foreground">Review the contract, add additional guardrails or edit the guardrails that have been added in the AI review.</p>
            </div>

            <div className="p-5 border-b border-border">
              <button className="text-xs font-semibold text-[#4a90d9] uppercase tracking-wide flex items-center gap-1">
                + Add Guardrail
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {FLAGGED_CLAUSES.slice(0, 3).map(clause => (
                <div key={clause.id} className="border-b border-border">
                  <button
                    onClick={() => setExpandedClause(expandedClause === clause.id ? null : clause.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {expandedClause === clause.id ? <ChevronDown size={16} /> : <ChevronUp size={16} className="rotate-180" />}
                      <span className="text-sm font-medium text-foreground">{clause.title}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold text-white ${clause.riskColor}`}>
                      {clause.risk}
                    </span>
                  </button>
                  {expandedClause === clause.id && (
                    <div className="px-4 pb-4 space-y-3">
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Clause Type</div>
                        <div className="text-sm text-foreground">{clause.clauseType}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Flagged Clause</div>
                        <div className="text-sm text-muted-foreground italic">{clause.flaggedClause}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Amendments</div>
                        <div className="text-sm text-muted-foreground">{clause.amendments}</div>
                      </div>
                      <div className="flex items-center gap-4 pt-2">
                        <button className="text-xs font-semibold text-[#4a90d9] uppercase tracking-wide">Edit</button>
                        <button className="text-xs font-semibold text-red-500 uppercase tracking-wide">Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-border">
              <Button onClick={handleMarkAsReviewed} className="w-full bg-[#1e2a5e] hover:bg-[#2a3a6e] text-white">
                Mark as reviewed
              </Button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-[#1e2a5e] text-white">
          <div className="px-4 py-4 text-xs text-white/60 space-y-1">
            <div className="flex gap-3">
              <a href="#" className="hover:text-white transition-colors uppercase text-[10px] tracking-wide">Terms &amp; Conditions</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors uppercase text-[10px] tracking-wide">Privacy Policy</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors uppercase text-[10px] tracking-wide">Cookies Policy</a>
            </div>
            <div className="text-[10px]">Terms and Conditions</div>
          </div>
        </footer>
      </div>
    );
  }

  // Review Summary View (after Mark as Reviewed)
  if (reviewComplete && activeTab === 'Review') {
    return (
      <div className="min-h-screen flex flex-col bg-background font-sans">
        {/* Header - same as above */}
        <header className="bg-[#1e2a5e] text-white">
          <div className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-3">
              <button className="p-1.5 hover:bg-white/10 rounded"><Grid3X3 size={18} /></button>
              <button className="p-1.5 hover:bg-white/10 rounded">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </button>
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full bg-blue-400 flex items-center justify-center"><span className="text-xs font-bold">H</span></div>
                <span className="text-sm font-semibold tracking-widest">HIVE</span>
              </div>
              <span className="text-white/50 text-sm">Contracts App</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/80">Hi [User first name]</span>
              <button className="p-1.5 hover:bg-white/10 rounded">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </button>
              <button className="p-1.5 hover:bg-white/10 rounded"><HelpCircle size={18} /></button>
              <span className="text-sm">Support</span>
            </div>
          </div>
          <div className="flex gap-0 border-t border-white/10 px-4">
            {['Overview', 'Documents', 'History'].map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setReviewComplete(false); }}
                className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab ? 'border-white text-white' : 'border-transparent text-white/60 hover:text-white/90'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        {/* Main content - Review Summary */}
        <main className="flex-1 p-6 bg-gray-50">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Pipeline */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {PIPELINE_STAGES.map((stage, i) => {
                const stageIndex = PIPELINE_STAGES.findIndex(s => s.id === stage.id);
                const currentIndex = PIPELINE_STAGES.findIndex(s => s.id === currentStage);
                const isDone = stageIndex < currentIndex;
                const isActive = stage.id === currentStage;
                return (
                  <div key={stage.id} className="flex items-center gap-1.5">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap ${
                      isDone   ? 'bg-green-600 text-white' :
                      isActive ? 'bg-[#4a90d9] text-white' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {stage.label}
                    </span>
                    {i < PIPELINE_STAGES.length - 1 && <span className="text-gray-400 text-xs font-bold">&gt;</span>}
                  </div>
                );
              })}
            </div>

            {/* Mark as Reviewed header */}
            <Card className="bg-white border border-border p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">Mark as Reviewed</h2>
                  <p className="text-sm text-muted-foreground">
                    Next action: The contract is being reviewed by <span className="text-[#4a90d9]">James Seddon</span>. Once complete, the contract can enter negotiation.
                  </p>
                </div>
                <Button onClick={handleReviewComplete} className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white whitespace-nowrap">
                  Review Complete
                </Button>
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-6">
              {/* Left column - Risk Summary & Risk Review */}
              <div className="space-y-4">
                <Card className="bg-white border border-border p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Risk Summary</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">OVERALL RISK</div>
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-amber-100 text-amber-700">MEDIUM</span>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">GUARDRAILS TRIGGERED</div>
                      <ul className="text-xs text-foreground space-y-1">
                        <li>• LIABILITY CAP ABOVE STANDARD LEVEL</li>
                        <li>• INDEMNITY WORDING BROADER THAN TEMPLATE</li>
                        <li>• EXTENDED LIMITATION PERIOD</li>
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">RED/AMBER GUARDRAILS</div>
                      <ul className="text-xs text-foreground space-y-1">
                        <li>• 1 RED – LIABILITY CAP INCREASED TO £10M (STANDARD £5M)</li>
                        <li>• 2 AMBER – CLIENT INDEMNITY NOT MUTUAL; LIMITATION PERIOD EXTENDED FROM 6 TO 12 YEARS</li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <Card className="bg-white border border-border p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Risk Review</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This opportunity is assessed as <span className="font-semibold text-foreground">medium</span> risk. Scope is clearly non-principal with the client holding all supply chain contracts, and jurisdiction/client track record are standard. The main concerns are below-target margin and a long programme duration, so the bid is acceptable with DOA approval on margin and active monitoring of scope and resourcing.
                  </p>
                  <div className="mt-4 text-right">
                    <button className="text-xs font-semibold text-[#4a90d9] uppercase tracking-wide">Edit</button>
                  </div>
                </Card>
              </div>

              {/* Right column - Review/Details tabs */}
              <div className="col-span-2">
                <Card className="bg-white border border-border">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="flex gap-6">
                      <button className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Review</button>
                      <button className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Details</button>
                    </div>
                    <Button variant="outline" className="text-sm">View Contract</Button>
                  </div>

                  <div className="border-b border-border">
                    <div className="flex gap-6 px-4">
                      <button
                        onClick={() => setReviewSubTab('details')}
                        className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                          reviewSubTab === 'details' ? 'border-[#4a90d9] text-[#4a90d9]' : 'border-transparent text-muted-foreground'
                        }`}
                      >
                        Contract details
                      </button>
                      <button
                        onClick={() => setReviewSubTab('guardrails')}
                        className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                          reviewSubTab === 'guardrails' ? 'border-[#4a90d9] text-[#4a90d9]' : 'border-transparent text-muted-foreground'
                        }`}
                      >
                        Guardrails &amp; Mitigations
                      </button>
                    </div>
                  </div>

                  <div className="p-0">
                    {FLAGGED_CLAUSES.slice(2).map(clause => (
                      <div key={clause.id} className="border-b border-border last:border-0">
                        <button
                          onClick={() => setExpandedClause(expandedClause === clause.id ? null : clause.id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            {expandedClause === clause.id ? <ChevronDown size={16} /> : <ChevronUp size={16} className="rotate-180" />}
                            <span className="text-sm font-medium text-foreground">{clause.title}</span>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-semibold text-white ${clause.riskColor}`}>
                            {clause.risk}
                          </span>
                        </button>
                        {expandedClause === clause.id && (
                          <div className="px-4 pb-4 space-y-3">
                            <div>
                              <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Clause Type</div>
                              <div className="text-sm text-foreground">{clause.clauseType}</div>
                            </div>
                            <div>
                              <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Flagged Clause</div>
                              <div className="text-sm text-muted-foreground italic">{clause.flaggedClause}</div>
                            </div>
                            <div>
                              <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Amendments</div>
                              <div className="text-sm text-muted-foreground">{clause.amendments}</div>
                            </div>
                            {clause.mitigation && (
                              <div>
                                <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Mitigation</div>
                                <div className="text-sm text-muted-foreground">{clause.mitigation}</div>
                              </div>
                            )}
                            <div className="pt-2 text-right">
                              <button className="text-xs font-semibold text-[#4a90d9] uppercase tracking-wide">Edit Mitigation</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-[#1e2a5e] text-white mt-auto">
          <div className="px-4 py-4 text-xs text-white/60 space-y-1">
            <div className="flex gap-3">
              <a href="#" className="hover:text-white transition-colors uppercase text-[10px] tracking-wide">Terms &amp; Conditions</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors uppercase text-[10px] tracking-wide">Privacy Policy</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors uppercase text-[10px] tracking-wide">Cookies Policy</a>
            </div>
            <div className="text-[10px]">Terms and Conditions</div>
          </div>
        </footer>
      </div>
    );
  }

  // Negotiation View (after Review Complete is clicked)
  if (isNegotiating) {
    return (
      <div className="min-h-screen flex flex-col bg-background font-sans">
        {/* Header */}
        <header className="bg-[#1e2a5e] text-white">
          <div className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-3">
              <button className="p-1.5 hover:bg-white/10 rounded"><Grid3X3 size={18} /></button>
              <button className="p-1.5 hover:bg-white/10 rounded">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </button>
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full bg-blue-400 flex items-center justify-center"><span className="text-xs font-bold">H</span></div>
                <span className="text-sm font-semibold tracking-widest">HIVE</span>
              </div>
              <span className="text-white/50 text-sm">Contracts App</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/80">Hi [User first name]</span>
              <button className="p-1.5 hover:bg-white/10 rounded">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </button>
              <button className="p-1.5 hover:bg-white/10 rounded"><HelpCircle size={18} /></button>
              <span className="text-sm">Support</span>
            </div>
          </div>
          <div className="flex gap-0 border-t border-white/10 px-4">
            {['Overview', 'Documents', 'History'].map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setIsNegotiating(false); }}
                className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab ? 'border-white text-white' : 'border-transparent text-white/60 hover:text-white/90'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        {/* Main content - Negotiation View */}
        <main className="flex-1 p-6 bg-gray-50">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Pipeline */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {PIPELINE_STAGES.map((stage, i) => {
                const stageIndex = PIPELINE_STAGES.findIndex(s => s.id === stage.id);
                const negotiationIndex = PIPELINE_STAGES.findIndex(s => s.id === 'negotiation');
                const isDone = stageIndex < negotiationIndex;
                const isActive = stage.id === 'negotiation';
                return (
                  <div key={stage.id} className="flex items-center gap-1.5">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap ${
                      isDone   ? 'bg-green-600 text-white' :
                      isActive ? 'bg-[#4a90d9] text-white' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {stage.label}
                    </span>
                    {i < PIPELINE_STAGES.length - 1 && <span className="text-gray-400 text-xs font-bold">&gt;</span>}
                  </div>
                );
              })}
            </div>

            {/* Mark as Negotiated header */}
            <Card className="bg-white border border-border p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">Mark as Negotiated</h2>
                  <p className="text-sm text-muted-foreground">
                    Next action: The contract is being negotiated with the client by <span className="text-[#4a90d9]">John Doe</span>. Upload any new versions of the contract for re-review or approval.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button onClick={handleOpenUploadModal} variant="outline" className="border-[#4a90d9] text-[#4a90d9] hover:bg-blue-50 whitespace-nowrap">
                    Upload New Contract Version
                  </Button>
                  <Button onClick={handleSubmitForApproval} className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white whitespace-nowrap">
                    Submit for Approval
                  </Button>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-6">
              {/* Left column - Risk Summary & Risk Review */}
              <div className="space-y-4">
                <Card className="bg-white border border-border p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Risk Summary</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">OVERALL RISK</div>
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-amber-100 text-amber-700">MEDIUM</span>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">GUARDRAILS TRIGGERED</div>
                      <ul className="text-xs text-foreground space-y-1">
                        <li>• LIABILITY CAP ABOVE STANDARD LEVEL</li>
                        <li>• INDEMNITY WORDING BROADER THAN TEMPLATE</li>
                        <li>• EXTENDED LIMITATION PERIOD</li>
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">RED/AMBER GUARDRAILS</div>
                      <ul className="text-xs text-foreground space-y-1">
                        <li>• 1 RED – LIABILITY CAP INCREASED TO £10M (STANDARD £5M)</li>
                        <li>• 2 AMBER – CLIENT INDEMNITY NOT MUTUAL; LIMITATION PERIOD EXTENDED FROM 6 TO 12 YEARS</li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <Card className="bg-white border border-border p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Risk Review</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This opportunity is assessed as <span className="font-semibold text-foreground">medium</span> risk. Scope is clearly non-principal with the client holding all supply chain contracts, and jurisdiction/client track record are standard. The main concerns are below-target margin and a long programme duration, so the bid is acceptable with DOA approval on margin and active monitoring of scope and resourcing.
                  </p>
                  <div className="mt-4 text-right">
                    <button className="text-xs font-semibold text-[#4a90d9] uppercase tracking-wide">Edit</button>
                  </div>
                </Card>
              </div>

              {/* Right column - Review/Details tabs */}
              <div className="col-span-2">
                <Card className="bg-white border border-border">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="flex gap-6">
                      <button className="text-sm font-semibold text-foreground">REVIEW</button>
                      <button className="text-sm font-semibold text-muted-foreground">DETAILS</button>
                    </div>
                    <Button className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white text-sm">
                      View Contract
                    </Button>
                  </div>
                  <div className="px-5 flex gap-6 border-b border-border">
                    <button
                      onClick={() => setReviewSubTab('details')}
                      className={`pb-2.5 pt-3 text-sm transition-colors ${reviewSubTab === 'details' ? 'text-[#4a90d9] border-b-2 border-[#4a90d9] font-medium' : 'text-muted-foreground'}`}
                    >
                      Contract details
                    </button>
                    <button
                      onClick={() => setReviewSubTab('guardrails')}
                      className={`pb-2.5 pt-3 text-sm transition-colors ${reviewSubTab === 'guardrails' ? 'text-[#4a90d9] border-b-2 border-[#4a90d9] font-medium' : 'text-muted-foreground'}`}
                    >
                      Guardrails &amp; Mitigations
                    </button>
                  </div>

                  {/* Guardrails accordion */}
                  <div className="divide-y divide-border">
                    {FLAGGED_CLAUSES.map(clause => (
                      <div key={clause.id} className="px-5">
                        <button
                          onClick={() => setExpandedClause(expandedClause === clause.id ? null : clause.id)}
                          className="w-full flex items-center justify-between py-4"
                        >
                          <div className="flex items-center gap-2">
                            <ChevronDown size={16} className={`text-muted-foreground transition-transform ${expandedClause === clause.id ? 'rotate-180' : ''}`} />
                            <span className="text-sm font-medium text-foreground">{clause.title}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            clause.risk === 'VERY HIGH' || clause.risk === 'UNACCEPTABLE' ? 'bg-red-100 text-red-700' :
                            clause.risk === 'HIGH' ? 'bg-yellow-100 text-yellow-700' :
                            clause.risk === 'MEDIUM' ? 'bg-gray-100 text-gray-600' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {clause.risk}
                          </span>
                        </button>
                        {expandedClause === clause.id && (
                          <div className="pb-5 pl-6 space-y-4">
                            <div>
                              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Clause Type</div>
                              <p className="text-sm text-muted-foreground">{clause.clauseType}</p>
                            </div>
                            <div>
                              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Flagged Clause</div>
                              <p className="text-sm text-muted-foreground italic">{clause.flaggedClause}</p>
                            </div>
                            <div>
                              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Amendments</div>
                              <p className="text-sm text-muted-foreground">{clause.amendments}</p>
                            </div>
                            <div>
                              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Mitigation</div>
                              <p className="text-sm text-muted-foreground">
                                We have agreed a higher PI cap of £10m (standard £5m) but confirmed with Insurance that cover is available on existing terms. The higher cap is limited to this project only and excludes consequential loss and indirect damages. Fee levels have been uplifted to reflect the additional exposure, and this position will be reviewed at each annual renewal.
                              </p>
                            </div>
                            <div className="text-right">
                              <button className="text-xs font-semibold text-[#4a90d9] uppercase tracking-wide">Edit Mitigation</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-[#1e2a5e] text-white px-4 py-3">
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-wide">
            <a href="#" className="text-[#4a90d9]">Terms &amp; Conditions</a>
            <span className="text-white/40">|</span>
            <a href="#" className="text-[#4a90d9]">Privacy Policy</a>
            <span className="text-white/40">|</span>
            <a href="#" className="text-[#4a90d9]">Cookies Policy</a>
          </div>
          <div className="text-[10px]">Terms and Conditions</div>
        </footer>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <Card className="w-full max-w-md bg-white border-0 shadow-lg">
              <div className="p-6 space-y-6">
                {/* Step 1: Upload */}
                {uploadStep === 'upload' && (
                  <>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground mb-1">Upload a New Contract Version</h2>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-2">Document title</label>
                        <input
                          type="text"
                          placeholder="Contract1234_GlobalMSA_v1.5"
                          className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#4a90d9]"
                        />
                      </div>

                      {/* File upload area */}
                      <div
                        className="border-2 border-dashed border-border rounded p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setUploadedFileName('Contract1234_GlobalMSA_v1.5')}
                      >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground mb-2">
                          <path d="M12 2v20M2 12h20"/><path d="M6 6h12v12H6z" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <p className="text-sm text-foreground font-medium">+ Drag and drop to upload</p>
                      </div>

                      {/* Uploaded file card */}
                      {uploadedFileName && (
                        <div className="border border-border rounded p-4 flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-foreground">{uploadedFileName}</div>
                              <div className="text-xs text-muted-foreground mt-1">Type: Contract</div>
                              <div className="text-xs text-muted-foreground">Created: 15/10/2025</div>
                              <div className="text-xs text-muted-foreground">1.2mb</div>
                            </div>
                          </div>
                          <button
                            onClick={() => setUploadedFileName('')}
                            className="p-1 hover:bg-gray-100 rounded flex-shrink-0"
                          >
                            <Trash2 size={16} className="text-muted-foreground" />
                          </button>
                        </div>
                      )}

                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-2">Select contract to supersede</label>
                        <select className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#4a90d9] bg-white">
                          <option value="">-- Select --</option>
                          <option value="v1">Contract1234_GlobalMSA_v1.4</option>
                          <option value="v2">Contract1234_GlobalMSA_v1.3</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <button
                        onClick={handleCloseUploadModal}
                        className="text-sm font-medium text-[#4a90d9] hover:text-[#3a7fc9]"
                      >
                        Cancel
                      </button>
                      <Button
                        onClick={handleUploadNext}
                        disabled={!uploadedFileName}
                        className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white disabled:opacity-40"
                      >
                        Add
                      </Button>
                    </div>
                  </>
                )}

                {/* Step 2: Next Action */}
                {uploadStep === 'action' && (
                  <>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground mb-4">WHAT IS THE NEXT ACTION FOR THIS CONTRACT?</h2>
                      <p className="text-sm text-muted-foreground">Select the status of the contract to determine the appropriate review and approval workflow.</p>
                    </div>

                    <div className="space-y-3">
                      {[
                        { id: 'approval', title: 'Ready for approval', desc: 'The contract has been reviewed and is ready to proceed to approval and signature.' },
                        { id: 're-review', title: 'Contract to be re-reviewed', desc: 'Upload a revised version of the contract so it can be reviewed again.' },
                        { id: 'no-action', title: 'No Action', desc: 'Record this version without starting a review or approval process.' },
                      ].map(option => (
                        <button
                          key={option.id}
                          onClick={() => setNextAction(option.id as 'approval' | 're-review' | 'no-action')}
                          className={`w-full flex items-start gap-3 p-4 rounded border-2 transition-colors text-left ${
                            nextAction === option.id
                              ? 'border-[#4a90d9] bg-blue-50'
                              : 'border-border hover:border-gray-400 bg-white'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                            nextAction === option.id ? 'border-[#4a90d9]' : 'border-gray-300'
                          }`}>
                            {nextAction === option.id && <div className="w-2.5 h-2.5 rounded-full bg-[#4a90d9]" />}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-foreground">{option.title}</div>
                            <div className="text-xs text-muted-foreground mt-1">{option.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <button
                        onClick={() => setUploadStep('upload')}
                        className="text-sm font-medium text-[#4a90d9] hover:text-[#3a7fc9]"
                      >
                        Cancel
                      </button>
                      <Button
                        onClick={handleAddVersion}
                        disabled={!nextAction}
                        className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white disabled:opacity-40"
                      >
                        Next
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // Approval View
  if (isApproving) {
    const approvalIndex = PIPELINE_STAGES.findIndex(s => s.id === 'approval');
    return (
      <div className="min-h-screen flex flex-col bg-background font-sans">
        {/* Header */}
        <header className="bg-[#1e2a5e] text-white">
          <div className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-3">
              <button className="p-1.5 hover:bg-white/10 rounded"><Grid3X3 size={18} /></button>
              <button className="p-1.5 hover:bg-white/10 rounded">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </button>
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full bg-blue-400 flex items-center justify-center"><span className="text-xs font-bold">H</span></div>
                <span className="text-sm font-semibold tracking-widest">HIVE</span>
              </div>
              <span className="text-white/50 text-sm">Contracts App</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/80">Hi [User first name]</span>
              <button className="p-1.5 hover:bg-white/10 rounded">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </button>
              <button className="p-1.5 hover:bg-white/10 rounded"><HelpCircle size={18} /></button>
              <span className="text-sm">Support</span>
            </div>
          </div>
          <div className="px-4 py-2 border-t border-white/10">
            <div className="text-sm font-semibold">1 LONDON STREET - 1823456</div>
            <div className="text-xs text-white/60">CONTRACT: MSA 12345678</div>
          </div>
          <div className="flex gap-0 border-t border-white/10 px-4">
            {['Overview', 'Documents', 'History', 'Workspaces'].map(tab => (
              <button
                key={tab}
                className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                  tab === 'Overview' ? 'border-white text-white' : 'border-transparent text-white/60 hover:text-white/90'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        <main className="flex-1 p-6 bg-gray-50">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Pipeline */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {PIPELINE_STAGES.map((stage, i) => {
                const stageIndex = PIPELINE_STAGES.findIndex(s => s.id === stage.id);
                const isDone = stageIndex < approvalIndex;
                const isActive = stage.id === 'approval';
                return (
                  <div key={stage.id} className="flex items-center gap-1.5">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                      isDone   ? 'bg-green-600 text-white' :
                      isActive ? 'bg-[#4a90d9] text-white' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {stage.label}
                    </span>
                    {i < PIPELINE_STAGES.length - 1 && <span className="text-gray-400 text-xs font-bold">&gt;</span>}
                  </div>
                );
              })}
            </div>

            {/* Select Approver Action card */}
            <Card className="bg-white border border-border p-5">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">Select Approver Action</h2>
                  <p className="text-sm text-muted-foreground">
                    Next action: The contract is being approved by <span className="text-[#4a90d9] font-medium">John Doe</span>. Review the contract details and risk position and select an option
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button variant="outline" className="border-[#4a90d9] text-[#4a90d9] hover:bg-blue-50 whitespace-nowrap text-sm">
                    Request more Information
                  </Button>
                  <Button className="bg-red-600 hover:bg-red-700 text-white whitespace-nowrap text-sm">
                    Reject
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap text-sm">
                    Approve
                  </Button>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-6">
              {/* Left column */}
              <div className="space-y-4">
                <Card className="bg-white border border-border p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Risk Summary</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">OVERALL RISK</div>
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-amber-100 text-amber-700">MEDIUM</span>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">GUARDRAILS TRIGGERED</div>
                      <ul className="text-xs text-foreground space-y-1">
                        <li>• LIABILITY CAP ABOVE STANDARD LEVEL</li>
                        <li>• INDEMNITY WORDING BROADER THAN TEMPLATE</li>
                        <li>• EXTENDED LIMITATION PERIOD</li>
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">RED/AMBER GUARDRAILS</div>
                      <ul className="text-xs text-foreground space-y-1">
                        <li>• 1 RED – LIABILITY CAP INCREASED TO £10M (STANDARD £5M)</li>
                        <li>• 2 AMBER – CLIENT INDEMNITY NOT MUTUAL; LIMITATION PERIOD EXTENDED FROM 6 TO 12 YEARS</li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <Card className="bg-white border border-border p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Risk Review</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This opportunity is assessed as <span className="font-semibold text-foreground">medium</span> risk. Scope is clearly non-principal with the client holding all supply chain contracts, and jurisdiction/client track record are standard. The main concerns are below-target margin and a long programme duration, so the bid is acceptable with DOA approval on margin and active monitoring of scope and resourcing.
                  </p>
                </Card>
              </div>

              {/* Right column */}
              <div className="col-span-2">
                <Card className="bg-white border border-border">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="flex gap-6">
                      <button className="text-sm font-semibold text-foreground">REVIEW</button>
                      <button className="text-sm font-semibold text-muted-foreground">DETAILS</button>
                    </div>
                    <Button className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white text-sm">
                      View Contract
                    </Button>
                  </div>
                  <div className="px-5 flex gap-6 border-b border-border">
                    <button className="pb-2.5 pt-3 text-sm text-muted-foreground">Contract details</button>
                    <button className="pb-2.5 pt-3 text-sm text-[#4a90d9] border-b-2 border-[#4a90d9] font-medium">
                      Guardrails &amp; Mitigations
                    </button>
                  </div>

                  <div className="divide-y divide-border">
                    {FLAGGED_CLAUSES.map(clause => (
                      <div key={clause.id} className="px-5">
                        <button
                          onClick={() => setExpandedClause(expandedClause === clause.id ? null : clause.id)}
                          className="w-full flex items-center justify-between py-4"
                        >
                          <div className="flex items-center gap-2">
                            <ChevronDown size={16} className={`text-muted-foreground transition-transform ${expandedClause === clause.id ? 'rotate-180' : ''}`} />
                            <span className="text-sm font-medium text-foreground">{clause.title}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            clause.risk === 'VERY HIGH' || clause.risk === 'UNACCEPTABLE' ? 'bg-red-100 text-red-700' :
                            clause.risk === 'HIGH' ? 'bg-red-100 text-red-700' :
                            clause.risk === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {clause.risk}
                          </span>
                        </button>
                        {expandedClause === clause.id && (
                          <div className="pb-5 pl-6 space-y-4">
                            <div>
                              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Clause Type</div>
                              <p className="text-sm text-muted-foreground">{clause.clauseType}</p>
                            </div>
                            <div>
                              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Flagged Clause</div>
                              <p className="text-sm text-muted-foreground italic">{clause.flaggedClause}</p>
                            </div>
                            <div>
                              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Amendments</div>
                              <p className="text-sm text-muted-foreground">{clause.amendments}</p>
                            </div>
                            <div>
                              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Mitigation</div>
                              <p className="text-sm text-muted-foreground">
                                We have agreed a higher PI cap of £10m (standard £5m) but confirmed with Insurance that cover is available on existing terms. The higher cap is limited to this project only and excludes consequential loss and indirect damages. Fee levels have been uplifted to reflect the additional exposure, and this position will be reviewed at each annual renewal.
                              </p>
                            </div>
                            <div className="text-right">
                              <button className="text-xs font-semibold text-[#4a90d9] uppercase tracking-wide">Edit Mitigation</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>

        <footer className="bg-[#1e2a5e] text-white px-4 py-3">
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-wide">
            <a href="#" className="text-[#4a90d9]">Terms &amp; Conditions</a>
            <span className="text-white/40">|</span>
            <a href="#" className="text-[#4a90d9]">Privacy Policy</a>
            <span className="text-white/40">|</span>
            <a href="#" className="text-[#4a90d9]">Cookies Policy</a>
          </div>
          <div className="text-[10px]">Terms and Conditions</div>
        </footer>
      </div>
    );
  }

  // Default Overview view
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">

      {/* Top nav */}
      <header className="bg-[#1e2a5e] text-white">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-3">
            <button className="p-1.5 hover:bg-white/10 rounded">
              <Grid3X3 size={18} />
            </button>
            <button className="p-1.5 hover:bg-white/10 rounded">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-blue-400 flex items-center justify-center">
                <span className="text-xs font-bold">H</span>
              </div>
              <span className="text-sm font-semibold tracking-widest">HIVE</span>
            </div>
            <span className="text-white/50 text-sm">Contracts App</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/80">Hi [User first name]</span>
            <button className="p-1.5 hover:bg-white/10 rounded">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </button>
            <button className="p-1.5 hover:bg-white/10 rounded">
              <HelpCircle size={18} />
            </button>
            <span className="text-sm">Support</span>
          </div>
        </div>

        {/* Breadcrumb row */}
        <div className="bg-[#1e2a5e] border-t border-white/10 px-4 py-2 flex items-center gap-3">
          <button onClick={() => router.back()} className="hover:bg-white/10 rounded p-1">
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="text-sm font-semibold">1 LONDON STREET – 1823456</div>
            <div className="text-xs text-white/60">CONTRACT: MSA 12345678</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-t border-white/10 px-4">
          {CONTRACT_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? 'border-white text-white'
                  : 'border-transparent text-white/60 hover:text-white/90'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-6">

            {/* Left: General Information */}
            <Card className="bg-white border border-border p-5 col-span-1 self-start">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">General Information</h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-green-600 text-white font-semibold">Contract</span>
              </div>

              <div className="space-y-5">
                {/* Client */}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Client</div>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded bg-red-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs">HSBC</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#4a90d9]">HSBC</div>
                      <div className="text-xs text-muted-foreground">123 London Road</div>
                      <div className="text-xs text-muted-foreground">London</div>
                      <div className="text-xs text-muted-foreground">W1F 5AS</div>
                      <a href="#" className="text-xs text-[#4a90d9] font-semibold flex items-center gap-1 mt-1">
                        VIEW WEBSITE <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                  <div className="mt-3 space-y-0.5 text-xs text-muted-foreground">
                    <div>UK\ADVISORY\SHQ\UK</div>
                    <div>HSBC GLOBAL</div>
                    <div>1 LONDON STREET</div>
                  </div>
                </div>

                {/* Director */}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Director</div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">MW</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#4a90d9]">Mary Watkins</div>
                      <div className="text-xs text-muted-foreground">Director</div>
                      <div className="text-xs text-muted-foreground">London</div>
                    </div>
                  </div>
                </div>

                {/* Opportunity Manager */}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Opportunity Manager</div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">JD</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#4a90d9]">John Douglas</div>
                      <div className="text-xs text-muted-foreground">Associate Director</div>
                      <div className="text-xs text-muted-foreground">London</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Right: Pipeline + Contract Info */}
            <div className="col-span-2 space-y-4">

              {/* Pipeline */}
              <Card className="bg-white border border-border p-4">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {PIPELINE_STAGES.map((stage, i) => (
                    <div key={stage.id} className="flex items-center gap-1.5">
                      <button className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap ${
                        stage.done   ? 'bg-green-600 text-white' :
                        stage.active ? 'bg-[#4a90d9] text-white' :
                        'bg-gray-200 text-gray-500'
                      }`}>
                        {stage.label}
                      </button>
                      {i < PIPELINE_STAGES.length - 1 && (
                        <span className="text-gray-400 text-xs font-bold">&gt;</span>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Step callout */}
              <Card className="bg-white border border-border p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">STEP 1 OF 8</div>
                    <div className="text-base font-semibold text-foreground mb-1">Review contract</div>
                    <div className="text-sm text-muted-foreground">The contract will need to be reviewed before submitting for approval.</div>
                  </div>
                  <Button onClick={handleStartReview} className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white whitespace-nowrap flex-shrink-0">
                    Start review
                  </Button>
                </div>
              </Card>

              {/* Contract Information table */}
              <Card className="bg-white border border-border">
                <div className="px-5 py-3.5 border-b border-border">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contract Information</h3>
                </div>
                <div>
                  {CONTRACT_INFO_ROWS.map((row, i) => (
                    <div key={i} className={`flex items-center px-5 py-3 ${i < CONTRACT_INFO_ROWS.length - 1 ? 'border-b border-border' : ''}`}>
                      <span className="w-64 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex-shrink-0">{row.label}</span>
                      <span className="text-sm text-foreground">{row.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-[#1e2a5e] text-white mt-auto">
        <div className="px-4 py-4 text-xs text-white/60 space-y-1">
          <div className="flex gap-3">
            <a href="#" className="hover:text-white transition-colors uppercase text-[10px] tracking-wide">Terms &amp; Conditions</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors uppercase text-[10px] tracking-wide">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors uppercase text-[10px] tracking-wide">Cookies Policy</a>
          </div>
          <div className="text-[10px]">Terms and Conditions</div>
        </div>
      </footer>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <Card className="w-full max-w-md bg-white border-0 shadow-lg">
            <div className="p-6 space-y-6">
              {/* Step 1: Upload */}
              {uploadStep === 'upload' && (
                <>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-1">Upload a New Contract Version</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-2">Document title</label>
                      <input
                        type="text"
                        placeholder="Contract1234_GlobalMSA_v1.5"
                        className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#4a90d9]"
                      />
                    </div>

                    {/* File upload area */}
                    <div
                      className="border-2 border-dashed border-border rounded p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setUploadedFileName('Contract1234_GlobalMSA_v1.5')}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground mb-2">
                        <path d="M12 2v20M2 12h20"/><path d="M6 6h12v12H6z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <p className="text-sm text-foreground font-medium">+ Drag and drop to upload</p>
                    </div>

                    {/* Uploaded file card */}
                    {uploadedFileName && (
                      <div className="border border-border rounded p-4 flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-foreground">{uploadedFileName}</div>
                            <div className="text-xs text-muted-foreground mt-1">Type: Contract</div>
                            <div className="text-xs text-muted-foreground">Created: 15/10/2025</div>
                            <div className="text-xs text-muted-foreground">1.2mb</div>
                          </div>
                        </div>
                        <button
                          onClick={() => setUploadedFileName('')}
                          className="p-1 hover:bg-gray-100 rounded flex-shrink-0"
                        >
                          <Trash2 size={16} className="text-muted-foreground" />
                        </button>
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-2">Select contract to supersede</label>
                      <select className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#4a90d9] bg-white">
                        <option value="">-- Select --</option>
                        <option value="v1">Contract1234_GlobalMSA_v1.4</option>
                        <option value="v2">Contract1234_GlobalMSA_v1.3</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <button
                      onClick={handleCloseUploadModal}
                      className="text-sm font-medium text-[#4a90d9] hover:text-[#3a7fc9]"
                    >
                      Cancel
                    </button>
                    <Button
                      onClick={handleUploadNext}
                      disabled={!uploadedFileName}
                      className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white disabled:opacity-40"
                    >
                      Add
                    </Button>
                  </div>
                </>
              )}

              {/* Step 2: Next Action */}
              {uploadStep === 'action' && (
                <>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">WHAT IS THE NEXT ACTION FOR THIS CONTRACT?</h2>
                    <p className="text-sm text-muted-foreground">Select the status of the contract to determine the appropriate review and approval workflow.</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { id: 'approval', title: 'Ready for approval', desc: 'The contract has been reviewed and is ready to proceed to approval and signature.' },
                      { id: 're-review', title: 'Contract to be re-reviewed', desc: 'Upload a revised version of the contract so it can be reviewed again.' },
                      { id: 'no-action', title: 'No Action', desc: 'Record this version without starting a review or approval process.' },
                    ].map(option => (
                      <button
                        key={option.id}
                        onClick={() => setNextAction(option.id as 'approval' | 're-review' | 'no-action')}
                        className={`w-full flex items-start gap-3 p-4 rounded border-2 transition-colors text-left ${
                          nextAction === option.id
                            ? 'border-[#4a90d9] bg-blue-50'
                            : 'border-border hover:border-gray-400 bg-white'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                          nextAction === option.id ? 'border-[#4a90d9]' : 'border-gray-300'
                        }`}>
                          {nextAction === option.id && <div className="w-2.5 h-2.5 rounded-full bg-[#4a90d9]" />}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-foreground">{option.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{option.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <button
                      onClick={() => setUploadStep('upload')}
                      className="text-sm font-medium text-[#4a90d9] hover:text-[#3a7fc9]"
                    >
                      Cancel
                    </button>
                    <Button
                      onClick={handleAddVersion}
                      disabled={!nextAction}
                      className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white disabled:opacity-40"
                    >
                      Next
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
// v2
