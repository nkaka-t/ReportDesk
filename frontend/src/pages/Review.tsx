import { FileText, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/StatusBadge";
import { toast } from "sonner";

const pendingReviews = [
  {
    id: 1,
    title: "Q4 Financial Report",
    department: "Finance",
    submittedBy: "John Doe",
    submittedDate: "2025-10-22",
    dueDate: "2025-11-05",
  },
  {
    id: 2,
    title: "Marketing Campaign Analysis",
    department: "Marketing",
    submittedBy: "Sarah Williams",
    submittedDate: "2025-10-21",
    dueDate: "2025-10-30",
  },
];

export default function Review() {
  const handleReview = (reportId: number, action: string) => {
    toast.success(`Report ${action} successfully!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Review Queue</h1>
        <p className="text-muted-foreground">
          Review reports submitted by your department members
        </p>
      </div>

      <div className="grid gap-6">
        {pendingReviews.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-warning">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{report.title}</CardTitle>
                    <CardDescription>
                      {report.department} • Submitted by {report.submittedBy}
                    </CardDescription>
                  </div>
                </div>
                <StatusBadge status="pending" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Submitted Date</p>
                  <p className="font-medium">
                    {new Date(report.submittedDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Due Date</p>
                  <p className="font-medium">
                    {new Date(report.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`comment-${report.id}`}>Review Comments</Label>
                <Textarea
                  id={`comment-${report.id}`}
                  placeholder="Add your review comments here..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  className="flex-1 bg-gradient-success"
                  onClick={() => handleReview(report.id, "approved")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve & Forward
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-accent border-accent hover:bg-accent/10"
                  onClick={() => handleReview(report.id, "sent for revision")}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Request Revision
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-destructive border-destructive hover:bg-destructive/10"
                  onClick={() => handleReview(report.id, "rejected")}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {pendingReviews.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground text-center">
                No reports pending review at the moment
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
