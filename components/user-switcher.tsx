'use client';

import { useUser, USERS, getRoleLabel, type UserRole } from '@/lib/user-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function UserSwitcher() {
  const { currentUser, switchRole } = useUser();

  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-white">{currentUser.initials}</span>
      </div>
      <Select
        value={currentUser.role}
        onValueChange={(value) => switchRole(value as UserRole)}
      >
        <SelectTrigger className="w-[200px] bg-white/10 border-white/20 text-white text-sm h-8">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(USERS) as UserRole[]).map((role) => (
            <SelectItem key={role} value={role}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-gray-600">{USERS[role].initials}</span>
                </div>
                <div>
                  <div className="text-sm font-medium">{USERS[role].name}</div>
                  <div className="text-xs text-muted-foreground">{getRoleLabel(role)}</div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
