import Home from "../page";
import ProtectedAdminRoute from "../auth/ProtectedAdminRoute";

export default function DashboardPage() {
  return (
    <ProtectedAdminRoute>
      <Home initialRole="admin" />
    </ProtectedAdminRoute>
  );
}
