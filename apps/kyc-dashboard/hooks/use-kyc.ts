import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import type { KYCSubmission } from "@/types/kyc";

export function useKYCSubmissions() {
  const [submissions, setSubmissions] = useState<KYCSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")[1];

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await api.getKYCSubmissions(token);
      setSubmissions(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch submissions")
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Calculate statistics
  const stats = {
    pendingReviews: submissions.filter((s) => s.status === "PENDING").length,
    todaySubmissions: submissions.filter((s) => {
      const today = new Date().toISOString().split("T")[0];
      return new Date(s.createdAt).toISOString().split("T")[0] === today;
    }).length,
    weeklyApprovalRate: submissions.length
      ? Math.round(
          (submissions.filter((s) => s.status === "APPROVED").length /
            submissions.length) *
            100
        )
      : 0,
    avgProcessingTime: calculateAvgProcessingTime(submissions),
  };

  // Calculate chart data
  const chartData = {
    status: [
      {
        name: "Pending",
        value: submissions.filter((s) => s.status === "PENDING").length,
      },
      {
        name: "Approved",
        value: submissions.filter((s) => s.status === "APPROVED").length,
      },
      {
        name: "Rejected",
        value: submissions.filter((s) => s.status === "REJECTED").length,
      },
      {
        name: "Returned",
        value: submissions.filter((s) => s.status === "RETURNED").length,
      },
    ],
    submissions: getWeeklySubmissionsData(submissions),
  };

  return {
    submissions,
    loading,
    error,
    stats,
    chartData,
    refetch: fetchSubmissions, // Expose the refetch function
  };
}

// Helper functions
export function calculateAvgProcessingTime(
  submissions: KYCSubmission[]
): string {
  const completedSubmissions = submissions.filter(
    (s) => s.status === "APPROVED" || s.status === "REJECTED"
  );

  if (!completedSubmissions.length) return "0s";

  const totalMs = completedSubmissions.reduce((acc, sub) => {
    const start = new Date(sub.createdAt).getTime();
    const end = new Date(sub.updatedAt).getTime();
    return acc + (end - start);
  }, 0);

  const avgMs = totalMs / completedSubmissions.length;
  const timeBreakdown = msToTime(avgMs);

  return formatTime(timeBreakdown);
}

function getWeeklySubmissionsData(submissions: KYCSubmission[]) {
  const lastWeek = [...Array(7)]
    .map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    })
    .reverse();

  return lastWeek.map((date) => ({
    date,
    count: submissions.filter((s) => s.createdAt.split("T")[0] === date).length,
  }));
}

interface TimeBreakdown {
  hours: number;
  minutes: number;
  seconds: number;
}

function msToTime(duration: number): TimeBreakdown {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor(duration / (1000 * 60 * 60));

  return {
    hours,
    minutes,
    seconds,
  };
}

function formatTimeComponent(value: number, unit: string): string {
  if (value === 0) return "";
  return `${value}${unit}`;
}

export function formatTime({ hours, minutes, seconds }: TimeBreakdown): string {
  const parts = [
    formatTimeComponent(hours, "h"),
    formatTimeComponent(minutes, "m"),
    formatTimeComponent(seconds, "s"),
  ].filter(Boolean);

  return parts.join(" ") || "0s";
}
