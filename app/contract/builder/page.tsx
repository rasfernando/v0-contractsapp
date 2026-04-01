'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ─── Types ───────────────────────────────────────────────────────────────────

type SectionStatus = 'incomplete' | 'complete';

interface Section {
  id: string;
  label: string;
  placeholder: string;
  status: SectionStatus;
  value: string;
  expanded: boolean;
}

// ─── Contract document content ───────────────────────────────────────────────

const CONTRACT_TEXT = `
19    NOTICES

(i)   Any notice under this appointment is deemed to be given if it is in writing and delivered by hand or sent by pre-paid, recorded or special delivery post to the address and person set out in clauses 19(iv) and 19(v) below.

(ii)  Any notice given by hand is deemed received upon actual receipt by the person to whom it is addressed.

(iii) Any notice sent by pre-paid, recorded or special delivery post is deemed received 48 hours after it was posted.

(iv)  Written notices to Us shall be sent to Turner & Townsend [NOTICE_1] Limited, One New Change, London, EC4M 9AF for the attention of the UK Regional MD.

(v)   Written notices to You shall be sent to [……] for the attention of [……].


20    CYBER RISK⁷

We shall not be liable for any losses arising from or in connection with any form of risk arising from or in connection with the use, ownership, operation, influence, or adoption of information technology systems and networks, any computer software, hardware, electronics, systems and all other equipment including but not limited to software viruses, clock, timer, counter or other limiting or disabling code, design or routine, or other contaminants (including, without limitation) bugs, worms, logic bombs, Trojan horses, or self-propagating or other programs that is intended to be harmful to one or more information technology systems or to data stored in those systems (including, by causing all or any part of any system or data to be erased, inoperable or otherwise incapable of being used in the full manner for which it was designed) or which enables unauthorised access to the system or theft or misuse of customer data or confidential information or otherwise impairs the operation of the system.


21    PREVENTION OF THE FACILITATION OF TAX EVASION

(i)   You shall not engage in any activity, practice or conduct which would constitute:

      a.   A UK tax evasion facilitation offence under section 45(1) of the Criminal Finances Act 2017; or

      b.   A foreign tax evasion facilitation offence under section 46(1) of the Criminal Finances Act 2017; or


22    PAYMENTS — GENERAL

[PAYMENT_1] All payments shall be made within [PAYMENT_2] days of the date of the relevant invoice. [PAYMENT_3] Late payments shall accrue interest at the rate of 4% above the Bank of England base rate.


23    CONFIDENTIALITY

Both parties agree to keep confidential all information obtained from the other party in connection with this appointment and shall not disclose such information to any third party without the prior written consent of the disclosing party.
`;

// Sections that require user input (keyed to placeholders in the document)
const INITIAL_SECTIONS: Section[] = [
  { id: 'notices_1',  label: 'Notices 1',   placeholder: 'Enter the company location (e.g. International)',    status: 'incomplete', value: '',             expanded: true  },
  { id: 'notices_2',  label: 'Notices 2',   placeholder: 'Enter the recipient address for written notices',     status: 'incomplete', value: '',             expanded: false },
  { id: 'notices_3',  label: 'Notices 3',   placeholder: 'Enter the contact name / department',                 status: 'incomplete', value: '',             expanded: false },
  { id: 'payments_1', label: 'Payments 1',  placeholder: 'Enter payment method or conditions',                  status: 'incomplete', value: '',             expanded: false },
  { id: 'payments_2', label: 'Payments 2',  placeholder: 'Enter number of days (e.g. 30)',                      status: 'incomplete', value: '',             expanded: false },
  { id: 'payments_3', label: 'Payments 3',  placeholder: 'Enter late payment clause or leave blank to omit',   status: 'incomplete', value: '',             expanded: false },
];

// ─── Rendered document with highlights ───────────────────────────────────────

