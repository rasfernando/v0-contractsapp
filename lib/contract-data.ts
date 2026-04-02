// ─── Types based on data structure diagram ─────────────────────────────────────

export interface OpportunityRecord {
  opportunityReference: string;
  opportunityName: string;
  country: string;
  client: string;
  costCentre: string;
  opportunityDirector: string;
  opportunityManager: string;
}

export interface RiskAssessmentRecord {
  peReference: string;
  serviceType: string;
  bidDate: string;
  jointVenture: boolean;
  projectLocationCountry: string;
  cbreReferredContract: boolean;
  riskScore: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  nextAction: string;
  approxFee: number;
  currency: string;
  projectSize: 'small' | 'medium' | 'large' | 'major';
}

export interface Task {
  id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  userId: string;
  userName: string;
  locationLink: string;
  action: string;
  urgencyDate: string;
}

export interface ContractRecord {
  crReference: string;
  contractType: 'standalone' | 'msa' | 'work_order' | 'amendment';
  contractTitle: string;
  status: 'preparation' | 'rm_review' | 'negotiation' | 'approval' | 'signing' | 'active' | 'complete';
  nextAction: string;
  linkedContractData: string | null;
  reviewRequiredDate: string;
  riskReview: 'low' | 'medium' | 'high' | 'very_high';
  guardrailSeverity: 'green' | 'amber' | 'red';
  ourSigningDate: string | null;
  clientSigningDate: string | null;
  auditHistory: AuditEntry[];
  confidentialityLevel: 'standard' | 'confidential' | 'highly_confidential';
  approverIds: string[];
  tntSignatory1: Signatory | null;
  tntSignatory2: Signatory | null;
  contractLength: string;
}

export interface Signatory {
  id: string;
  name: string;
  position: string;
  email: string;
  signedDate: string | null;
  signature: string | null;
}

export interface AuditEntry {
  date: string;
  action: string;
  userId: string;
  userName: string;
  details: string;
}

export interface ContinueAtRisk {
  status: 'pending' | 'approved' | 'expired';
  approvalDate: string | null;
  approver: string | null;
  endDate: string | null;
}

export interface ContractFile {
  id: string;
  documentTitle: string;
  versionNumber: string;
  size: string;
  createdDate: string;
  modifiedDate: string;
  comment: string | null;
  primaryContractualDocument: boolean;
  finalSignedDocument: boolean;
}

export interface Comment {
  id: string;
  text: string;
  internalExternal: 'internal' | 'external';
  dateCreated: string;
  owner: string;
}

export interface Guardrail {
  id: number;
  documentLink: string;
  startPosition: number;
  endPosition: number;
  rawText: string;
  clauseCategory: string;
  riskLevel: 1 | 2 | 3 | 4 | 5 | 6;
  riskDescription: string;
  proposedAmendment: string;
  mitigation: Mitigation | null;
}

export interface Mitigation {
  guardrailReference: string;
  mitigationDescription: string;
  policyFacts: string;
}

export interface MSAKeyDealSummary {
  msaTitle: string;
  version: string;
  servicesCovered: string[];
  geographicalCoverage: string[];
  endDate: string;
  liabilityLevel: string;
  insuranceLevel: string;
  paymentTerms: string;
  workOrderTemplateLink: string | null;
  preApprovedFramework: boolean;
}

// ─── Example Data ───────────────────────────────────────────────────────────────

export const EXAMPLE_OPPORTUNITY: OpportunityRecord = {
  opportunityReference: 'OPP-2024-1823456',
  opportunityName: '1 London Street Development',
  country: 'United Kingdom',
  client: 'Brookfield Properties Ltd',
  costCentre: 'CC-UK-LON-001',
  opportunityDirector: 'Sarah Mitchell',
  opportunityManager: 'John Doe',
};

export const EXAMPLE_RISK_ASSESSMENT: RiskAssessmentRecord = {
  peReference: 'PE-2024-00456',
  serviceType: 'Project Management',
  bidDate: '2024-10-15',
  jointVenture: false,
  projectLocationCountry: 'United Kingdom',
  cbreReferredContract: false,
  riskScore: 65,
  status: 'approved',
  nextAction: 'Proceed to contract negotiation',
  approxFee: 2500000,
  currency: 'GBP',
  projectSize: 'large',
};

export const EXAMPLE_TASKS: Task[] = [
  {
    id: 'TASK-001',
    status: 'in_progress',
    userId: 'USR-JD001',
    userName: 'John Doe',
    locationLink: '/contract/review',
    action: 'Complete RM Review',
    urgencyDate: '2024-11-01',
  },
  {
    id: 'TASK-002',
    status: 'pending',
    userId: 'USR-SM002',
    userName: 'Sarah Mitchell',
    locationLink: '/contract/approve',
    action: 'Approve contract terms',
    urgencyDate: '2024-11-15',
  },
  {
    id: 'TASK-003',
    status: 'completed',
    userId: 'USR-RB003',
    userName: 'Robert Brown',
    locationLink: '/contract/prepare',
    action: 'Prepare initial contract draft',
    urgencyDate: '2024-10-20',
  },
];

