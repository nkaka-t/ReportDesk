import { FileText, CheckCircle, XCircle, MessageSquare, Download, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/StatusBadge";
import { toast } from "sonner";

import { useEffect, useState } from "react";
import api from "@/lib/api";

const formatDate = (d?: string | null) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString(); } catch { return d; }
}

export default function Review() {
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchStatus, setFetchStatus] = useState<number | null>(null);
  const [viewReport, setViewReport] = useState<any | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const handleReview = (reportId: number, action: string) => {
    // collect comment value from textarea
    const textEl = document.getElementById(`comment-${reportId}`) as HTMLTextAreaElement | null;
    const comments = textEl ? textEl.value : '';
    // map friendly actions to backend expected values
    const mapped = action === 'approved' ? 'Reviewed' : (action === 'rejected' ? 'Rejected' : action);
    api.post(`/reports/${reportId}/review`, { action: mapped, comments })
      .then(() => {
        setPendingReviews((p) => p.filter(r => r.id !== reportId));
        toast.success(`Report ${mapped} successfully!`);
      })
      .catch((err) => {
        console.error('Review failed', err);
        toast.error('Failed to submit review');
      });
  };

  useEffect(() => {
    let mounted = true;
    api.get('/reports/review-queue')
      .then((res) => { if (mounted) { setPendingReviews(res.data || []); setFetchError(null); setFetchStatus(null); } })
      .catch((err) => {
        console.error('Failed to load review queue', err);
        if (mounted) {
          const status = err?.response?.status || null;
          const msg = err?.response?.data?.error || (status === 403 ? 'You do not have permission to view this queue' : (status === 401 ? 'Unauthorized - please login' : 'Failed to load review queue'));
          setFetchError(msg);
          setFetchStatus(status);
        }
      });
    return () => { mounted = false };
  }, []);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Review Queue</h1>
        <p className="text-muted-foreground">
          Review reports submitted by your department members
        </p>
      </div>

      <div className="grid gap-6">
        {fetchError && (
          <div className="col-span-full">
            <div className="p-4 bg-red-50 border border-red-200 rounded">
              <h3 className="font-semibold mb-1">Unable to load Review Queue</h3>
              <p className="text-sm text-muted-foreground">{fetchError}</p>
              {(fetchStatus === 401 || fetchStatus === 403) && (
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground mb-2">If you're testing locally you can sign in as the seeded reviewer account.</p>
                  <div className="flex gap-2">
                    <Button onClick={async () => {
                      try {
                        const res = await api.post('/auth/login', { email: 'reviewer@example.com', password: 'Reviewer123!' });
                        const token = res.data && res.data.token;
                        if (token) {
                          localStorage.setItem('token', token);
                          toast.success('Signed in as reviewer');
                          // retry fetching
                          const q = await api.get('/reports/review-queue');
                          setPendingReviews(q.data || []);
                          setFetchError(null);
                        }
                      } catch (err) {
                        console.error('Seed login failed', err);
                        toast.error('Auto sign-in failed');
                      }
                    }}>Sign in as reviewer</Button>
                    <Button variant="outline" onClick={() => window.location.href = '/login'}>Go to Login</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

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
                    {formatDate(report.submittedDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Due Date</p>
                  <p className="font-medium">
                    {formatDate(report.dueDate)}
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

        {/* View modal for full report */}
        {isViewOpen && viewReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-2xl rounded-lg bg-background p-6 shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{viewReport.title}</h3>
                  <p className="text-sm text-muted-foreground">Submitted by {viewReport.submittedBy} • {viewReport.department}</p>
                </div>
                <button onClick={() => { setIsViewOpen(false); setViewReport(null); }} className="text-muted-foreground">Close</button>
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium">Description</h4>
                  <p className="text-sm text-muted-foreground">{viewReport.description || '—'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-xs font-medium">Due date</h5>
                    <p className="text-sm text-muted-foreground">{formatDate(viewReport.dueDate)}</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-medium">Status</h5>
                    <p className="text-sm text-muted-foreground">{viewReport.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <a href={`/api/reports/${viewReport.id}/download`} className="btn" target="_blank" rel="noreferrer">
                    <Download className="h-4 w-4 mr-1" /> Download
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

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
