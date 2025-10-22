import { useState } from "react";
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

const mockDepartments = [
  {
    id: 1,
    name: "Finance",
    description: "Financial planning and reporting",
    teamCount: 3,
    memberCount: 24,
    activeReports: 8,
  },
  {
    id: 2,
    name: "Human Resources",
    description: "Employee management and recruitment",
    teamCount: 2,
    memberCount: 12,
    activeReports: 5,
  },
  {
    id: 3,
    name: "Information Technology",
    description: "IT infrastructure and support",
    teamCount: 4,
    memberCount: 18,
    activeReports: 12,
  },
  {
    id: 4,
    name: "Marketing",
    description: "Brand management and campaigns",
    teamCount: 3,
    memberCount: 15,
    activeReports: 7,
  },
];

export default function Departments() {
  const [departments, setDepartments] = useState(mockDepartments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDept, setNewDept] = useState({ name: "", description: "" });

  const handleAddDepartment = () => {
    if (newDept.name && newDept.description) {
      setDepartments([
        ...departments,
        {
          id: departments.length + 1,
          name: newDept.name,
          description: newDept.description,
          teamCount: 0,
          memberCount: 0,
          activeReports: 0,
        },
      ]);
      setNewDept({ name: "", description: "" });
      setIsDialogOpen(false);
      toast.success("Department created successfully!");
    }
  };

  const handleDeleteDepartment = (id: number) => {
    setDepartments(departments.filter((dept) => dept.id !== id));
    toast.success("Department deleted");
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
                      {dept.description}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Teams</span>
                  <Badge variant="secondary">{dept.teamCount}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Members</span>
                  <Badge variant="secondary">
                    <Users className="h-3 w-3 mr-1" />
                    {dept.memberCount}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Active Reports</span>
                  <Badge className="bg-primary/10 text-primary">
                    {dept.activeReports}
                  </Badge>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
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
    </div>
  );
}
