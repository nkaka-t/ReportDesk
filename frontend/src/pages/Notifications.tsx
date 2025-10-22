import { Bell, CheckCircle, AlertCircle, Clock, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const notifications = [
  {
    id: 1,
    type: "success",
    title: "Report Approved",
    message: "Your IT Infrastructure Report has been approved by COO",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "warning",
    title: "Review Required",
    message: "New report submission from Finance department needs your review",
    time: "5 hours ago",
    read: false,
  },
  {
    id: 3,
    type: "info",
    title: "Report Deadline Approaching",
    message: "Q4 Financial Report is due in 3 days",
    time: "1 day ago",
    read: true,
  },
  {
    id: 4,
    type: "error",
    title: "Revision Requested",
    message: "Marketing Campaign Analysis needs revision - check reviewer comments",
    time: "2 days ago",
    read: true,
  },
  {
    id: 5,
    type: "info",
    title: "New Report Schedule",
    message: "Monthly HR report schedule has been updated",
    time: "3 days ago",
    read: true,
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle className="h-5 w-5 text-success" />;
    case "warning":
      return <Clock className="h-5 w-5 text-warning" />;
    case "error":
      return <AlertCircle className="h-5 w-5 text-destructive" />;
    default:
      return <FileText className="h-5 w-5 text-primary" />;
  }
};

const getGradient = (type: string) => {
  switch (type) {
    case "success":
      return "bg-gradient-success";
    case "warning":
      return "bg-gradient-warning";
    case "error":
      return "bg-gradient-danger";
    default:
      return "bg-gradient-primary";
  }
};

export default function Notifications() {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your report activities
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Badge className="bg-primary/10 text-primary">
              {unreadCount} unread
            </Badge>
          )}
          <Button variant="outline">Mark all as read</Button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`transition-all hover:shadow-md ${
              !notification.read ? "border-l-4 border-l-primary bg-primary/5" : ""
            }`}
          >
            <CardContent className="flex items-start gap-4 p-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${getGradient(
                  notification.type
                )}`}
              >
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-semibold">{notification.title}</h4>
                  <span className="text-xs text-muted-foreground">
                    {notification.time}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {notification.message}
                </p>
              </div>
              {getIcon(notification.type)}
            </CardContent>
          </Card>
        ))}
      </div>

      {notifications.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Notifications</h3>
            <p className="text-muted-foreground text-center">
              You're all caught up! Check back later for updates.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
