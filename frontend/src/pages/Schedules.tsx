import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, Repeat, Layers, Plus, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import api from "@/lib/api";

type Department = { id: number; name: string };
type Team = { id: number; name: string; department_id: number };
type ReportType = { id: number; name: string; department_id?: number };
type Schedule = {
  id: number;
  name: string;
  department_id: number;
  team_id?: number | null;
  report_type_id: number;
  frequency: string;
  day_of_period?: number | null;
  next_due_at: string;
  last_generated_at?: string | null;
  active: boolean;
};

const freqOptions = [
  { value: "monthly", label: "Monthly" },
  { value: "biweekly", label: "Bi-Weekly" },
  { value: "weekly", label: "Weekly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "daily", label: "Daily" },
];

export default function Schedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    department_id: "",
    team_id: "",
    report_type_id: "",
    frequency: "monthly",
    day_of_period: "",
    next_due_at: "",
  });

  const load = async () => {
    try {
      const [schedRes, deptRes, teamRes, rtRes] = await Promise.all([
        api.get("/schedules"),
        api.get("/departments"),
        api.get("/teams"),
        api.get("/report-types"),
      ]);
      setSchedules(schedRes.data || []);
      setDepartments(deptRes.data || []);
      setTeams(teamRes.data || []);
      setReportTypes(rtRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load schedules");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const teamsByDept = useMemo(() => {
    const grouped: Record<string, Team[]> = {};
    teams.forEach((team) => {
      const key = String(team.department_id);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(team);
    });
    return grouped;
  }, [teams]);

  const reportTypesByDept = useMemo(() => {
    const grouped: Record<string, ReportType[]> = {};
    reportTypes.forEach((rt) => {
      const key = rt.department_id ? String(rt.department_id) : "global";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(rt);
    });
    return grouped;
  }, [reportTypes]);

  const handleCreate = async () => {
    if (!form.name || !form.department_id || !form.report_type_id || !form.next_due_at) {
      toast.error("Please fill required fields");
      return;
    }
    try {
      await api.post("/schedules", {
        name: form.name,
        department_id: Number(form.department_id),
        team_id: form.team_id ? Number(form.team_id) : undefined,
        report_type_id: Number(form.report_type_id),
        frequency: form.frequency,
        day_of_period: form.day_of_period ? Number(form.day_of_period) : undefined,
        next_due_at: form.next_due_at,
      });
      toast.success("Schedule created");
      setIsDialogOpen(false);
      setForm({
        name: "",
        department_id: "",
        team_id: "",
        report_type_id: "",
        frequency: "monthly",
        day_of_period: "",
        next_due_at: "",
      });
      load();
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Failed to create schedule";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Report Schedules</h1>
          <p className="text-muted-foreground">
            Configure recurring deliverables for departments and teams
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>New Report Schedule</DialogTitle>
              <DialogDescription>
                Define frequency and ownership for a recurring deliverable.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Monthly Finance Close"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select
                    value={form.department_id}
                    onValueChange={(value) => {
                      setForm({
                        ...form,
                        department_id: value,
                        team_id: "",
                        report_type_id: "",
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={String(dept.id)}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Team (optional)</Label>
                  <Select
                    value={form.team_id}
                    onValueChange={(value) => setForm({ ...form, team_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All teams" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Teams</SelectItem>
                      {(teamsByDept[form.department_id] || []).map((team) => (
                        <SelectItem key={team.id} value={String(team.id)}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select
                  value={form.report_type_id}
                  onValueChange={(value) => setForm({ ...form, report_type_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {(reportTypesByDept[form.department_id] || reportTypesByDept["global"] || []).map(
                      (rt) => (
                        <SelectItem key={rt.id} value={String(rt.id)}>
                          {rt.name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select
                    value={form.frequency}
                    onValueChange={(value) => setForm({ ...form, frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {freqOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="day">Day (optional)</Label>
                  <Input
                    id="day"
                    type="number"
                    value={form.day_of_period}
                    min={1}
                    max={31}
                    onChange={(e) => setForm({ ...form, day_of_period: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="next_due_at">Next Due Date</Label>
                <Input
                  id="next_due_at"
                  type="date"
                  value={form.next_due_at}
                  onChange={(e) => setForm({ ...form, next_due_at: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>
                <Save className="h-4 w-4 mr-2" />
                Save Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Schedules</CardTitle>
          <CardDescription>Automatically generated deliverables for each reporting cycle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedules.map((schedule) => {
              const dept = departments.find((d) => d.id === schedule.department_id);
              const team = teams.find((t) => t.id === schedule.team_id);
              const rt = reportTypes.find((r) => r.id === schedule.report_type_id);
              return (
                <div
                  key={schedule.id}
                  className="border rounded-lg p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{schedule.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {dept?.name} {team ? `• ${team.name}` : ""} • {rt?.name}
                    </p>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Repeat className="h-4 w-4" /> {schedule.frequency}
                      </span>
                      {schedule.day_of_period && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Day {schedule.day_of_period}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Next due {new Date(schedule.next_due_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    <Badge variant={schedule.active ? "default" : "secondary"}>
                      {schedule.active ? "Active" : "Paused"}
                    </Badge>
                    {schedule.last_generated_at && (
                      <span className="text-xs text-muted-foreground">
                        Last generated {new Date(schedule.last_generated_at).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            {schedules.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No schedules yet. Click "Create Schedule" to add one.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

