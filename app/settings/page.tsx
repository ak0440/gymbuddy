import SettingsPageContent from "./SettingsPageContent";
import ProtectedAdminRoute from "../auth/ProtectedAdminRoute";

export default function SettingsPage() {
  return (
    <ProtectedAdminRoute>
      <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#0a0d0b] px-4 py-5 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <SettingsPageContent />
        </div>
      </main>
    </ProtectedAdminRoute>
  );
}
