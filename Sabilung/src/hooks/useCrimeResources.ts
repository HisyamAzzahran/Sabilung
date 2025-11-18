import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUpdateNotice,
  fetchComplaints,
  fetchCrimeRiskRecords,
  fetchMapZones,
  fetchRiskSummary,
  fetchRiskTrend,
  fetchUpdates,
  fetchUploads,
  registerUploadBatch,
  submitComplaint,
  updateComplaintStatus,
  updateUploadStatus,
} from "../api/crimeApi";
import { createUserAccess, fetchDirectoryUsers, registerCitizen } from "../api/authApi";
import type { ComplaintInput, NewUserPayload, RegistrationPayload, UpdatePayload } from "../types";

const queryKeys = {
  riskSummary: ["risk-summary"] as const,
  riskRecords: ["risk-records"] as const,
  trend: ["risk-trend"] as const,
  mapZones: ["map-zones"] as const,
  uploads: ["uploads"] as const,
  complaints: ["complaints"] as const,
  directoryUsers: ["directory-users"] as const,
  updates: ["updates"] as const,
};

export const useRiskSummary = () =>
  useQuery({ queryKey: queryKeys.riskSummary, queryFn: fetchRiskSummary, staleTime: 2 * 60 * 1000 });

export const useRiskRecords = () =>
  useQuery({ queryKey: queryKeys.riskRecords, queryFn: fetchCrimeRiskRecords, staleTime: 2 * 60 * 1000 });

export const useRiskTrend = () =>
  useQuery({ queryKey: queryKeys.trend, queryFn: fetchRiskTrend, staleTime: 5 * 60 * 1000 });

export const useMapZones = () =>
  useQuery({ queryKey: queryKeys.mapZones, queryFn: fetchMapZones, staleTime: 5 * 60 * 1000 });

export const useUploads = () =>
  useQuery({ queryKey: queryKeys.uploads, queryFn: fetchUploads, staleTime: 30 * 1000 });

export const useComplaints = () =>
  useQuery({ queryKey: queryKeys.complaints, queryFn: fetchComplaints, staleTime: 30 * 1000 });

export const useComplaintMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ComplaintInput) => submitComplaint(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.complaints });
    },
  });
};

export const useRegisterUpload = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      fileName,
      rowCount,
      errorCount,
      notes,
    }: {
      fileName: string;
      rowCount: number;
      errorCount: number;
      notes?: string;
    }) => registerUploadBatch(fileName, rowCount, errorCount, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.uploads });
    },
  });
};

export const useUploadModeration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: "APPROVED" | "REJECTED"; notes?: string }) =>
      updateUploadStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.uploads });
    },
  });
};

export const useDirectoryUsers = () =>
  useQuery({ queryKey: queryKeys.directoryUsers, queryFn: fetchDirectoryUsers, staleTime: 5 * 60 * 1000 });

export const useUpdates = () =>
  useQuery({ queryKey: queryKeys.updates, queryFn: fetchUpdates, staleTime: 60 * 1000 });

export const useCreateUpdateNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePayload) => createUpdateNotice(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.updates });
    },
  });
};

export const useComplaintStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "NEW" | "IN_PROGRESS" | "RESOLVED" }) =>
      updateComplaintStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.complaints });
    },
  });
};

export const useCitizenRegistration = () =>
  useMutation({
    mutationFn: (payload: RegistrationPayload) => registerCitizen(payload),
  });

export const useAdminCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: NewUserPayload) => createUserAccess(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.directoryUsers });
    },
  });
};
