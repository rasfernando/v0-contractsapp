'use client';
// Contract page with full workflow: review, negotiation, approval, signing

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Grid3X3, HelpCircle, ExternalLink, ChevronDown, ChevronUp, Flag, ZoomIn, ZoomOut, FileText, Trash2 } from 'lucide-react';
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
  { label: 'CONTRACT TYPE',                     value: 'STANDALONE' },
  { label: 'CLIENT SIGNING DATE',               value: '–' },
  { label: 'PRIMARY CONTRACT',                  value: 'YES' },
  { label: 'LOD LEVEL',                         value: 'LEVEL 2' },
  { label: 'APPROVAL TO START WITHOUT SIGNING', value: '–' },
  { label: 'CONTRACT END DATE',                 value: '–' },
  { label: 'CONTRACT TITLE',                    value: '1 LONDON STREET STANDALONE ONE OFF V1' },
  { label: 'REVIEW DATE REQUIRED',              value: '01/2/2026' },
  { label: 'OUR SIGNING DATE',                  value: '–' },
];

const FLAGGED_CLAUSES = [
  {
    id: 1,
    title: 'Professional indemnity insurance / potential unlimited liability',
    risk: 'VERY HIGH',
    riskColor: 'bg-red-100 text-red-700',
    clauseType: 'Insurance',
    flaggedClause: '"When reasonably requested by us you are to provide documentary evidence that the insurance required under this Appointment is being maintained."',
    amendments: "Clauses requiring you to maintain PI insurance and prove it — where the same area of the contract doesn't clearly cap your overall liability. It's flagging possible exposure above your insurance limits.",
    mitigation: null,
  },
  {
    id: 2,
    title: 'Sub-consultant payment terms',
    risk: 'UNACCEPTABLE',
    riskColor: 'bg-gray-200 text-gray-700',
    clauseType: 'Payment Terms',
    flaggedClause: 'Payment terms for sub-consultants extend beyond 60 days.',
    amendments: 'Standard payment terms should not exceed 30 days for sub-consultants.',
    mitigation: null,
  },
  {
    id: 3,
    title: 'Liability cap above standard level',
    risk: 'HIGH',
    riskColor: 'bg-amber-100 text-amber-700',
    clauseType: 'Liability / Limitation of liability',
    flaggedClause: '"The Consultant\'s aggregate liability to the Client arising out of or in connection with this Agreement shall be limited to an amount equal to 200% of the Fees or £10,000,000, whichever is greater."',
    amendments: "The Consultant's total aggregate liability shall be limited to £5,000,000 (five million pounds). This cap applies to all claims in aggregate.",
    mitigation: "We have agreed a higher PI cap of £10m (standard £5m) but confirmed with Insurance that cover is available on existing terms. The higher cap is limited to this project only and excludes consequential loss.",
  },
  {
    id: 4,
    title: 'Indemnity wording broader than template',
    risk: 'MEDIUM',
    riskColor: 'bg-gray-100 text-gray-600',
    clauseType: 'Indemnity',
    flaggedClause: 'Indemnity clause extends beyond standard template wording.',
    amendments: 'Review and narrow the indemnity scope to match template.',
    mitigation: null,
  },
  {
    id: 5,
    title: 'Extended limitation period (beyond 6 years)',
    risk: 'MEDIUM',
    riskColor: 'bg-gray-100 text-gray-600',
    clauseType: 'Limitation period / Time bar',
    flaggedClause: 'Limitation period extends to 12 years.',
    amendments: 'Standard limitation period is 6 years.',
    mitigation: null,
  },
  {
    id: 6,
    title: 'Unfavourable payment terms (long payment period / pay-when-paid)',
    risk: 'LOW',
    riskColor: 'bg-green-100 text-green-700',
    clauseType: 'Payment Terms / Commercial',
    flaggedClause: 'Payment terms extend to 90 days.',
    amendments: 'Standard payment terms are 30 days.',
    mitigation: null,
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
  { num: '7.1', text: "The payer (or specified person, if any) may give the payee notice of the payer's intention to pay less than the notified sum (payment reduction notice) and such notice must specify:", highlighted: true },
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

// ─── Shared sub-components ───────────────────────────────────────────────────

function AppHeader({
  breadcrumb,
  tabs,
  activeTab,
  onTabChange,
}: {
  breadcrumb?: boolean;
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  return (
    <header className="bg-[#1e2a5e] text-white">
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-3">
          <button className="p-1.5 hover:bg-white/10 rounded"><Grid3X3 size={18} /></button>
          <button className="p-1.5 hover:bg-white/10 rounded">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </button>
          <button className="p-1.5 hover:bg-white/10 rounded"><HelpCircle size={18} /></button>
          <span className="text-sm">Support</span>
        </div>
      </div>

      {breadcrumb && (
        <div className="border-t border-white/10 px-4 py-2 flex items-center gap-3">
          <button onClick={() => onTabChange(activeTab)} className="hover:bg-white/10 rounded p-1">
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="text-sm font-semibold">1 LONDON STREET – 1823456</div>
            <div className="text-xs text-white/60">CONTRACT: MSA 12345678</div>
          </div>
        </div>
      )}

      <div className="flex gap-0 border-t border-white/10 px-4">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab ? 'border-white text-white' : 'border-transparent text-white/60 hover:text-white/90'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </header>
  );
}

function AppFooter() {
  return (
    <footer className="bg-[#1e2a5e] text-white px-4 py-3">
      <div className="flex items-center gap-3 text-[10px] uppercase tracking-wide text-white/60">
        <a href="#" className="hover:text-white transition-colors">Terms &amp; Conditions</a>
        <span>|</span>
        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        <span>|</span>
        <a href="#" className="hover:text-white transition-colors">Cookies Policy</a>
      </div>
      <div className="text-[10px] text-white/60 mt-0.5">Terms and Conditions</div>
    </footer>
  );
}

function PipelineBar({ activeStageId }: { activeStageId: string }) {
  const activeIndex = PIPELINE_STAGES.findIndex(s => s.id === activeStageId);
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {PIPELINE_STAGES.map((stage, i) => {
        const idx = PIPELINE_STAGES.findIndex(s => s.id === stage.id);
        const isDone = idx < activeIndex;
        const isActive = stage.id === activeStageId;
        return (
          <div key={stage.id} className="flex items-center gap-1.5">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
              isDone   ? 'bg-green-600 text-white' :
              isActive ? 'bg-[#4a90d9] text-white' :
              'bg-gray-200 text-gray-500'
            }`}>
              {stage.label}
            </span>
            {i < PIPELINE_STAGES.length - 1 && <span className="text-gray-400 text-xs font-bold">{'>'}</span>}
          </div>
        );
      })}
    </div>
  );
}

function RiskSummaryCard() {
  return (
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
  );
}

function RiskReviewCard({ showEdit = true }: { showEdit?: boolean }) {
  return (
    <Card className="bg-white border border-border p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Risk Review</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        This opportunity is assessed as <span className="font-semibold text-foreground">medium</span> risk. Scope is clearly
        non-principal with the client holding all supply chain contracts, and jurisdiction/client track record are standard.
        The main concerns are below-target margin and a long programme duration, so the bid is acceptable with DOA approval
        on margin and active monitoring of scope and resourcing.
      </p>
      {showEdit && (
        <div className="mt-4 text-right">
          <button className="text-xs font-semibold text-[#4a90d9] uppercase tracking-wide">Edit</button>
        </div>
      )}
    </Card>
  );
}

function GuardrailsPanel({
  expandedClause,
  setExpandedClause,
  clauses = FLAGGED_CLAUSES,
}: {
  expandedClause: number | null;
  setExpandedClause: (id: number | null) => void;
  clauses?: typeof FLAGGED_CLAUSES;
}) {
  return (
    <div className="divide-y divide-border">
      {clauses.map(clause => (
        <div key={clause.id} className="px-5">
          <button
            onClick={() => setExpandedClause(expandedClause === clause.id ? null : clause.id)}
            className="w-full flex items-center justify-between py-4 text-left"
          >
            <div className="flex items-center gap-2">
              <ChevronDown
                size={16}
                className={`text-muted-foreground transition-transform ${expandedClause === clause.id ? 'rotate-180' : ''}`}
              />
              <span className="text-sm font-medium text-foreground">{clause.title}</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${clause.riskColor}`}>
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
              {clause.mitigation && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Mitigation</div>
                  <p className="text-sm text-muted-foreground">{clause.mitigation}</p>
                </div>
              )}
              <div className="text-right">
                <button className="text-xs font-semibold text-[#4a90d9] uppercase tracking-wide">Edit Mitigation</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Upload Tray ─────────────────────────────────────────────────────────────

function UploadTray({
  uploadStep,
  uploadedFileName,
  nextAction,
  onClose,
  onNext,
  onAdd,
  onSetFileName,
  onSetNextAction,
  onBackToUpload,
}: {
  uploadStep: 'upload' | 'action';
  uploadedFileName: string;
  nextAction: 'approval' | 're-review' | 'no-action' | null;
  onClose: () => void;
  onNext: () => void;
  onAdd: () => void;
  onSetFileName: (name: string) => void;
  onSetNextAction: (action: 'approval' | 're-review' | 'no-action') => void;
  onBackToUpload: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex-1 overflow-y-auto p-8">

          {uploadStep === 'upload' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Upload a New Contract Version</h2>
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-2">Document title</label>
                  <input
                    type="text"
                    defaultValue="Contract1234_GlobalMSA_v1.5"
                    className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a90d9]"
                  />
                </div>

                {!uploadedFileName && (
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => onSetFileName('Contract1234_GlobalMSA_v1.5')}
                  >
                    <FileText size={40} className="text-muted-foreground mb-3" />
                    <p className="text-sm text-foreground font-medium">+ Drag and drop to upload</p>
                  </div>
                )}

                {uploadedFileName && (
                  <div className="border border-border rounded-lg p-5 flex items-start justify-between bg-gray-50">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-border">
                        <FileText size={24} className="text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-foreground mb-1">{uploadedFileName}</div>
                        <div className="text-xs text-muted-foreground">Type: Contract</div>
                        <div className="text-xs text-muted-foreground">Created: 15/10/2025</div>
                        <div className="text-xs text-muted-foreground">1.2mb</div>
                      </div>
                    </div>
                    <button
                      onClick={() => onSetFileName('')}
                      className="p-2 hover:bg-gray-200 rounded flex-shrink-0 transition-colors"
                    >
                      <Trash2 size={18} className="text-muted-foreground" />
                    </button>
                  </div>
                )}

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-2">Select contract to supersede</label>
                  <select className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a90d9] bg-white text-muted-foreground">
                    <option value="">Select contract to supersede</option>
                    <option value="v1">Contract1234_GlobalMSA_v1.4</option>
                    <option value="v2">Contract1234_GlobalMSA_v1.3</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {uploadStep === 'action' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2 uppercase tracking-wide">
                  What is the next action for this contract?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Select the status of the contract to determine the appropriate review and approval workflow.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  { id: 'approval',   title: 'Ready for approval',         desc: 'The contract has been reviewed and is ready to proceed to approval and signature.' },
                  { id: 're-review',  title: 'Contract to be re-reviewed',  desc: 'Upload a revised version of the contract so it can be reviewed again.' },
                  { id: 'no-action',  title: 'No Action',                  desc: 'Record this version without starting a review or approval process.' },
                ].map(option => (
                  <button
                    key={option.id}
                    onClick={() => onSetNextAction(option.id as 'approval' | 're-review' | 'no-action')}
                    className={`w-full flex items-start gap-4 p-5 rounded-lg border-2 transition-all text-left ${
                      nextAction === option.id
                        ? 'border-[#4a90d9] bg-blue-50'
                        : 'border-border hover:border-gray-400 bg-white'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                      nextAction === option.id ? 'border-[#4a90d9]' : 'border-gray-400'
                    }`}>
                      {nextAction === option.id && <div className="w-3 h-3 rounded-full bg-[#4a90d9]" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-foreground mb-1">{option.title}</div>
                      <div className="text-sm text-muted-foreground">{option.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        <div className="border-t border-border p-6 bg-gray-50 flex items-center justify-between">
          <Button
            onClick={uploadStep === 'action' ? onBackToUpload : onClose}
            variant="ghost"
            className="text-[#4a90d9] hover:text-[#3a7fc9] hover:bg-blue-50"
          >
            Cancel
          </Button>
          {uploadStep === 'upload' ? (
            <Button
              onClick={onNext}
              disabled={!uploadedFileName}
              className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white disabled:opacity-40"
            >
              Add
            </Button>
          ) : (
            <Button
              onClick={onAdd}
              disabled={!nextAction}
              className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white disabled:opacity-40"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Approval Explanation Tray ───────────────────────────────────────────────

function ApprovalExplanationTray({
  action,
  explanation,
  onExplanationChange,
  onSubmit,
  onClose,
}: {
  action: 'request-info' | 'reject';
  explanation: string;
  onExplanationChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  const title = action === 'request-info' ? 'Request More Information' : 'Reject Contract';
  const desc = action === 'request-info'
    ? 'Please provide details about what additional information is needed before this contract can be approved.'
    : 'Please provide a reason for rejecting this contract.';

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex-1 overflow-y-auto p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-2">
                {action === 'request-info' ? 'Information Required' : 'Reason for Rejection'}
              </label>
              <textarea
                value={explanation}
                onChange={(e) => onExplanationChange(e.target.value)}
                rows={6}
                placeholder={action === 'request-info' 
                  ? 'Describe what information is needed...'
                  : 'Provide reasons for rejection...'
                }
                className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a90d9] resize-none"
              />
            </div>
          </div>
        </div>
        <div className="border-t border-border p-6 bg-gray-50 flex items-center justify-between">
          <Button onClick={onClose} variant="ghost" className="text-[#4a90d9] hover:text-[#3a7fc9] hover:bg-blue-50">
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!explanation.trim()}
            className={`text-white disabled:opacity-40 ${
              action === 'reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#4a90d9] hover:bg-[#3a7fc9]'
            }`}
          >
            {action === 'request-info' ? 'Submit Request' : 'Confirm Rejection'}
          </Button>
        </div>
      </div>
    </>
  );
}

// ─── Signing View Component ──────────────────────────────────────────────────

function SigningView({
  onSign,
  onCancel,
}: {
  onSign: () => void;
  onCancel: () => void;
}) {
  const [signatureName, setSignatureName] = useState('David Rose');
  const [signaturePosition, setSignaturePosition] = useState('Divisional Director');

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <header className="bg-[#1e2a5e] text-white">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-3">
            <button className="p-1.5 hover:bg-white/10 rounded"><Grid3X3 size={18} /></button>
            <button className="p-1.5 hover:bg-white/10 rounded">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </button>
            <button className="p-1.5 hover:bg-white/10 rounded"><HelpCircle size={18} /></button>
            <span className="text-sm">Support</span>
          </div>
        </div>
        <div className="px-4 py-2 border-t border-white/10">
          <div className="text-sm font-semibold">1 LONDON STREET - 1823456</div>
          <div className="text-xs text-white/60">CONTRACT: MSA 12345678</div>
        </div>
      </header>

      <main className="flex-1 flex">
        {/* Page navigation sidebar */}
        <div className="w-12 bg-gray-100 border-r border-border flex flex-col items-center py-4 gap-2">
          <div className="text-[9px] text-muted-foreground uppercase tracking-wide mb-1">Page</div>
          <button className="w-7 h-7 rounded border border-border bg-white text-[10px] font-medium hover:bg-gray-50">15</button>
          <button className="w-7 h-7 rounded border border-border bg-white text-[10px] font-medium hover:bg-gray-50">20</button>
          <div className="flex-1" />
          <button className="p-1 hover:bg-gray-200 rounded"><ChevronUp size={14} className="text-muted-foreground" /></button>
          <button className="p-1 hover:bg-gray-200 rounded"><ChevronDown size={14} className="text-muted-foreground" /></button>
          <button className="p-1 hover:bg-gray-200 rounded"><FileText size={14} className="text-muted-foreground" /></button>
          <button className="p-1 hover:bg-gray-200 rounded"><ZoomIn size={14} className="text-muted-foreground" /></button>
          <button className="p-1 hover:bg-gray-200 rounded"><ZoomOut size={14} className="text-muted-foreground" /></button>
        </div>

        {/* Document view */}
        <div className="flex-1 overflow-auto p-6 bg-gray-100">
          <div className="max-w-3xl mx-auto bg-white shadow-sm border border-border rounded p-10">
            <div className="text-center text-xs text-muted-foreground mb-8">Turner &amp; Townsend Confidential</div>
            
            <h1 className="text-2xl font-semibold text-foreground mb-12">Terms of Appointment</h1>

            <div className="grid grid-cols-2 gap-12">
              {/* T&T's behalf */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-6">Signed on T&amp;T&apos;s behalf</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-foreground w-20">Signature</span>
                    <div className="flex-1 border-b border-gray-300 h-8" />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-foreground w-20">Name</span>
                    <div className="flex-1 border-b border-gray-300 h-8" />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-foreground w-20">Position</span>
                    <div className="flex-1 border-b border-gray-300 h-8" />
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-foreground w-20">Signature</span>
                    <div className="flex-1 border-b border-gray-300 h-8" />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-foreground w-20">Name</span>
                    <div className="flex-1 border-b border-gray-300 h-8" />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-foreground w-20">Position</span>
                    <div className="flex-1 border-b border-gray-300 h-8" />
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-4">
                  <span className="text-sm text-foreground w-20">Date</span>
                  <div className="flex-1 border-b border-gray-300 h-8" />
                </div>
              </div>

              {/* Client's behalf */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-6">Signed on Client&apos;s behalf</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-foreground w-20">Signature</span>
                    <div className="flex-1 bg-[#4a90d9] h-8 rounded relative">
                      <div className="absolute -right-2 -bottom-2 w-6 h-6 bg-[#1e2a5e] rounded-full flex items-center justify-center cursor-pointer">
                        <Flag size={12} className="text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-foreground w-20">Name</span>
                    <div className="flex-1 bg-[#4a90d9] h-8 rounded" />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-foreground w-20">Position</span>
                    <div className="flex-1 bg-[#4a90d9] h-8 rounded" />
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-foreground w-20">Signature</span>
                    <div className="flex-1 border-b border-gray-300 h-8" />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-foreground w-20">Name</span>
                    <div className="flex-1 border-b border-gray-300 h-8" />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-foreground w-20">Position</span>
                    <div className="flex-1 border-b border-gray-300 h-8" />
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-4">
                  <span className="text-sm text-foreground w-20">Date</span>
                  <div className="flex-1 border-b border-gray-300 h-8" />
                </div>
              </div>
            </div>

            <div className="mt-16 pt-6 border-t border-border text-[10px] text-muted-foreground leading-relaxed">
              <p>© Turner &amp; Townsend Limited. This document is expressly provided to and solely for the use in relation to the project and services detailed herein and take into account the client&apos;s particular instructions and requirements. It must not be made available or copied or otherwise quoted or referred to in whole or in part in any way, including orally, to any other party without our express written permission and we accept no liability of whatsoever nature for any use by any other party.</p>
            </div>
          </div>
        </div>

        {/* Right signing panel */}
        <div className="w-80 bg-white border-l border-border flex flex-col">
          <div className="flex-1 p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Sign your contract</h2>

            <div className="space-y-5">
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">Name</label>
                <input
                  type="text"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a90d9]"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">Signature</label>
                <div className="border border-border rounded p-4 h-24 flex items-center justify-center bg-gray-50">
                  <span className="text-2xl italic text-gray-700" style={{ fontFamily: 'cursive' }}>
                    {signatureName || 'Your Signature'}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">Position</label>
                <input
                  type="text"
                  value={signaturePosition}
                  onChange={(e) => setSignaturePosition(e.target.value)}
                  className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a90d9]"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border p-4 flex items-center justify-between">
            <Button onClick={onCancel} variant="ghost" className="text-[#4a90d9] hover:text-[#3a7fc9] hover:bg-blue-50">
              Cancel
            </Button>
            <Button onClick={onSign} className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white">
              Sign contract
            </Button>
          </div>
        </div>
      </main>

      <footer className="bg-[#1e2a5e] text-white px-4 py-3">
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-wide">
          <a href="#" className="text-[#4a90d9]">Terms &amp; Conditions</a>
          <span className="text-white/40">|</span>
          <a href="#" className="text-[#4a90d9]">Privacy Policy</a>
          <span className="text-white/40">|</span>
          <a href="#" className="text-[#4a90d9]">Cookies Policy</a>
        </div>
        <div className="text-[10px] text-white/60 mt-0.5">Terms and Conditions</div>
      </footer>
    </div>
  );
}

// ─── Main page component ──────────────────────────────────────────────────────

export default function ContractPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isReviewing, setIsReviewing] = useState(false);
  const [expandedClause, setExpandedClause] = useState<number | null>(1);
  const [reviewSubTab, setReviewSubTab] = useState<'details' | 'guardrails'>('guardrails');
  const [reviewComplete, setReviewComplete] = useState(false);
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'request-info' | 'reject' | null>(null);
  const [approvalExplanation, setApprovalExplanation] = useState('');
  const [showApprovalTray, setShowApprovalTray] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadStep, setUploadStep] = useState<'upload' | 'action'>('upload');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [nextAction, setNextAction] = useState<'approval' | 're-review' | 'no-action' | null>(null);

  const handleStartReview = () => { setIsReviewing(true); setActiveTab('Review'); };
  const handleMarkAsReviewed = () => { setReviewComplete(true); setIsReviewing(false); };
  const handleReviewComplete = () => { setIsNegotiating(true); setReviewComplete(false); };
  const handleSubmitForApproval = () => { setIsNegotiating(false); setIsApproving(true); };
  
  const handleRequestInfo = () => { setApprovalAction('request-info'); setShowApprovalTray(true); };
  const handleReject = () => { setApprovalAction('reject'); setShowApprovalTray(true); };
  const handleApprove = () => { setIsApproving(false); setIsSigning(true); };
  const handleSubmitExplanation = () => { setShowApprovalTray(false); };
  const handleClearApprovalAction = () => { setApprovalAction(null); setApprovalExplanation(''); };
  const handleSignContract = () => { setIsSigning(false); /* Move to next stage */ };

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

  const handleUploadNext = () => { if (uploadedFileName) setUploadStep('action'); };

  const handleAddVersion = () => {
    if (nextAction === 'approval') {
      setIsNegotiating(false);
      setActiveTab('Overview');
    } else if (nextAction === 're-review') {
      setIsReviewing(true);
      setActiveTab('Review');
    }
    handleCloseUploadModal();
  };

  const uploadTrayProps = {
    uploadStep,
    uploadedFileName,
    nextAction,
    onClose: handleCloseUploadModal,
    onNext: handleUploadNext,
    onAdd: handleAddVersion,
    onSetFileName: setUploadedFileName,
    onSetNextAction: setNextAction,
    onBackToUpload: () => setUploadStep('upload'),
  };

  // ── Document Review View ──────────────────────────────────────────────────
  if (isReviewing && activeTab === 'Review') {
    return (
      <div className="min-h-screen flex flex-col bg-background font-sans">
        <AppHeader
          breadcrumb
          tabs={CONTRACT_TABS}
          activeTab={activeTab}
          onTabChange={(tab) => { setActiveTab(tab); if (tab !== 'Review') setIsReviewing(false); }}
        />

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
                          <span className={para.highlighted ? 'bg-blue-100 px-1 -mx-1' : ''}>{para.text}</span>
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

          {/* Right panel */}
          <div className="w-80 bg-white border-l border-border flex flex-col">
            <div className="p-5 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground mb-2">Contract review</h2>
              <p className="text-sm text-muted-foreground">Review the contract, add additional guardrails or edit the guardrails that have been added in the AI review.</p>
            </div>
            <div className="p-5 border-b border-border">
              <button className="text-xs font-semibold text-[#4a90d9] uppercase tracking-wide">+ Add Guardrail</button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {FLAGGED_CLAUSES.slice(0, 3).map(clause => (
                <div key={clause.id} className="border-b border-border">
                  <button
                    onClick={() => setExpandedClause(expandedClause === clause.id ? null : clause.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <ChevronDown size={16} className={`text-muted-foreground transition-transform ${expandedClause === clause.id ? 'rotate-180' : ''}`} />
                      <span className="text-sm font-medium text-foreground">{clause.title}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${clause.riskColor}`}>
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

        <AppFooter />
      </div>
    );
  }

  // ── Review Summary View ───────────────────────────────────────────────────
  if (reviewComplete && activeTab === 'Review') {
    return (
      <div className="min-h-screen flex flex-col bg-background font-sans">
        <AppHeader
          tabs={['Overview', 'Documents', 'History']}
          activeTab={activeTab}
          onTabChange={(tab) => { setActiveTab(tab); setReviewComplete(false); }}
        />

        <main className="flex-1 p-6 bg-gray-50">
          <div className="max-w-6xl mx-auto space-y-6">
            <PipelineBar activeStageId="rm_review" />

            <Card className="bg-white border border-border p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">Mark as Reviewed</h2>
                  <p className="text-sm text-muted-foreground">
                    Next action: The contract is being reviewed by{' '}
                    <span className="text-[#4a90d9]">James Seddon</span>. Once complete, the contract can enter negotiation.
                  </p>
                </div>
                <Button onClick={handleReviewComplete} className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white whitespace-nowrap">
                  Review Complete
                </Button>
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-4">
                <RiskSummaryCard />
                <RiskReviewCard />
              </div>
              <div className="col-span-2">
                <Card className="bg-white border border-border">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="flex gap-6">
                      <button className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Review</button>
                      <button className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Details</button>
                    </div>
                    <Button variant="outline" className="text-sm">View Contract</Button>
                  </div>
                  <div className="flex gap-6 px-4 border-b border-border">
                    <button
                      onClick={() => setReviewSubTab('details')}
                      className={`py-3 text-sm font-medium border-b-2 transition-colors ${reviewSubTab === 'details' ? 'border-[#4a90d9] text-[#4a90d9]' : 'border-transparent text-muted-foreground'}`}
                    >
                      Contract details
                    </button>
                    <button
                      onClick={() => setReviewSubTab('guardrails')}
                      className={`py-3 text-sm font-medium border-b-2 transition-colors ${reviewSubTab === 'guardrails' ? 'border-[#4a90d9] text-[#4a90d9]' : 'border-transparent text-muted-foreground'}`}
                    >
                      Guardrails &amp; Mitigations
                    </button>
                  </div>
                  <GuardrailsPanel
                    expandedClause={expandedClause}
                    setExpandedClause={setExpandedClause}
                    clauses={FLAGGED_CLAUSES.slice(2)}
                  />
                </Card>
              </div>
            </div>
          </div>
        </main>

        <AppFooter />
      </div>
    );
  }

  // ── Negotiation View ──────────────────────────────────────────────────────
  if (isNegotiating) {
    return (
      <div className="min-h-screen flex flex-col bg-background font-sans">
        <AppHeader
          tabs={['Overview', 'Documents', 'History']}
          activeTab={activeTab}
          onTabChange={(tab) => { setActiveTab(tab); setIsNegotiating(false); }}
        />

        <main className="flex-1 p-6 bg-gray-50">
          <div className="max-w-6xl mx-auto space-y-6">
            <PipelineBar activeStageId="negotiation" />

            <Card className="bg-white border border-border p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">Mark as Negotiated</h2>
                  <p className="text-sm text-muted-foreground">
                    Next action: The contract is being negotiated with the client by{' '}
                    <span className="text-[#4a90d9]">John Doe</span>. Upload any new versions of the contract for re-review or approval.
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
              <div className="space-y-4">
                <RiskSummaryCard />
                <RiskReviewCard />
              </div>
              <div className="col-span-2">
                <Card className="bg-white border border-border">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="flex gap-6">
                      <button className="text-sm font-semibold text-foreground">REVIEW</button>
                      <button className="text-sm font-semibold text-muted-foreground">DETAILS</button>
                    </div>
                    <Button className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white text-sm">View Contract</Button>
                  </div>
                  <div className="flex gap-6 px-4 border-b border-border">
                    <button
                      onClick={() => setReviewSubTab('details')}
                      className={`py-3 text-sm transition-colors ${reviewSubTab === 'details' ? 'text-[#4a90d9] border-b-2 border-[#4a90d9] font-medium' : 'text-muted-foreground'}`}
                    >
                      Contract details
                    </button>
                    <button
                      onClick={() => setReviewSubTab('guardrails')}
                      className={`py-3 text-sm transition-colors ${reviewSubTab === 'guardrails' ? 'text-[#4a90d9] border-b-2 border-[#4a90d9] font-medium' : 'text-muted-foreground'}`}
                    >
                      Guardrails &amp; Mitigations
                    </button>
                  </div>
                  <GuardrailsPanel expandedClause={expandedClause} setExpandedClause={setExpandedClause} />
                </Card>
              </div>
            </div>
          </div>
        </main>

        <AppFooter />

        {showUploadModal && <UploadTray {...uploadTrayProps} />}
      </div>
    );
  }

  // ── Approval View ─────────────────────────────────────────────────────────
  if (isApproving) {
    const approvalIndex = PIPELINE_STAGES.findIndex(s => s.id === 'approval');
    return (
      <div className="min-h-screen flex flex-col bg-background font-sans">
        <header className="bg-[#1e2a5e] text-white">
          <div className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-3">
              <button className="p-1.5 hover:bg-white/10 rounded"><Grid3X3 size={18} /></button>
              <button className="p-1.5 hover:bg-white/10 rounded">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
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
            <div className="flex items-center gap-1.5 flex-wrap">
              {PIPELINE_STAGES.map((stage, i) => {
                const idx = PIPELINE_STAGES.findIndex(s => s.id === stage.id);
                const isDone = idx < approvalIndex;
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
                    {i < PIPELINE_STAGES.length - 1 && <span className="text-gray-400 text-xs font-bold">{'>'}</span>}
                  </div>
                );
              })}
            </div>

            <Card className="bg-white border border-border p-5">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">
                    {approvalAction === 'request-info' ? 'More Information Requested' :
                     approvalAction === 'reject' ? 'Contract Rejected' :
                     'Select Approver Action'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {approvalAction === 'request-info' ? (
                      <>You have requested more information: &quot;{approvalExplanation}&quot; <button onClick={handleClearApprovalAction} className="text-[#4a90d9] font-medium ml-1">Change decision</button></>
                    ) : approvalAction === 'reject' ? (
                      <>You have rejected this contract: &quot;{approvalExplanation}&quot; <button onClick={handleClearApprovalAction} className="text-[#4a90d9] font-medium ml-1">Change decision</button></>
                    ) : (
                      <>Next action: The contract is being approved by <span className="text-[#4a90d9] font-medium">John Doe</span>. Review the contract details and risk position and select an option.</>
                    )}
                  </p>
                </div>
                {!approvalAction && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button onClick={handleRequestInfo} variant="outline" className="border-[#4a90d9] text-[#4a90d9] hover:bg-blue-50 whitespace-nowrap text-sm">
                      Request more Information
                    </Button>
                    <Button onClick={handleReject} className="bg-red-600 hover:bg-red-700 text-white whitespace-nowrap text-sm">Reject</Button>
                    <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap text-sm">Approve</Button>
                  </div>
                )}
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-4">
                <RiskSummaryCard />
                <RiskReviewCard showEdit={false} />
              </div>
              <div className="col-span-2">
                <Card className="bg-white border border-border">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="flex gap-6">
                      <button className="text-sm font-semibold text-foreground">REVIEW</button>
                      <button className="text-sm font-semibold text-muted-foreground">DETAILS</button>
                    </div>
                    <Button className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white text-sm">View Contract</Button>
                  </div>
                  <div className="flex gap-6 px-4 border-b border-border">
                    <button className="py-3 text-sm text-muted-foreground">Contract details</button>
                    <button className="py-3 text-sm text-[#4a90d9] border-b-2 border-[#4a90d9] font-medium">
                      Guardrails &amp; Mitigations
                    </button>
                  </div>
                  <GuardrailsPanel expandedClause={expandedClause} setExpandedClause={setExpandedClause} />
                </Card>
              </div>
            </div>
          </div>
        </main>

        <AppFooter />

        {showApprovalTray && approvalAction && (
          <ApprovalExplanationTray
            action={approvalAction}
            explanation={approvalExplanation}
            onExplanationChange={setApprovalExplanation}
            onSubmit={handleSubmitExplanation}
            onClose={() => { setShowApprovalTray(false); setApprovalAction(null); }}
          />
        )}
      </div>
    );
  }

  // ── Signing View ──────────────────────────────────────────────────────────
  if (isSigning) {
    return <SigningView onSign={handleSignContract} onCancel={() => setIsSigning(false)} />;
  }

  // ── Default Overview View ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <header className="bg-[#1e2a5e] text-white">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-3">
            <button className="p-1.5 hover:bg-white/10 rounded"><Grid3X3 size={18} /></button>
            <button className="p-1.5 hover:bg-white/10 rounded">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </button>
            <button className="p-1.5 hover:bg-white/10 rounded"><HelpCircle size={18} /></button>
            <span className="text-sm">Support</span>
          </div>
        </div>
        <div className="bg-[#1e2a5e] border-t border-white/10 px-4 py-2 flex items-center gap-3">
          <button onClick={() => router.back()} className="hover:bg-white/10 rounded p-1"><ArrowLeft size={16} /></button>
          <div>
            <div className="text-sm font-semibold">1 LONDON STREET – 1823456</div>
            <div className="text-xs text-white/60">CONTRACT: MSA 12345678</div>
          </div>
        </div>
        <div className="flex gap-0 border-t border-white/10 px-4">
          {CONTRACT_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab ? 'border-white text-white' : 'border-transparent text-white/60 hover:text-white/90'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-6">
            <Card className="bg-white border border-border p-5 col-span-1 self-start">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">General Information</h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-green-600 text-white font-semibold">Contract</span>
              </div>
              <div className="space-y-5">
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
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Director</div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">MW</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#4a90d9]">Mary Watkins</div>
                      <div className="text-xs text-muted-foreground">Director</div>
                      <div className="text-xs text-muted-foreground">London</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Opportunity Manager</div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center">
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

            <div className="col-span-2 space-y-4">
              <Card className="bg-white border border-border p-4">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {PIPELINE_STAGES.map((stage, i) => (
                    <div key={stage.id} className="flex items-center gap-1.5">
                      <button className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                        stage.done   ? 'bg-green-600 text-white' :
                        stage.active ? 'bg-[#4a90d9] text-white' :
                        'bg-gray-200 text-gray-500'
                      }`}>
                        {stage.label}
                      </button>
                      {i < PIPELINE_STAGES.length - 1 && <span className="text-gray-400 text-xs font-bold">{'>'}</span>}
                    </div>
                  ))}
                </div>
              </Card>

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

      <AppFooter />

      {showUploadModal && <UploadTray {...uploadTrayProps} />}
    </div>
  );
}
