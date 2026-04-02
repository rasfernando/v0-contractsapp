'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// User roles in the system
export type UserRole = 'opportunity_manager' | 'contract_reviewer' | 'approver' | 'authorised_signatory';

export interface UserProfile {
  id: string;
  name: string;
  initials: string;
  role: UserRole;
  email: string;
}

// Example users for each role
export const USERS: Record<UserRole, UserProfile> = {
  opportunity_manager: {
    id: 'USER-001',
    name: 'John Douglas',
    initials: 'JD',
    role: 'opportunity_manager',
    email: 'john.douglas@company.com',
  },
  contract_reviewer: {
    id: 'USER-002',
    name: 'Sarah Chen',
    initials: 'SC',
    role: 'contract_reviewer',
    email: 'sarah.chen@company.com',
  },
  approver: {
    id: 'USER-003',
    name: 'Michael Thompson',
    initials: 'MT',
    role: 'approver',
    email: 'michael.thompson@company.com',
  },
  authorised_signatory: {
    id: 'USER-004',
    name: 'Elizabeth Ward',
    initials: 'EW',
    role: 'authorised_signatory',
    email: 'elizabeth.ward@company.com',
  },
};

export function getRoleLabel(role: UserRole): string {
  switch (role) {
    case 'opportunity_manager':
      return 'Opportunity Manager';
    case 'contract_reviewer':
      return 'Contract Reviewer (RM)';
    case 'approver':
      return 'Approver';
    case 'authorised_signatory':
      return 'Authorised Signatory';
  }
}

export function getRoleDescription(role: UserRole): string {
  switch (role) {
    case 'opportunity_manager':
      return 'Creates opportunities and contract records, manages workflow progression';
    case 'contract_reviewer':
      return 'Reviews contracts for risk management compliance';
    case 'approver':
      return 'Approves or rejects contracts after review';
    case 'authorised_signatory':
      return 'Signs contracts on behalf of the organisation';
  }
}

// Permissions
export function canCreateOpportunity(role: UserRole): boolean {
  return role === 'opportunity_manager';
}

export function canCreateContract(role: UserRole): boolean {
  return role === 'opportunity_manager';
}

export function canReviewContract(role: UserRole): boolean {
  return role === 'contract_reviewer';
}

export function canApproveContract(role: UserRole): boolean {
  return role === 'approver';
}

export function canSignContract(role: UserRole): boolean {
  return role === 'authorised_signatory';
}

export function canNegotiateContract(role: UserRole): boolean {
  return role === 'opportunity_manager';
}

export function canSeeTask(role: UserRole, taskType: string): boolean {
  switch (role) {
    case 'opportunity_manager':
      return ['Contract Negotiation', 'Risk Assessment', 'Risk Assessment Required', 'Contract Management'].includes(taskType);
    case 'contract_reviewer':
      return ['Contract Review', 'Risk Assessment Approval'].includes(taskType);
    case 'approver':
      return ['Contract Approval'].includes(taskType);
    case 'authorised_signatory':
      return ['Contract Signing', 'Contract Closure'].includes(taskType);
  }
}

// Context
interface UserContextType {
  currentUser: UserProfile;
  switchRole: (role: UserRole) => void;
}

const UserContext = createContext<UserContextType>({
  currentUser: USERS.opportunity_manager,
  switchRole: () => {},
});

const STORAGE_KEY = 'contracts_app_role';

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile>(USERS.opportunity_manager);

  // Restore persisted role on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as UserRole | null;
      if (saved && USERS[saved]) {
        setCurrentUser(USERS[saved]);
      }
    } catch {
      // localStorage not available
    }
  }, []);

  const switchRole = (role: UserRole) => {
    setCurrentUser(USERS[role]);
    try {
      localStorage.setItem(STORAGE_KEY, role);
    } catch {
      // localStorage not available
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, switchRole }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
