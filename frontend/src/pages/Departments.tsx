import { useState, useEffect } from "react";
import { Building2, Users, Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import api from "@/lib/api";

type Dept = {
  id: number;
  name: string;
  description?: string | null;
  teamCount?: number;
  memberCount?: number;
  activeReports?: number;
};

export default function Departments() {
  const [departments, setDepartments] = useState<Dept[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .get('/departments')
      .then((res) => {
        if (mounted && Array.isArray(res.data)) setDepartments(res.data);
      })
      .catch((err) => {
        console.warn('Failed to load departments:', err);
        toast.error('Could not load departments');
      })
      .finally(() => setLoading(false));
    return () => { mounted = false };
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newDept, setNewDept] = useState({ name: "", description: "" });
  const [editDept, setEditDept] = useState<Dept | null>(null);

  const handleAddDepartment = async () => {
    if (!newDept.name) return toast.error('Name is required');
    try {
      const res = await api.post('/departments', { name: newDept.name, description: newDept.description });
      setDepartments((d) => [res.data, ...d]);
      setNewDept({ name: '', description: '' });
      setIsDialogOpen(false);
      toast.success('Department created');
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to create department';
      toast.error(msg);
    }
  };

  const openEdit = (dept: Dept) => {
    setEditDept(dept);
    setIsEditOpen(true);
  };

  const handleUpdateDepartment = async () => {
    if (!editDept) return;
    if (!editDept.name) return toast.error('Name is required');
    try {
      const res = await api.put(`/departments/${editDept.id}`, { name: editDept.name, description: editDept.description });
      setDepartments((d) => d.map((x) => (x.id === res.data.id ? res.data : x)));
      setIsEditOpen(false);
      setEditDept(null);
      toast.success('Department updated');
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to update department';
      toast.error(msg);
    }
  };

  const handleDeleteDepartment = async (id: number) => {
    if (!confirm('Delete department? This cannot be undone.')) return;
    try {
      await api.delete(`/departments/${id}`);
      setDepartments((d) => d.filter((dept) => dept.id !== id));
      toast.success('Department deleted');
    } catch (err) {
      // fallback: remove locally
      setDepartments((d) => d.filter((dept) => dept.id !== id));
      toast.success('Department deleted (local)');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Departments</h1>
          <p className="text-muted-foreground">
            Manage your organization's departments and teams
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Department</DialogTitle>
              <DialogDescription>
                Add a new department to your organization
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Department Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Operations"
                  value={newDept.name}
                  onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Brief description of the department"
                  value={newDept.description}
                  onChange={(e) =>
                    setNewDept({ ...newDept, description: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDepartment} className="bg-gradient-primary">
                Create Department
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept) => (
          <Card key={dept.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{dept.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {dept.description || '—'}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Teams</span>
                  <Badge variant="secondary">{dept.teamCount ?? 0}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Members</span>
                  <Badge variant="secondary">
                    <Users className="h-3 w-3 mr-1" />
                    {dept.memberCount ?? 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Active Reports</span>
                  <Badge className="bg-primary/10 text-primary">
                    {dept.activeReports ?? 0}
                  </Badge>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(dept)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteDepartment(dept.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Department Dialog */}
      <Dialog open={isEditOpen} onOpenChange={(v) => { if (!v) setEditDept(null); setIsEditOpen(v); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>Update department details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Department Name</Label>
              <Input id="edit-name" value={editDept?.name || ''} onChange={(e) => setEditDept((s) => s ? { ...s, name: e.target.value } : s)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-desc">Description</Label>
              <Input id="edit-desc" value={editDept?.description || ''} onChange={(e) => setEditDept((s) => s ? { ...s, description: e.target.value } : s)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditOpen(false); setEditDept(null); }}>Cancel</Button>
            <Button onClick={handleUpdateDepartment} className="bg-gradient-primary">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