export const EXAMPLE_CONTRACT: ContractRecord = {
  crReference: 'CR-2024-12345678',
  contractType: 'standalone',
  contractTitle: '1 London Street Standalone One Off V1',
  status: 'rm_review',
  nextAction: 'Complete risk review and approve guardrails',
  linkedContractData: null,
  reviewRequiredDate: '2026-02-01',
  riskReview: 'medium',
  guardrailSeverity: 'amber',
  ourSigningDate: null,
  clientSigningDate: null,
  auditHistory: [
    {
      date: '2024-10-20T14:30:00Z',
      action: 'Contract Created',
      userId: 'USR-RB003',
      userName: 'Robert Brown',
      details: 'Initial contract draft uploaded',
    },
    {
      date: '2024-10-22T09:15:00Z',
      action: 'Submitted for Review',
      userId: 'USR-RB003',
      userName: 'Robert Brown',
      details: 'Contract submitted to RM for review',
    },
    {
      date: '2024-10-25T11:45:00Z',
      action: 'Guardrails Triggered',
      userId: 'SYSTEM',
      userName: 'System',
      details: '6 guardrails identified - 1 Very High, 1 Unacceptable, 1 High, 2 Medium, 1 Low',
    },
  ],
  confidentialityLevel: 'confidential',
  approverIds: ['USR-SM002', 'USR-DIR001'],
  tntSignatory1: {
    id: 'SIG-001',
    name: 'David Rose',
    position: 'Divisional Director',
    email: 'david.rose@turnerandtownsend.com',
    signedDate: null,
    signature: null,
  },
  tntSignatory2: {
    id: 'SIG-002',
    name: 'Emma Thompson',
    position: 'Regional Managing Director',
    email: 'emma.thompson@turnerandtownsend.com',
    signedDate: null,
    signature: null,
  },
  contractLength: '36 months',
};

export const EXAMPLE_FILES: ContractFile[] = [
  {
    id: 'FILE-001',
    documentTitle: 'Contract1234_GlobalMSA_v1.4',
    versionNumber: '1.4',
    size: '1.2mb',
    createdDate: '2024-10-15',
    modifiedDate: '2024-10-20',
    comment: 'Initial draft with client amendments',
    primaryContractualDocument: true,
    finalSignedDocument: false,
  },
  {
    id: 'FILE-002',
    documentTitle: 'Contract1234_GlobalMSA_v1.3',
    versionNumber: '1.3',
    size: '1.1mb',
    createdDate: '2024-10-10',
    modifiedDate: '2024-10-12',
    comment: 'Previous version',
    primaryContractualDocument: false,
    finalSignedDocument: false,
  },
  {
    id: 'FILE-003',
    documentTitle: 'Risk_Assessment_Summary.pdf',
    versionNumber: '1.0',
    size: '256kb',
    createdDate: '2024-10-08',
    modifiedDate: '2024-10-08',
    comment: null,
    primaryContractualDocument: false,
    finalSignedDocument: false,
  },
];

