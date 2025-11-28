import { useState } from "react";
import {
  MessageSquareWarning,
  Plus,
  AlertCircle,
  CheckCircle2,
  Clock,
  MessageSquare,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function ComplaintsTab() {
  const [open, setOpen] = useState(false);

  const complaints = [
    {
      id: "COMP-2025-001",
      title: "Water Leakage in Bathroom",
      category: "Construction",
      priority: "high",
      status: "in-progress",
      date: "2025-10-28",
      lastUpdate: "2025-11-02",
      description:
        "Water leakage observed in the master bathroom area during recent site visit.",
      assignedTo: "Maintenance Team",
      responses: 2,
    },
    {
      id: "COMP-2025-002",
      title: "Payment Receipt Not Received",
      category: "Billing",
      priority: "medium",
      status: "resolved",
      date: "2025-10-15",
      lastUpdate: "2025-10-20",
      description:
        "Did not receive payment receipt for the last milestone payment.",
      assignedTo: "Finance Team",
      responses: 3,
    },
    {
      id: "COMP-2025-003",
      title: "Construction Progress Update Request",
      category: "General",
      priority: "low",
      status: "open",
      date: "2025-11-01",
      lastUpdate: "2025-11-01",
      description:
        "Requesting detailed update on current construction progress.",
      assignedTo: "Project Manager",
      responses: 0,
    },
    {
      id: "COMP-2024-045",
      title: "Documentation Clarification",
      category: "Documentation",
      priority: "low",
      status: "resolved",
      date: "2024-12-10",
      lastUpdate: "2024-12-15",
      description:
        "Need clarification on property documentation requirements.",
      assignedTo: "Legal Team",
      responses: 5,
    },
  ];

  const stats = [
    {
      label: "Total Tickets",
      value: complaints.length,
      color: "blue",
      icon: MessageSquareWarning,
    },
    {
      label: "Open",
      value: complaints.filter((c) => c.status === "open")
        .length,
      color: "orange",
      icon: AlertCircle,
    },
    {
      label: "In Progress",
      value: complaints.filter(
        (c) => c.status === "in-progress",
      ).length,
      color: "purple",
      icon: Clock,
    },
    {
      label: "Resolved",
      value: complaints.filter((c) => c.status === "resolved")
        .length,
      color: "green",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-2xl">
            Support Tickets
          </h2>
          <p className="text-gray-400 mt-1">
            Manage and track your complaints and queries
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
              <DialogDescription>
                Submit your complaint or query and our team will
                respond shortly
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Brief description of your issue"
                  className="rounded-full bg-gray-800 border-gray-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger
                      id="category"
                      className="rounded-full bg-gray-800 border-gray-700"
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="construction">
                        Construction
                      </SelectItem>
                      <SelectItem value="billing">
                        Billing & Payments
                      </SelectItem>
                      <SelectItem value="documentation">
                        Documentation
                      </SelectItem>
                      <SelectItem value="general">
                        General Query
                      </SelectItem>
                      <SelectItem value="maintenance">
                        Maintenance
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger
                      id="priority"
                      className="rounded-full bg-gray-800 border-gray-700"
                    >
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">
                        Medium
                      </SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">
                        Urgent
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about your issue..."
                  className="min-h-[120px] rounded-2xl bg-gray-800 border-gray-700 resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="booking">Related Booking</Label>
                <Select>
                  <SelectTrigger
                    id="booking"
                    className="rounded-full bg-gray-800 border-gray-700"
                  >
                    <SelectValue placeholder="Select booking (optional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="booking-1">
                      Sky Tower - Unit 401
                    </SelectItem>
                    <SelectItem value="booking-2">
                      Green Valley - Unit 102
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-full border-gray-700 hover:bg-gray-800 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Submit Ticket
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="bg-gray-900/50 border-gray-800 backdrop-blur-xl"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">
                      {stat.label}
                    </p>
                    <p className="text-white text-3xl">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`p-3 bg-${stat.color}-500/20 rounded-full`}
                  >
                    <Icon
                      className={`w-6 h-6 text-${stat.color}-400`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {complaints.map((complaint) => (
          <Card
            key={complaint.id}
            className="bg-gray-900/50 border-gray-800 backdrop-blur-xl hover:border-gray-700 transition-colors"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white text-lg">
                      {complaint.title}
                    </h3>
                    <Badge
                      className={`rounded-full ${
                        complaint.status === "resolved"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : complaint.status === "in-progress"
                            ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                            : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                      }`}
                    >
                      {complaint.status === "resolved" && (
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                      )}
                      {complaint.status === "in-progress" && (
                        <Clock className="w-3 h-3 mr-1" />
                      )}
                      {complaint.status === "open" && (
                        <AlertCircle className="w-3 h-3 mr-1" />
                      )}
                      {complaint.status}
                    </Badge>
                  </div>
                  <p className="text-gray-400">
                    {complaint.description}
                  </p>
                </div>
                <Badge
                  className={`rounded-full ${
                    complaint.priority === "high" ||
                    complaint.priority === "urgent"
                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                      : complaint.priority === "medium"
                        ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                  }`}
                >
                  {complaint.priority}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 rounded-xl bg-gray-800/30 mb-4">
                <div>
                  <p className="text-gray-400 text-xs mb-1">
                    Ticket ID
                  </p>
                  <p className="text-white text-sm font-mono">
                    {complaint.id}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">
                    Category
                  </p>
                  <p className="text-white text-sm">
                    {complaint.category}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">
                    Created
                  </p>
                  <p className="text-white text-sm">
                    {complaint.date}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">
                    Last Update
                  </p>
                  <p className="text-white text-sm">
                    {complaint.lastUpdate}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">
                    Assigned To
                  </p>
                  <p className="text-white text-sm">
                    {complaint.assignedTo}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">
                    {complaint.responses} responses
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-gray-700 hover:bg-gray-800"
                  >
                    View Details
                  </Button>
                  {complaint.status !== "resolved" && (
                    <Button
                      size="sm"
                      className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      Add Response
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact Info */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 border-blue-500/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">
            Need Immediate Assistance?
          </CardTitle>
          <CardDescription>
            Contact our support team directly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-gray-900/50">
              <p className="text-gray-400 text-sm mb-2">
                Phone
              </p>
              <p className="text-white">+1 (800) 123-4567</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-900/50">
              <p className="text-gray-400 text-sm mb-2">
                Email
              </p>
              <p className="text-white">
                support@eliteproperties.com
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-900/50">
              <p className="text-gray-400 text-sm mb-2">
                Office Hours
              </p>
              <p className="text-white">Mon - Fri: 9AM - 6PM</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}