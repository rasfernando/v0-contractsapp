'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Grid3X3, HelpCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const PIPELINE_STAGES = [
  { id: 'prep',       label: 'Contract Preparation', done: true  },
  { id: 'rm_review',  label: 'RM Review',             done: false, active: true },
  { id: 'negotiation',label: 'Negotiation',           done: false },
  { id: 'approval',   label: 'Approval',              done: false },
  { id: 'signing',    label: 'Contract Signing',      done: false },
  { id: 'key_deal',   label: 'Key Deal Summary Preparation', done: false },
  { id: 'commission', label: 'Commission Setup',      done: false },
  { id: 'complete',   label: 'Complete',              done: false },
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

export default function ContractPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Overview');

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
                  <Button className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white whitespace-nowrap flex-shrink-0">
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
    </div>
  );
}
