"use client";

import { useState } from "react";
import { format, sub } from "date-fns";
import {
  Clock,
  Users,
  CheckCircle,
  AlertTriangle,
  Download,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useKYCSubmissions } from "@/hooks/use-kyc";
import { KYCSubmission } from "@/types/kyc";
import { config } from "@/config/env";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const COLORS = ["#ff9800", "#4caf50", "#f44336"];

type ReviewDialogProps = {
  submission: KYCSubmission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: (action: "approve" | "reject" | "return", note?: string) => void;
};

function ReviewDialog({
  submission,
  open,
  onOpenChange,
  onAction,
}: ReviewDialogProps) {
  const [note, setNote] = useState("");
  const [selectedTab, setSelectedTab] = useState("documents");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  if (!submission) return null;

  const documents = submission.documents.map((doc) => ({
    id: doc.id,
    name: getDocumentTypeName(doc.documentType),
    type: doc.mimeType.split("/")[1].toUpperCase(),
    size: formatFileSize(doc.size),
    originalName: doc.originalName,
  }));

  function getDocumentTypeName(type: string) {
    const names: Record<string, string> = {
      PASSPORT: "Passport",
      ADDRESS_PROOF: "Proof of Address",
      SELFIE: "Selfie with ID",
    };
    return names[type] || type;
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return bytes + " B";
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + " KB";
    const mb = kb / 1024;
    return mb.toFixed(1) + " MB";
  }

  const personalInfo = {
    fullName: submission.fullName,
    dateOfBirth: format(new Date(submission.dateOfBirth), "PPP"),
    nationality: submission.nationality,
    address: submission.address,
    phone: submission.phoneNumber,
  };

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")[1];

      if (!token) throw new Error("No authentication token");

      await api.downloadFile(token, fileId, fileName);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Failed to download the file. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Review KYC Submission</DialogTitle>
          <DialogDescription>
            Submission ID: {submission.id} | Submitted on{" "}
            {format(new Date(submission.createdAt), "PPP")}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="mt-4">
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {doc.type} • {doc.size}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleDownload(doc.id, doc.originalName)}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="personal" className="mt-4">
            <div className="grid gap-4">
              {Object.entries(personalInfo).map(([key, value]) => (
                <div
                  key={key}
                  className="grid grid-cols-2 gap-4 px-4 py-2 border-b last:border-0"
                >
                  <div className="font-medium capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                  <div>{value}</div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        {submission.status === "PENDING" && (
          <div className="mt-4">
            <Label htmlFor="note">Review Note</Label>
            <Textarea
              id="note"
              placeholder="Add your review notes here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-2"
            />
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {submission.status === "PENDING" && (
            <>
              <Button
                variant="destructive"
                onClick={() => onAction("reject", note)}
                disabled={loading}
              >
                {loading ? "Processing..." : "Reject"}
              </Button>
              <Button
                variant="outline"
                onClick={() => onAction("return", note)}
                disabled={loading}
              >
                {loading ? "Processing..." : "Return for Modification"}
              </Button>
              <Button
                variant="default"
                onClick={() => onAction("approve", note)}
                disabled={loading}
              >
                {loading ? "Processing..." : "Approve"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSubmission, setSelectedSubmission] =
    useState<KYCSubmission | null>(null);
  const { toast } = useToast();

  const {
    submissions,
    loading,
    error,
    stats,
    chartData,
    refetch: fetchSubmissions,
  } = useKYCSubmissions();

  // Filter submissions
  const filteredSubmissions = submissions
    .filter(
      (submission) =>
        (statusFilter === "all" || submission.status === statusFilter) &&
        (submission.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          submission.user.email
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          submission.id.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const getStatusColor = (status: KYCSubmission["status"]) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    }
  };

  const handleReviewAction = async (
    action: "approve" | "reject" | "return",
    note?: string
  ) => {
    if (!selectedSubmission) return;

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")[1];

      if (!token) throw new Error("No authentication token found");

      const status =
        action === "return"
          ? "RETURNED"
          : action === "approve"
          ? "APPROVED"
          : "REJECTED";

      await api.updateKYCStatus(
        token,
        selectedSubmission.id,
        status as any,
        note
      );

      toast({
        title: "Success",
        description: `KYC submission has been ${action}ed successfully.`,
      });

      // Refetch submissions
      fetchSubmissions();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Action failed",
        description: "Failed to update KYC status. Please try again.",
      });
    } finally {
      setSelectedSubmission(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Reviews
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReviews}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Submissions
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todaySubmissions}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.todaySubmissions} from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Weekly Approval Rate
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.weeklyApprovalRate}%
            </div>
            {/* <p className="text-xs text-muted-foreground">
              +2.1% from last week
            </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Processing Time
            </CardTitle>
            <Clock className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgProcessingTime}</div>
            {/* <p className="text-xs text-muted-foreground">
              -1.2h from last week
            </p> */}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.submissions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.status}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.status.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent KYC Submissions</CardTitle>
          <div className="flex space-x-2">
            <Input
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="RETURNED">Rejected</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{submission.fullName}</div>
                      <div className="text-sm text-muted-foreground">
                        {submission.nationality}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(submission.status as any)}>
                      {submission.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(submission.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ReviewDialog
        submission={selectedSubmission}
        open={!!selectedSubmission}
        onOpenChange={(open) => !open && setSelectedSubmission(null)}
        onAction={handleReviewAction}
      />
    </div>
  );
}
