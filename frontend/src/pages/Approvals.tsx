import { FileText, CheckCircle, XCircle, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const reviewedReports = [
  {
    id: 1,
    title: "HR Monthly Summary - October",
    department: "Human Resources",
    submittedBy: "Jane Smith",
    reviewedBy: "Michael Brown",
    reviewedDate: "2025-10-23",
    reviewComments: "All metrics are accurate and well-documented. Recommend approval.",
    dueDate: "2025-10-28",
  },
  {
    id: 2,
    title: "IT Infrastructure Report",
    department: "IT",
    submittedBy: "Mike Johnson",
    reviewedBy: "David Lee",
    reviewedDate: "2025-10-22",
    reviewComments: "Comprehensive report with detailed analysis. Ready for final approval.",
    dueDate: "2025-10-25",
  },
];

export default function Approvals() {
  const handleApproval = (reportId: number, action: string) => {
    toast.success(`Report ${action} successfully!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Final Approvals</h1>
        <p className="text-muted-foreground">
          Review and approve reports that have passed departmental review
        </p>
      </div>

      <div className="grid gap-6">
        {reviewedReports.map((report) => (
          <Card key={report.id} className="border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{report.title}</CardTitle>
                    <CardDescription>
                      {report.department} • Submitted by {report.submittedBy}
                    </CardDescription>
                  </div>
                </div>
                <StatusBadge status="reviewed" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Reviewed By</p>
                  <p className="font-medium">{report.reviewedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Review Date</p>
                  <p className="font-medium">
                    {new Date(report.reviewedDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Due Date</p>
                  <p className="font-medium">
                    {new Date(report.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-start gap-2 mb-2">
                  <Badge className="bg-primary/10 text-primary">
                    Reviewer Comments
                  </Badge>
                </div>
                <p className="text-sm">{report.reviewComments}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`final-comment-${report.id}`}>
                  Final Approval Comments (Optional)
                </Label>
                <Textarea
                  id={`final-comment-${report.id}`}
                  placeholder="Add any final comments before approval..."
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Report
                </Button>
                <Button
                  className="flex-1 bg-gradient-success"
                  onClick={() => handleApproval(report.id, "approved")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Grant Final Approval
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-destructive border-destructive hover:bg-destructive/10"
                  onClick={() => handleApproval(report.id, "rejected")}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {reviewedReports.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Reports Pending Approval</h3>
              <p className="text-muted-foreground text-center">
                All reviewed reports have been processed
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
