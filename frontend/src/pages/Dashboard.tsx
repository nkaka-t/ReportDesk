import { FileText, CheckCircle, Clock, AlertCircle, TrendingUp, Users } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import api from "@/lib/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [stats, setStats] = useState<any | null>(null);
  const [upcomingDeliverables, setUpcomingDeliverables] = useState<any[]>([]);
  useEffect(() => {
    let mounted = true;
    api.get('/reports')
      .then((res) => { if (mounted) setRecentReports((res.data || []).slice(0,4)); })
      .catch(() => {});
    api.get('/stats').then((r) => { if (mounted) setStats(r.data); }).catch(() => {});
    api.get('/deliverables', { params: { status: 'Pending' } })
      .then((res) => { if (mounted) setUpcomingDeliverables((res.data || []).slice(0,3)); })
      .catch(() => {});
    return () => { mounted = false };
  }, []);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your reporting activities and pending tasks
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Reports"
          value={stats ? stats.totalReports : '—'}
          icon={FileText}
          description="All time submissions"
          gradient="primary"
        />
        <StatCard
          title="Pending Review"
          value={stats ? stats.pendingReview : '—'}
          icon={Clock}
          description="Awaiting action"
          gradient="warning"
        />
        <StatCard
          title="Approved This Month"
          value={stats ? stats.approvedThisMonth : '—'}
          icon={CheckCircle}
          description="Successfully completed"
          gradient="success"
        />
        <StatCard
          title="Needs Attention"
          value={stats ? stats.needsAttention : '—'}
          icon={AlertCircle}
          description="Requires revision"
          gradient="danger"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Latest report submissions and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{report.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{report.department}</span>
                      <span>•</span>
                      <span>Due: {new Date(report.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <StatusBadge status={report.status} />
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/reports')}>
              View All Reports
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Activity</CardTitle>
            <CardDescription>Submission rates by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(stats && stats.departmentActivity ? stats.departmentActivity : []).map((dept: any) => (
                <div key={dept.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{dept.name}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {dept.reports} reports • {dept.completion}%
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary transition-all"
                      style={{ width: `${dept.completion}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-primary text-white">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Need to submit a report?</h3>
            <p className="text-white/80">
              Click here to submit your department's latest report
            </p>
          </div>
          <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90" onClick={() => navigate('/reports?openSubmit=1')}>
            Submit Report
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Deliverables</CardTitle>
          <CardDescription>Stay ahead of your scheduling commitments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingDeliverables.map((deliverable) => (
            <div key={deliverable.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-semibold">{deliverable.report_type || deliverable.schedule?.name || `Deliverable #${deliverable.id}`}</p>
                <p className="text-sm text-muted-foreground">
                  Due by {deliverable.due_date ? new Date(deliverable.due_date).toLocaleDateString() : '—'}
                  {deliverable.team ? ` • ${deliverable.team}` : ''}
                </p>
              </div>
              <Badge variant="secondary">{deliverable.status}</Badge>
            </div>
          ))}
          {upcomingDeliverables.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">No upcoming deliverables.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
