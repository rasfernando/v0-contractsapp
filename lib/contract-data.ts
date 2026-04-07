// lib/contract-data.ts
// Database-backed replacement for your old static contract-data.ts
// Same type names where possible, but functions are now ASYNC
// (they return Promises — you'll need to await them or use them with useEffect)

import { supabase } from './supabase';

// ─── Types ───────────────────────────────────────────────────────────────

export type RiskAssessmentStatus = 'required' | 'in_progress' | 'awaiting_approval' | 'complete';
export type ContractStatus = 'preparation' | 'rm_review' | 'negotiation' | 'approval' | 'signing' | 'active' | 'complete' | null;

export interface OpportunityRiskAssessment {
  id: string;
  name: string;
  date: string;
  status: RiskAssessmentStatus;
  riskScore?: number;
  serviceType?: string;
}

export interface OpportunityContract {
  id: string;
  name: string;
  date: string;
  status: ContractStatus;
  contractType?: string;
}

export interface OpportunityRow {
  id: string;
  name: string;
  reference: string;
  manager: string;
  managerInitials: string;
  director: string;
  directorInitials: string;
  client: string;
  clientInitials: string;
  address: string;
  city: string;
  country: string;
  riskAssessmentStatus: RiskAssessmentStatus;
  contractStatus: ContractStatus;
  riskAssessments: OpportunityRiskAssessment[];
  contracts: OpportunityContract[];
}

export interface Task {
  id: number;
  name: string;
  activity: string;
  workItem: string;
  client: string;
  dueDate: string;
  relativeDate: string;
  priority: 'high' | 'medium' | 'low';
  assignedTo: 'opportunity_manager' | 'contract_reviewer' | 'approver' | 'authorised_signatory';
  opportunityId: string | null;
}

// ─── Row mappers (snake_case DB → camelCase frontend) ────────────────────

function mapOpportunity(row: any, ras: OpportunityRiskAssessment[] = [], cts: OpportunityContract[] = []): OpportunityRow {
  return {
    id: row.id,
    name: row.name,
    reference: row.reference,
    manager: row.manager,
    managerInitials: row.manager_initials,
    director: row.director,
    directorInitials: row.director_initials,
    client: row.client,
    clientInitials: row.client_initials,
    address: row.address,
    city: row.city,
    country: row.country,
    riskAssessmentStatus: row.risk_assessment_status,
    contractStatus: row.contract_status,
    riskAssessments: ras,
    contracts: cts,
  };
}

function mapRiskAssessment(row: any): OpportunityRiskAssessment {
  return {
    id: row.id,
    name: row.name,
    date: row.date,
    status: row.status,
    riskScore: row.risk_score ?? undefined,
    serviceType: row.service_type ?? undefined,
  };
}

function mapContract(row: any): OpportunityContract {
  return {
    id: row.id,
    name: row.name,
    date: row.date,
    status: row.status,
    contractType: row.contract_type ?? undefined,
  };
}

function mapTask(row: any): Task {
  return {
    id: row.id,
    name: row.name,
    activity: row.activity,
    workItem: row.work_item,
    client: row.client,
    dueDate: row.due_date,
    relativeDate: row.relative_date,
    priority: row.priority,
    assignedTo: row.assigned_to,
    opportunityId: row.opportunity_id,
  };
}

// ─── Queries ─────────────────────────────────────────────────────────────

export async function getAllOpportunities(): Promise<OpportunityRow[]> {
  const { data: opps, error } = await supabase.from('opportunities').select('*').order('created_at');
  if (error) throw error;

  const { data: allRas } = await supabase.from('risk_assessments').select('*');
  const { data: allCts } = await supabase.from('contracts').select('*');

  return (opps || []).map(o => mapOpportunity(
    o,
    (allRas || []).filter(r => r.opportunity_id === o.id).map(mapRiskAssessment),
    (allCts || []).filter(c => c.opportunity_id === o.id).map(mapContract),
  ));
}

export async function getOpportunityById(id: string): Promise<OpportunityRow | null> {
  const { data: opp, error } = await supabase.from('opportunities').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  if (!opp) return null;

  const { data: ras } = await supabase.from('risk_assessments').select('*').eq('opportunity_id', id);
  const { data: cts } = await supabase.from('contracts').select('*').eq('opportunity_id', id);

  return mapOpportunity(opp, (ras || []).map(mapRiskAssessment), (cts || []).map(mapContract));
}