export const EXAMPLE_GUARDRAILS: Guardrail[] = [
  {
    id: 1,
    documentLink: '/documents/contract-v1.4.pdf#page=12',
    startPosition: 4520,
    endPosition: 4890,
    rawText: '"When reasonably requested by us you are to provide documentary evidence that the insurance required under this Appointment is being maintained."',
    clauseCategory: 'Insurance',
    riskLevel: 5,
    riskDescription: "Clauses requiring you to maintain PI insurance and prove it — where the same area of the contract doesn't clearly cap your overall liability. It's flagging possible exposure above your insurance limits.",
    proposedAmendment: 'Add explicit liability cap equal to insurance coverage limit of £10m.',
    mitigation: null,
  },
  {
    id: 2,
    documentLink: '/documents/contract-v1.4.pdf#page=8',
    startPosition: 2100,
    endPosition: 2350,
    rawText: 'Payment terms for sub-consultants extend beyond 60 days.',
    clauseCategory: 'Payment Terms',
    riskLevel: 6,
    riskDescription: 'Payment terms for sub-consultants extend beyond 60 days which exceeds company policy.',
    proposedAmendment: 'Standard payment terms should not exceed 30 days for sub-consultants.',
    mitigation: null,
  },
  {
    id: 3,
    documentLink: '/documents/contract-v1.4.pdf#page=15',
    startPosition: 6200,
    endPosition: 6580,
    rawText: '"The Consultant\'s aggregate liability to the Client arising out of or in connection with this Agreement shall be limited to an amount equal to 200% of the Fees or £10,000,000, whichever is greater."',
    clauseCategory: 'Liability / Limitation of liability',
    riskLevel: 4,
    riskDescription: 'Liability cap of £10m exceeds standard company limit of £5m.',
    proposedAmendment: "The Consultant's total aggregate liability shall be limited to £5,000,000 (five million pounds).",
    mitigation: {
      guardrailReference: 'GR-003',
      mitigationDescription: 'We have agreed a higher PI cap of £10m (standard £5m) but confirmed with Insurance that cover is available on existing terms. The higher cap is limited to this project only and excludes consequential loss and indirect damages. Fee levels have been uplifted to reflect the additional exposure.',
      policyFacts: 'Insurance team confirmed additional cover available at 0.5% premium increase.',
    },
  },
  {
    id: 4,
    documentLink: '/documents/contract-v1.4.pdf#page=18',
    startPosition: 7800,
    endPosition: 8100,
    rawText: 'Indemnity clause extends beyond standard template wording to include third party claims.',
    clauseCategory: 'Indemnity',
    riskLevel: 3,
    riskDescription: 'Indemnity wording is broader than standard template and may expose company to additional risk.',
    proposedAmendment: 'Review and narrow the indemnity scope to match template wording.',
    mitigation: null,
  },
  {
    id: 5,
    documentLink: '/documents/contract-v1.4.pdf#page=22',
    startPosition: 9500,
    endPosition: 9750,
    rawText: 'The limitation period for claims under this Agreement shall be 12 years from completion.',
    clauseCategory: 'Limitation period / Time bar',
    riskLevel: 3,
    riskDescription: 'Limitation period of 12 years exceeds standard 6 year period.',
    proposedAmendment: 'Reduce limitation period to standard 6 years from practical completion.',
    mitigation: null,
  },
  {
    id: 6,
    documentLink: '/documents/contract-v1.4.pdf#page=6',
    startPosition: 1200,
    endPosition: 1450,
    rawText: 'Payment shall be made within 90 days of receipt of a valid invoice.',
    clauseCategory: 'Payment Terms / Commercial',
    riskLevel: 2,
    riskDescription: 'Payment terms of 90 days are longer than standard 30 days but within acceptable range.',
    proposedAmendment: 'Negotiate reduction to 45 days if possible.',
    mitigation: null,
  },
];

export const EXAMPLE_COMMENTS: Comment[] = [
  {
    id: 'CMT-001',
    text: 'Client has agreed in principle to the liability cap revision. Awaiting formal confirmation.',
    internalExternal: 'internal',
    dateCreated: '2024-10-25T14:30:00Z',
    owner: 'John Doe',
  },
  {
    id: 'CMT-002',
    text: 'Insurance team has confirmed cover available for increased liability. See attached confirmation.',
    internalExternal: 'internal',
    dateCreated: '2024-10-24T10:15:00Z',
    owner: 'Sarah Mitchell',
  },
  {
    id: 'CMT-003',
    text: 'Please confirm the payment terms are acceptable given the project cash flow requirements.',
    internalExternal: 'external',
    dateCreated: '2024-10-23T16:45:00Z',
    owner: 'Client Representative',
  },
];

export const EXAMPLE_MSA_SUMMARY: MSAKeyDealSummary = {
  msaTitle: '1 London Street Development Services Agreement',
  version: '1.4',
  servicesCovered: ['Project Management', 'Cost Management', 'Programme Advisory'],
  geographicalCoverage: ['United Kingdom', 'Ireland'],
  endDate: '2027-12-31',
  liabilityLevel: '£10,000,000 aggregate',
  insuranceLevel: 'Professional Indemnity: £10m, Public Liability: £5m',
  paymentTerms: '30 days from invoice',
  workOrderTemplateLink: '/templates/work-order-v2.docx',
  preApprovedFramework: true,
};

// ─── Risk level helpers ─────────────────────────────────────────────────────────

export function getRiskLevelLabel(level: 1 | 2 | 3 | 4 | 5 | 6): string {
  const labels: Record<number, string> = {
    1: 'LOW',
    2: 'LOW',
    3: 'MEDIUM',
    4: 'HIGH',
    5: 'VERY HIGH',
    6: 'UNACCEPTABLE',
  };
  return labels[level];
}

export function getRiskLevelColor(level: 1 | 2 | 3 | 4 | 5 | 6): string {
  const colors: Record<number, string> = {
    1: 'bg-green-100 text-green-700',
    2: 'bg-green-100 text-green-700',
    3: 'bg-amber-100 text-amber-700',
    4: 'bg-red-100 text-red-700',
    5: 'bg-red-200 text-red-800',
    6: 'bg-gray-800 text-white',
  };
  return colors[level];
}

export function getOverallRiskFromGuardrails(guardrails: Guardrail[]): 'low' | 'medium' | 'high' | 'very_high' {
  const maxRisk = Math.max(...guardrails.map(g => g.riskLevel));
  if (maxRisk >= 5) return 'very_high';
  if (maxRisk >= 4) return 'high';
  if (maxRisk >= 3) return 'medium';
  return 'low';
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
