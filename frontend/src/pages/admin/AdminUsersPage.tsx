// Admin user management. Reached at /admin/users.
//
// For now this reuses the existing UsersPage (a plain list of everyone). It works
// today because useUsers() already returns every user.
//
// TODO(junior) — US-038 (manage users): enhance this. Each user now has a `role`
// ('STUDENT' | 'ADMIN'), so show a role badge per row, and (optionally) let an
// admin see who the other admins are. Either extend UsersPage or build a richer
// table here. The data hook is useUsers() (hooks/useUsers.ts).

import { Badge } from "../../components/ui/Badge";
import { useUsers, useUpdateUserRole } from "../../hooks/useUsers";
import type { User } from "../../types/api";

export function AdminUsersPage() {
  const { data: users } = useUsers();
  const updateUserRole = useUpdateUserRole();

  const handleRoleChange = (userId: number, currentRole: User["role"]) => {
    const newRole = currentRole === "STUDENT" ? "ADMIN" : "STUDENT";

    updateUserRole.mutate({
      userId,
      role: newRole,
    });
  };

  return (
    <div className="space-y-4">
      {users?.map((user) => (
        <div
          key={user.id}
          className="grid grid-cols-[1fr_2fr_auto_auto] items-center gap-12 border-b py-4"
        >
          <span className="font-medium">{user.name}</span>
          <span className="text-gray-600">{user.email}</span>
          <Badge>{user.role}</Badge>
          <button
            onClick={() => handleRoleChange(user.id, user.role)}
            disabled={updateUserRole.isPending}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {user.role === "STUDENT" ? "Make Admin" : "Make Student"}
          </button>
        </div>
      ))}
    </div>
  );
}
