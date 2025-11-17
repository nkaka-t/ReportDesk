import { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import api from "@/lib/api";
import { FileText, Upload, Calendar, Filter, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import ErrorBoundary from '@/components/ErrorBoundary';
import { StatusBadge, Status } from "@/components/StatusBadge";
import { toast } from "sonner";

export default function Reports() {
  const [reports, setReports] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // helper to format dates
  const formatDate = (d?: string | null) => {
    if (!d) return '—';
    try { return new Date(d).toLocaleDateString(); } catch { return d; }
  }

  useEffect(() => {
    let mounted = true;
    api.get('/reports')
      .then((res) => { if (mounted && Array.isArray(res.data)) setReports(res.data); })
      .catch((err) => console.warn('Failed to load reports:', err));
    return () => { mounted = false };
  }, []);

  // auto-open submit dialog if ?openSubmit=1 is present
  const location = useLocation();
  useEffect(() => {
    try {
      const p = new URLSearchParams(location.search);
      if (p.get('openSubmit') === '1') setIsDialogOpen(true);
    } catch (e) {}
  }, [location.search]);

  // form state for submission
  const [title, setTitle] = useState('');
  const [searchQ, setSearchQ] = useState('');
  const [reportType, setReportType] = useState('');
  const [department, setDepartment] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [reportTypes, setReportTypes] = useState<Array<{id:number,name:string,department_id?:number}>>([]);

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || title.trim() === '') return toast.error('Please provide a title');
    if (!reportType || String(reportType).trim() === '') return toast.error('Please select a report type');
    if (dueDate && isNaN(new Date(dueDate).getTime())) return toast.error('Please provide a valid due date');
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('report_type_id', reportType);
      if (dueDate) fd.append('due_date', dueDate);
      fd.append('department', department);
      fd.append('description', description);
      if (file) fd.append('file', file);
      await api.post('/reports/submit', fd);
      toast.success('Report submitted successfully!');
      setIsDialogOpen(false);
      const res = await api.get('/reports');
      if (Array.isArray(res.data)) setReports(res.data);
    } catch (err) {
      console.error('Submit failed', err);
      // @ts-ignore
      const resp = err && err.response ? err.response : null;
      if (resp && resp.data && resp.data.error) {
        toast.error(`Failed: ${resp.data.error}`);
      } else {
        toast.error('Failed to submit report');
      }
    }
  };

  const handleSearch = async () => {
    try {
      const res = await api.get('/reports', { params: { q: searchQ } });
      if (Array.isArray(res.data) && res.data.length > 0) {
        setReports(res.data);
        return;
      }
      // server returned no matches - fall back to client-side search on the currently loaded list
      const q = String(searchQ || '').trim().toLowerCase();
      if (q === '') {
        // reload full list
        const all = await api.get('/reports');
        if (Array.isArray(all.data)) setReports(all.data);
        return;
      }
      const fallback = reports.filter((r) => {
        const title = (r.title || '').toString().toLowerCase();
        const desc = (r.description || '').toString().toLowerCase();
        const submitter = (r.submittedBy || (r.submittedBy && r.submittedBy.full_name) || '').toString().toLowerCase();
        return title.includes(q) || desc.includes(q) || submitter.includes(q);
      });
      setReports(fallback);
    } catch (err) {
      console.error('Search failed', err);
      toast.error('Search failed');
    }
  };

  const filteredReports =
    filterStatus === "all"
      ? reports
      : reports.filter((r) => String(r.status).toLowerCase() === filterStatus);

  const handleDownload = async (r: any, ev?: React.MouseEvent) => {
    if (ev) {
      ev.stopPropagation();
      ev.preventDefault();
    }
    if (!r || !r.filePath) return toast.error('No file attached to this report');
    try {
      const res: any = await api.get(`/reports/${r.id}/download`, { responseType: 'blob' });
      // try to get filename from headers
      const cd = res.headers && (res.headers['content-disposition'] || res.headers['Content-Disposition']);
      let filename = '';
      if (cd) {
        const m = cd.match(/filename\*?=([^;]+)(;|$)/i);
        if (m) {
          filename = m[1].trim();
          // strip encoding markers
          filename = filename.replace(/UTF-8''/, '').replace(/"/g, '');
        }
      }
      if (!filename) {
        // fallback to title or id
        const safe = (r.title || `report-${r.id}`).replace(/[^a-z0-9_.-]/gi, '_');
        // try to add extension from content-type
        const ct = res.headers && (res.headers['content-type'] || res.headers['Content-Type']);
        let ext = '';
        if (ct) {
          if (ct.includes('pdf')) ext = '.pdf';
          else if (ct.includes('msword')) ext = '.doc';
          else if (ct.includes('wordprocessingml')) ext = '.docx';
          else if (ct.includes('spreadsheetml') || ct.includes('excel')) ext = '.xlsx';
        }
        filename = safe + ext;
      }
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed', err);
      toast.error('Failed to download file');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reports</h1>
          <p className="text-muted-foreground">Submit, track, and manage your reports</p>
        </div>

        <div className="flex items-center gap-2">
          <Input placeholder="Search reports by title, description, or submitter..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearch(); } }} />
          <Button onClick={handleSearch}>Search</Button>
          <Button variant="outline" onClick={() => { setSearchQ(''); api.get('/reports').then((res) => { if (Array.isArray(res.data)) setReports(res.data); }).catch(() => {}); }}>Clear</Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Upload className="h-4 w-4 mr-2" />
              Submit Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <ErrorBoundary>
              <DialogHeader>
                <DialogTitle>Submit New Report</DialogTitle>
                <DialogDescription>Upload your report and provide necessary details</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmitReport} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-title">Report Title</Label>
                    <Input id="report-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Q4 Financial Report" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="report-type">Report Type</Label>
                    <Select value={reportType} onValueChange={setReportType} required>
                      <SelectTrigger id="report-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {reportTypes.length === 0 ? (
                          <>
                            <SelectItem value="1">Monthly</SelectItem>
                            <SelectItem value="2">Quarterly</SelectItem>
                            <SelectItem value="3">Annual</SelectItem>
                            <SelectItem value="4">Financial</SelectItem>
                          </>
                        ) : (
                          reportTypes.map((rt) => (
                            <SelectItem key={rt.id} value={String(rt.id)}>{rt.name}</SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="due-date">Due Date</Label>
                    <Input id="due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="report-department">Department</Label>
                    <Select value={department} onValueChange={setDepartment} required>
                      <SelectTrigger id="report-department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="hr">Human Resources</SelectItem>
                        <SelectItem value="it">IT</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of the report contents" rows={3} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Upload File</Label>
                  <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX, XLS, XLSX (MAX. 10MB)</p>
                    <Input ref={fileInputRef} id="file" type="file" className="hidden" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
                    {file && <p className="text-sm mt-2">Selected: {file.name}</p>}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-gradient-primary">Submit Report</Button>
                </div>
              </form>
            </ErrorBoundary>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Reports</CardTitle>
              <CardDescription>View and manage submitted reports</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report.id} onClick={() => { setSelectedReport(report); setIsPreviewOpen(true); }} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{report.title || report.type?.name || 'Untitled Report'}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{report.department}</span>
                      <span>•</span>
                      <span>{report.type?.name || report.type}</span>
                      <span>•</span>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-3 w-3" />
                        <span>Due: {report.dueDate ? formatDate(report.dueDate) : '—'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={(String(report.status || '').toLowerCase() as Status)} />
                  <button onClick={(ev) => handleDownload(report, ev)} className="btn btn-sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      {isPreviewOpen && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-lg bg-background p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{selectedReport.title || selectedReport.type?.name || 'Report'}</h3>
                <p className="text-sm text-muted-foreground">Submitted by {selectedReport.submittedBy?.full_name || selectedReport.submittedBy} • {selectedReport.department || selectedReport.type?.department?.name}</p>
              </div>
              <button onClick={() => { setIsPreviewOpen(false); setSelectedReport(null); }} className="text-muted-foreground">Close</button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedReport.description || '—'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="text-xs font-medium">Due date</h5>
                  <p className="text-sm text-muted-foreground">{formatDate(selectedReport.dueDate)}</p>
                </div>
                <div>
                  <h5 className="text-xs font-medium">Status</h5>
                  <p className="text-sm text-muted-foreground">{selectedReport.status}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={(ev) => handleDownload(selectedReport, ev)} className="btn">Download</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
