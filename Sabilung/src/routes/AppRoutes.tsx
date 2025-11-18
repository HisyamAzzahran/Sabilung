import { Route, Routes } from "react-router-dom";
import { PublicLayout } from "../layouts/PublicLayout";
import { LandingPage } from "../pages/LandingPage";
import { CrimeMapPage } from "../pages/CrimeMapPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { EmailConfirmedPage } from "../pages/EmailConfirmedPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { GovDashboardPage } from "../pages/gov/GovDashboardPage";
import { GovUploadsPage } from "../pages/gov/GovUploadsPage";
import { GovComplaintsPage } from "../pages/gov/GovComplaintsPage";
import { CitizenReportPage } from "../pages/citizen/CitizenReportPage";
import { AdminApprovalsPage } from "../pages/admin/AdminApprovalsPage";
import { NotFoundPage } from "../pages/NotFoundPage";

export const AppRoutes = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/map" element={<CrimeMapPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/confirm-email" element={<EmailConfirmedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>

    <Route
      path="/gov/dashboard"
      element={
        <ProtectedRoute allowedRoles={["government"]}>
          <DashboardLayout title="Dasbor Pemerintah" subtitle="Pantau metrik kriminalitas Kabupaten Bandung sepanjang hari">
            <GovDashboardPage />
          </DashboardLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/gov/uploads"
      element={
        <ProtectedRoute allowedRoles={["government"]}>
          <DashboardLayout title="Manajemen Upload Data" subtitle="Validasi batch Excel/CSV sebelum analitik dijalankan">
            <GovUploadsPage />
          </DashboardLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/gov/complaints"
      element={
        <ProtectedRoute allowedRoles={["government"]}>
          <DashboardLayout title="Aduan Warga" subtitle="Sinkronkan laporan real-time dengan tindak lanjut lapangan">
            <GovComplaintsPage />
          </DashboardLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/citizen/report"
      element={
        <ProtectedRoute allowedRoles={["citizen"]}>
          <DashboardLayout title="Layanan Aduan Warga" subtitle="Sampaikan situasi darurat atau kecurigaan kapan saja">
            <CitizenReportPage />
          </DashboardLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/approvals"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <DashboardLayout title="Panel Administrator" subtitle="Verifikasi unggahan pemerintah dan pantau akun terdaftar">
            <AdminApprovalsPage />
          </DashboardLayout>
        </ProtectedRoute>
      }
    />
  </Routes>
);
