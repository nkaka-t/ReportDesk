import { useState } from "react";
import { Search as SearchIcon, Filter, Calendar, FileText, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";

const allReports = [
  {
    id: 1,
    title: "Q4 Financial Report",
    department: "Finance",
    type: "Quarterly",
    status: "pending" as const,
    submittedDate: "2025-10-22",
    submittedBy: "John Doe",
  },
  {
    id: 2,
    title: "HR Monthly Summary - October",
    department: "Human Resources",
    type: "Monthly",
    status: "reviewed" as const,
    submittedDate: "2025-10-20",
    submittedBy: "Jane Smith",
  },
  {
    id: 3,
    title: "IT Infrastructure Report",
    department: "IT",
    type: "Annual",
    status: "approved" as const,
    submittedDate: "2025-10-18",
    submittedBy: "Mike Johnson",
  },
  {
    id: 4,
    title: "Marketing Campaign Analysis",
    department: "Marketing",
    type: "Monthly",
    status: "revision" as const,
    submittedDate: "2025-10-21",
    submittedBy: "Sarah Williams",
  },
  {
    id: 5,
    title: "Operations Efficiency Report",
    department: "Operations",
    type: "Quarterly",
    status: "approved" as const,
    submittedDate: "2025-10-15",
    submittedBy: "Tom Anderson",
  },
];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const filteredReports = allReports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = filterDept === "all" || report.department === filterDept;
    const matchesStatus = filterStatus === "all" || report.status === filterStatus;
    const matchesType = filterType === "all" || report.type === filterType;

    return matchesSearch && matchesDept && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Search Reports</h1>
        <p className="text-muted-foreground">
          Find and filter reports across all departments
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Use filters to narrow down your search</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, department, or submitter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={filterDept} onValueChange={setFilterDept}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Human Resources">Human Resources</SelectItem>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="revision">Needs Revision</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Quarterly">Quarterly</SelectItem>
                <SelectItem value="Annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
          <CardDescription>
            {filteredReports.length} report{filteredReports.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{report.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{report.department}</span>
                      <span>•</span>
                      <span>{report.type}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(report.submittedDate).toLocaleDateString()}</span>
                      </div>
                      <span>•</span>
                      <span>By {report.submittedBy}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={report.status} />
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}

            {filteredReports.length === 0 && (
              <div className="text-center py-12">
                <SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Reports Found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
