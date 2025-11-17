import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Outlet, useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [unread, setUnread] = useState<number>(0);

  useEffect(() => {
    let mounted = true;
    api.get('/notifications')
      .then((res) => {
        if (!mounted) return;
        if (Array.isArray(res.data)) {
          const count = res.data.filter((n: any) => !n.read).length;
          setUnread(count);
        }
      })
      .catch((err) => {
        console.warn('Failed to load notifications for header badge', err);
      });
    return () => { mounted = false };
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative"
                    onClick={async () => {
                      try {
                        const res = await api.get('/notifications');
                        if (Array.isArray(res.data)) setUnread(res.data.filter((n: any) => !n.read).length);
                      } catch (err) { /* ignore */ }
                      navigate("/notifications");
                    }}
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    {unread > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-destructive text-[10px]">
                        {unread}
                      </Badge>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => navigate("/settings")}
                    aria-label="Profile settings"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Profile Settings</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </header>
          <main className="flex-1 p-6 bg-background">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
