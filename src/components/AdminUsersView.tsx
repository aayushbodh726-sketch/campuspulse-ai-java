import React, { useState } from 'react';
import { Shield, User, Building, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const AdminUsersView: React.FC = () => {
  const { currentUser, users, departments, updateUserRoleAndDept, switchUser } = useApp();

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [roleMap, setRoleMap] = useState<Record<string, UserRole>>(() => {
    const map: Record<string, UserRole> = {};
    users.forEach((u) => {
      map[u.id] = u.role;
    });
    return map;
  });
  const [deptMap, setDeptMap] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    users.forEach((u) => {
      map[u.id] = u.departmentId || '';
    });
    return map;
  });

  const handleSave = (userId: string) => {
    const r = roleMap[userId] || 'STUDENT';
    const d = deptMap[userId] || undefined;
    updateUserRoleAndDept(userId, r, d);
    setEditingUserId(null);
  };

  if (currentUser.role !== 'ADMIN') {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7" />
        </div>
        <h3 className="font-display font-extrabold text-2xl text-slate-800">
          Administrator Access Required
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-2 mb-6 leading-relaxed">
          The user access table is restricted to the Administrator role. You are currently viewing as <strong>{currentUser.displayName} ({currentUser.role})</strong>.
        </p>
        <button
          onClick={() => switchUser('user-admin')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
        >
          <Shield className="w-4 h-4" />
          <span>Switch to Demo Administrator (1-click)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <span className="text-[11px] font-extrabold tracking-wider uppercase text-blue-600">
          Administration
        </span>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#152543]">
          User Access & Role Management
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Configure role authorization and department assignments for active accounts.
        </p>
      </div>

      {/* Info notice */}
      <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-900 text-xs flex items-center gap-2">
        <Shield className="w-4 h-4 text-blue-600 shrink-0" />
        <div>
          Role changes are instantaneous and govern ticket queues, status transitions, and administrative features.
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
              <tr>
                <th className="py-3 px-6">User Account</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Assigned Department</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {users.map((user) => {
                const currentR = roleMap[user.id] ?? user.role;
                const currentD = deptMap[user.id] ?? (user.departmentId || '');

                return (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                          {user.displayName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong className="text-slate-800 text-sm block">
                            {user.displayName}
                          </strong>
                          <span className="text-[11px] text-slate-400">{user.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <select
                        value={currentR}
                        onChange={(e) =>
                          setRoleMap((prev) => ({ ...prev, [user.id]: e.target.value as UserRole }))
                        }
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800"
                      >
                        <option value="STUDENT">Student</option>
                        <option value="STAFF">Staff</option>
                        <option value="ADMIN">Administrator</option>
                      </select>
                    </td>

                    <td className="py-4 px-4">
                      <select
                        value={currentD}
                        onChange={(e) =>
                          setDeptMap((prev) => ({ ...prev, [user.id]: e.target.value }))
                        }
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800"
                      >
                        <option value="">No Department</option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleSave(user.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        Save Access
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
