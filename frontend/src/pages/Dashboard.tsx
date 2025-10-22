import { FileText, CheckCircle, Clock, AlertCircle, TrendingUp, Users } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";

const recentReports = [
  {
    id: 1,
    title: "Q4 Financial Report",
    department: "Finance",
    dueDate: "2025-11-05",
    status: "pending" as const,
    submittedBy: "John Doe",
  },
  {
    id: 2,
    title: "HR Monthly Summary",
    department: "Human Resources",
    dueDate: "2025-10-28",
    status: "reviewed" as const,
    submittedBy: "Jane Smith",
  },
  {
    id: 3,
    title: "IT Infrastructure Report",
    department: "IT",
    dueDate: "2025-10-25",
    status: "approved" as const,
    submittedBy: "Mike Johnson",
  },
  {
    id: 4,
    title: "Marketing Campaign Analysis",
    department: "Marketing",
    dueDate: "2025-10-30",
    status: "revision" as const,
    submittedBy: "Sarah Williams",
  },
];

export default function Dashboard() {
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
          value="248"
          icon={FileText}
          description="All time submissions"
          trend={{ value: 12, isPositive: true }}
          gradient="primary"
        />
        <StatCard
          title="Pending Review"
          value="18"
          icon={Clock}
          description="Awaiting action"
          gradient="warning"
        />
        <StatCard
          title="Approved This Month"
          value="42"
          icon={CheckCircle}
          description="Successfully completed"
          trend={{ value: 8, isPositive: true }}
          gradient="success"
        />
        <StatCard
          title="Needs Attention"
          value="5"
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
            <Button variant="outline" className="w-full mt-4">
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
              {[
                { name: "Finance", reports: 45, completion: 92 },
                { name: "IT", reports: 38, completion: 87 },
                { name: "HR", reports: 32, completion: 95 },
                { name: "Marketing", reports: 28, completion: 82 },
                { name: "Operations", reports: 25, completion: 88 },
              ].map((dept) => (
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
          <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
            Submit Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