export async function createOpportunity(input: {
  name: string;
  reference: string;
  manager: string;
  director: string;
  client: string;
  country: string;
  city?: string;
  address?: string;
}): Promise<OpportunityRow> {
  const id = `OPP-${Date.now()}`;
  const initials = (s: string) => s.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const { data, error } = await supabase.from('opportunities').insert({
    id,
    name: input.name,
    reference: input.reference,
    manager: input.manager,
    manager_initials: initials(input.manager),
    director: input.director,
    director_initials: initials(input.director),
    client: input.client,
    client_initials: initials(input.client),
    address: input.address || '',
    city: input.city || '',
    country: input.country,
    risk_assessment_status: 'required',
    contract_status: null,
  }).select().single();

  if (error) throw error;
  return mapOpportunity(data);
}

export async function createRiskAssessment(input: {
  opportunityId: string;
  name: string;
  serviceType?: string;
  riskScore?: number;
}): Promise<OpportunityRiskAssessment> {
  const id = `RA-${Date.now()}`;

  const { data, error } = await supabase.from('risk_assessments').insert({
    id,
    opportunity_id: input.opportunityId,
    name: input.name,
    date: new Date().toLocaleDateString('en-GB'),
    status: 'awaiting_approval',
    risk_score: input.riskScore ?? null,
    service_type: input.serviceType ?? null,
  }).select().single();

  if (error) throw error;

  // Update parent opportunity RA status
  await supabase.from('opportunities').update({ risk_assessment_status: 'awaiting_approval' }).eq('id', input.opportunityId);

  return mapRiskAssessment(data);
}

export async function updateRiskAssessmentStatus(id: string, status: RiskAssessmentStatus): Promise<void> {
  const { data: ra } = await supabase.from('risk_assessments').update({ status }).eq('id', id).select().single();
  if (ra?.opportunity_id) {
    await supabase.from('opportunities').update({ risk_assessment_status: status }).eq('id', ra.opportunity_id);
  }
}

export async function createContract(input: {
  opportunityId: string;
  name: string;
  contractType: string;
}): Promise<OpportunityContract> {
  const id = `CR-${Date.now()}`;

  const { data, error } = await supabase.from('contracts').insert({
    id,
    opportunity_id: input.opportunityId,
    name: input.name,
    date: new Date().toLocaleDateString('en-GB'),
    status: 'rm_review',
    contract_type: input.contractType,
  }).select().single();

  if (error) throw error;

  await supabase.from('opportunities').update({ contract_status: 'rm_review' }).eq('id', input.opportunityId);

  return mapContract(data);
}

export async function updateContractStatus(id: string, status: ContractStatus): Promise<void> {
  const { data: ct } = await supabase.from('contracts').update({ status }).eq('id', id).select().single();
  if (ct?.opportunity_id) {
    await supabase.from('opportunities').update({ contract_status: status }).eq('id', ct.opportunity_id);
  }
}

export async function getTasksForRole(role: string): Promise<Task[]> {
  const { data, error } = await supabase.from('tasks').select('*').eq('assigned_to', role);
  if (error) throw error;
  return (data || []).map(mapTask);
}

// ─── Style helpers (unchanged from your old file) ───────────────────────

export function getRiskAssessmentStatusStyle(status: RiskAssessmentStatus) {
  switch (status) {
    case 'required': return { label: 'Required', className: 'bg-red-100 text-red-700' };
    case 'in_progress': return { label: 'In Progress', className: 'bg-amber-100 text-amber-700' };
    case 'awaiting_approval': return { label: 'Awaiting Approval', className: 'bg-blue-100 text-blue-700' };
    case 'complete': return { label: 'Complete', className: 'bg-green-100 text-green-700' };
  }
}

export function getContractStatusStyle(status: ContractStatus) {
  if (!status) return null;
  switch (status) {
    case 'preparation': return { label: 'Preparation', className: 'bg-gray-100 text-gray-600' };
    case 'rm_review': return { label: 'RM Review', className: 'bg-amber-100 text-amber-700' };
    case 'negotiation': return { label: 'Negotiation', className: 'bg-orange-100 text-orange-700' };
    case 'approval': return { label: 'Approval', className: 'bg-blue-100 text-blue-700' };
    case 'signing': return { label: 'Signing', className: 'bg-purple-100 text-purple-700' };
    case 'active': return { label: 'Active', className: 'bg-green-100 text-green-700' };
    case 'complete': return { label: 'Complete', className: 'bg-green-200 text-green-800' };
    default: return null;
  }
}