function ContractDocument({ sections }: { sections: Section[] }) {
  const notice1 = sections.find(s => s.id === 'notices_1');
  const payment1 = sections.find(s => s.id === 'payments_1');
  const payment2 = sections.find(s => s.id === 'payments_2');
  const payment3 = sections.find(s => s.id === 'payments_3');

  const Highlight = ({ sectionId, children }: { sectionId: string; children: React.ReactNode }) => {
    const sec = sections.find(s => s.id === sectionId);
    const filled = sec?.status === 'complete';
    return (
      <mark className={`px-1 rounded text-xs font-medium ${filled ? 'bg-blue-100 text-blue-800' : 'bg-amber-200 text-amber-900'}`}>
        {filled ? sec!.value : children}
      </mark>
    );
  };

  return (
    <div className="font-serif text-[13px] leading-relaxed text-gray-800 space-y-6 pr-4">
      <section>
        <h3 className="font-bold text-sm mb-3">19 &nbsp; NOTICES</h3>
        <div className="space-y-3 pl-4">
          <p>(i) &nbsp; Any notice under this appointment is deemed to be given if it is in writing and delivered by hand or sent by pre-paid, recorded or special delivery post to the address and person set out in clauses 19(iv) and 19(v) below.</p>
          <p>(ii) &nbsp; Any notice given by hand is deemed received upon actual receipt by the person to whom it is addressed.</p>
          <p>(iii) &nbsp; Any notice sent by pre-paid, recorded or special delivery post is deemed received 48 hours after it was posted.</p>
          <p>(iv) &nbsp; Written notices to Us shall be sent to Turner &amp; Townsend{' '}
            <Highlight sectionId="notices_1">[ENTER TEXT]</Highlight>
            {' '}Limited, One New Change, London, EC4M 9AF for the attention of the UK Regional MD.</p>
          <p>(v) &nbsp; Written notices to You shall be sent to{' '}
            <Highlight sectionId="notices_2">[……]</Highlight>
            {' '}for the attention of{' '}
            <Highlight sectionId="notices_3">[……]</Highlight>.
          </p>
        </div>
      </section>

      <section>
        <h3 className="font-bold text-sm mb-3">20 &nbsp; CYBER RISK<sup>7</sup></h3>
        <p className="pl-4">We shall not be liable for any losses arising from or in connection with any form of risk arising from or in connection with the use, ownership, operation, influence, or adoption of information technology systems and networks, any computer software, hardware, electronics, systems and all other equipment including but not limited to software viruses, clock, timer, counter or other limiting or disabling code, design or routine, or other contaminants (including, without limitation) bugs, worms, logic bombs, Trojan horses, or self-propagating or other programs that is intended to be harmful to one or more information technology systems or to data stored in those systems.</p>
      </section>

      <section>
        <h3 className="font-bold text-sm mb-3">21 &nbsp; PREVENTION OF THE FACILITATION OF TAX EVASION</h3>
        <div className="space-y-2 pl-4">
          <p>(i) &nbsp; You shall not engage in any activity, practice or conduct which would constitute:</p>
          <p className="pl-6">a. &nbsp; A UK tax evasion facilitation offence under section 45(1) of the Criminal Finances Act 2017; or</p>
          <p className="pl-6">b. &nbsp; A foreign tax evasion facilitation offence under section 46(1) of the Criminal Finances Act 2017; or</p>
        </div>
      </section>

      <section>
        <h3 className="font-bold text-sm mb-3">22 &nbsp; PAYMENTS — GENERAL</h3>
        <p className="pl-4">
          <Highlight sectionId="payments_1">[PAYMENT METHOD]</Highlight>
          {' '}All payments shall be made within{' '}
          <Highlight sectionId="payments_2">[X]</Highlight>
          {' '}days of the date of the relevant invoice.{' '}
          <Highlight sectionId="payments_3">[LATE PAYMENT CLAUSE]</Highlight>
        </p>
      </section>

      <section>
        <h3 className="font-bold text-sm mb-3">23 &nbsp; CONFIDENTIALITY</h3>
        <p className="pl-4">Both parties agree to keep confidential all information obtained from the other party in connection with this appointment and shall not disclose such information to any third party without the prior written consent of the disclosing party.</p>
      </section>

      {/* Footer note */}
      <div className="border-t border-gray-200 pt-4 mt-8 text-xs text-gray-500 space-y-2">
        <p><em>Note when drafting: These additional clauses may be deleted where they are not relevant (e.g. clause 20 where there is no Cyber Risk).</em></p>
        <p className="text-[11px]">&copy; Turner &amp; Townsend Limited. This document is expressly provided to and solely for the use in relation to the project and services detailed herein and take into account the client&apos;s particular instructions and requirements. It must not be made available or copied or otherwise quoted or referred to in whole or in part in any way, including orally, to any other party without our express written permission and we accept no liability of whatsoever nature for any use by any other party.</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-[#3d4eaa] font-semibold text-xs">August 2021</span>
          <span className="italic text-xs text-gray-400">making the difference &nbsp; 11</span>
        </div>
      </div>
    </div>
  );
}

// ─── Builder Page ─────────────────────────────────────────────────────────────

export default function ContractBuilderPage() {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS);

  const allComplete = sections.every(s => s.status === 'complete');

  const updateSection = (id: string, value: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, value } : s));
  };

  const saveSection = (id: string) => {
    setSections(prev => prev.map(s =>
      s.id === id ? { ...s, status: s.value.trim() ? 'complete' : 'incomplete', expanded: false } : s
    ));
  };

  const toggleSection = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, expanded: !s.expanded } : s));
  };

  const handleCreate = () => {
    router.push('/contract');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
      {/* Header */}
      <header className="bg-[#1e2d6e] text-white px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white/20 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">H</span>
            </div>
            <span className="font-semibold tracking-wide text-sm">HIVE</span>
            <span className="text-white/50 text-sm">Contracts App</span>
          </div>
        </div>
        <span className="text-sm text-white/80">Hi [User first name]</span>
      </header>

      {/* Sub-header */}
      <div className="bg-[#1e2d6e] border-t border-white/10 px-6 pb-3 text-white text-xs">
        <div className="font-semibold">1 LONDON STREET - 1823456</div>
        <div className="text-white/60">CONTRACT: MSA 12345678</div>
      </div>

      {/* Main split layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left — document */}
        <div className="flex-1 overflow-y-auto bg-white border-r border-border px-10 py-8">
          {/* Document title */}
          <div className="text-center mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-lg font-bold text-gray-900">T&amp;T Terms &amp; Conditions</h1>
          </div>
          <ContractDocument sections={sections} />
        </div>

        {/* Right — accordion sections */}
        <div className="w-80 flex-shrink-0 flex flex-col bg-[#f7f8fa] border-l border-border">
          {/* Panel header */}
          <div className="px-5 py-4 border-b border-border bg-white">
            <h2 className="text-sm font-semibold text-foreground">T&amp;T Terms &amp; Conditions</h2>
          </div>

          {/* Sections */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {sections.map(sec => (
              <div
                key={sec.id}
                className={`border rounded bg-white transition-all ${
                  sec.expanded ? 'border-[#4a90d9] shadow-sm' : 'border-border'
                }`}
              >
                {/* Accordion header */}
                <button
                  onClick={() => toggleSection(sec.id)}
                  className="w-full flex items-center justify-between px-4 py-3"
                >
                  <div className="flex items-center gap-2">
                    {sec.expanded
                      ? <ChevronUp size={14} className="text-muted-foreground flex-shrink-0" />
                      : <ChevronDown size={14} className="text-muted-foreground flex-shrink-0" />}
                    <span className="text-sm font-medium text-foreground">{sec.label}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                    sec.status === 'complete'
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-600 text-white'
                  }`}>
                    {sec.status === 'complete' ? 'Complete' : 'Incomplete'}
                  </span>
                </button>

                {/* Accordion body */}
                {sec.expanded && (
                  <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                    <p className="text-xs text-muted-foreground">Enter text for highlighted area</p>
                    <textarea
                      value={sec.value}
                      onChange={e => updateSection(sec.id, e.target.value)}
                      placeholder={sec.placeholder}
                      rows={3}
                      className="w-full p-2.5 border border-border rounded text-sm bg-white resize-none focus:outline-none focus:ring-1 focus:ring-[#4a90d9]"
                    />
                    <Button
                      onClick={() => saveSection(sec.id)}
                      disabled={!sec.value.trim()}
                      size="sm"
                      className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white disabled:opacity-40 text-xs"
                    >
                      Save
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-border bg-white flex items-center justify-between flex-shrink-0">
            <Button variant="outline" onClick={() => router.back()} className="text-sm border-border">
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!allComplete}
              className="bg-[#4a90d9] hover:bg-[#3a7fc9] text-white disabled:opacity-40 text-sm"
            >
              Create contract
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
