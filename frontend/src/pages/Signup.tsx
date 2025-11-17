import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FileText, Mail, Lock, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/lib/api";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    role: "",
    managerSecret: "",
    // manager-specific options
    managerScope: "all", // 'all' or 'selected'
    managedDepartments: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.role) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (formData.role === 'manager') {
      if (!formData.managerSecret) {
        toast.error('Manager secret is required to register as manager');
        return;
      }
      if (formData.managerScope === 'selected' && formData.managedDepartments.length === 0) {
        toast.error('Please select at least one department for the manager or choose All Departments');
        return;
      }
    } else {
      // non-managers must pick a department
      if (!formData.department) {
        toast.error('Please select your department');
        return;
      }
    }

    // Call backend register
    (async () => {
      try {
        const payload: any = {
          full_name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          manager_secret: formData.managerSecret || undefined,
        };
        if (formData.role === 'manager') {
          // managers should not be attached to a single department
          payload.department_id = null;
          payload.manager_scope = formData.managerScope; // 'all' or 'selected'
          payload.managed_departments = formData.managerScope === 'selected' ? formData.managedDepartments : [];
        } else {
          payload.department_id = formData.department;
        }
        await api.post('/auth/register', payload);
  toast.success('Account created successfully!');
  navigate('/login');
      } catch (err) {
        console.error(err);
        toast.error('Signup failed');
      }
    })();
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary items-center justify-center p-12">
        <div className="text-center space-y-6 max-w-md">
          <div className="flex justify-center mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <FileText className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Join ReportDesk</h1>
          <p className="text-xl text-white/90">
            Start managing your company's reports with our comprehensive reporting system
          </p>
          <div className="pt-6 space-y-4 text-white/80">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-white/60"></div>
              <span>Streamlined report submission workflow</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-white/60"></div>
              <span>Two-stage review & approval process</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-white/60"></div>
              <span>Real-time notifications & tracking</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md border-none shadow-2xl">
          <CardHeader className="space-y-1">
            <div className="flex lg:hidden justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>

              {formData.role === 'manager' && (
                <div className="space-y-2">
                  <Label htmlFor="managerSecret">Manager Secret</Label>
                  <div className="relative">
                    <Input
                      id="managerSecret"
                      type="password"
                      placeholder="Enter manager registration secret"
                      className="pl-2"
                      value={formData.managerSecret}
                      onChange={(e) => setFormData({ ...formData, managerSecret: e.target.value })}
                      required
                    />
                  </div>
                </div>
              )}
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              Enter your details to create your ReportDesk account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@company.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                {formData.role !== 'manager' ? (
                  <>
                    <Label htmlFor="department">Department</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                      <Select
                        value={formData.department}
                        onValueChange={(value) => setFormData({ ...formData, department: value })}
                        required
                      >
                        <SelectTrigger id="department" className="pl-10">
                          <SelectValue placeholder="Select your department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="hr">Human Resources</SelectItem>
                          <SelectItem value="it">Information Technology</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="operations">Operations</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : (
                  <>
                    <Label>Manager Department Scope</Label>
                    <div className="flex flex-col space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="managerScope"
                          checked={formData.managerScope === 'all'}
                          onChange={() => setFormData({ ...formData, managerScope: 'all', managedDepartments: [] })}
                        />
                        <span>All Departments</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="managerScope"
                          checked={formData.managerScope === 'selected'}
                          onChange={() => setFormData({ ...formData, managerScope: 'selected' })}
                        />
                        <span>Select specific departments</span>
                      </label>

                      {formData.managerScope === 'selected' && (
                        <div className="grid grid-cols-2 gap-2">
                          {['finance','hr','it','marketing','operations'].map((d) => (
                            <label key={d} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={formData.managedDepartments.includes(d)}
                                onChange={(e) => {
                                  const next = formData.managedDepartments.includes(d)
                                    ? formData.managedDepartments.filter((x) => x !== d)
                                    : [...formData.managedDepartments, d];
                                  setFormData({ ...formData, managedDepartments: next });
                                }}
                              />
                              <span className="capitalize">{d}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                  required
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="reviewer">Department Reviewer</SelectItem>
                    <SelectItem value="approver">Approver (COO)</SelectItem>
                    <SelectItem value="manager">Manager (Full control)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-primary">
                Create Account
              </Button>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
