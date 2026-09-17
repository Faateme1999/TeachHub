// Admin user management. Reached at /admin/users.
//
// For now this reuses the existing UsersPage (a plain list of everyone). It works
// today because useUsers() already returns every user.
//
// TODO(junior) — US-038 (manage users): enhance this. Each user now has a `role`
// ('STUDENT' | 'ADMIN'), so show a role badge per row, and (optionally) let an
// admin see who the other admins are. Either extend UsersPage or build a richer
// table here. The data hook is useUsers() (hooks/useUsers.ts).

import { useNavigate } from "react-router-dom";
import { Badge } from "../../components/ui/Badge";
import { useUsers, useUpdateUserRole } from "../../hooks/useUsers";
import type { User } from "../../types/api";

export function AdminUsersPage() {
  const { data: users } = useUsers();
  const updateUserRole = useUpdateUserRole();
  const navigate = useNavigate();

  const handleRoleChange = (userId: number, currentRole: User["role"]) => {
    const newRole = currentRole === "STUDENT" ? "ADMIN" : "STUDENT";

    updateUserRole.mutate({
      userId,
      role: newRole,
    });
  };

  const handleViewSubmissions = (userId: number) => {
    navigate(`/admin/users/${userId}/submissions`);
  };

  return (
    <div className="space-y-4">
      {users?.map((user) => (
        <div key={user.id} className="admin-user">
          <div className="admin-user-row">
            <span className="font-medium">{user.name}</span>

            <span className="text-gray-600">{user.email}</span>

            <Badge>{user.role}</Badge>

            <div className="admin-user-actions">
              {user.role === "STUDENT" && (
                <button
                  onClick={() => handleViewSubmissions(user.id)}
                  className="admin-action-button admin-action-button--primary"
                >
                  View Assignments
                </button>
              )}

              <button
                onClick={() => handleRoleChange(user.id, user.role)}
                disabled={updateUserRole.isPending}
                className="admin-action-button admin-action-button--secondary"
              >
                {user.role === "STUDENT" ? "Make Admin" : "Make Student"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
