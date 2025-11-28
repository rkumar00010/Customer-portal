import { useState } from 'react';
import { IndianRupee, Calendar, TrendingUp, Bell, Building, CheckCircle, Clock, Download, CreditCard, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import propertyImage from 'figma:asset/d1445a74392c9eb12dc32c8bcc15d13bbad6f2a3.png';

export default function DashboardHome() {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [progressDialogOpen, setProgressDialogOpen] = useState(false);
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const [selectedStat, setSelectedStat] = useState<string>('');
  const upcomingPayments = [
    { id: 1, milestone: 'Foundation Complete', amount: 12500000, dueDate: '2025-11-20', status: 'pending' },
    { id: 2, milestone: 'Structural Work', amount: 15000000, dueDate: '2025-12-15', status: 'upcoming' },
    { id: 3, milestone: 'Finishing Work', amount: 10000000, dueDate: '2026-01-30', status: 'upcoming' },
    { id: 4, milestone: 'Interior Finishing', amount: 22500000, dueDate: '2026-03-01', status: 'upcoming' },
    { id: 5, milestone: 'Final Handover', amount: 55000000, dueDate: '2026-08-15', status: 'upcoming' },

  ];

  const announcements = [
    { 
      id: 1, 
      title: 'Construction Milestone Achieved', 
      message: 'Foundation work completed ahead of schedule. Next phase begins next week.',
      date: '2025-11-03',
      type: 'success'
    },
    { 
      id: 2, 
      title: 'Holiday Schedule Update', 
      message: 'Office will be closed from Dec 24-26. Emergency contact available.',
      date: '2025-11-01',
      type: 'info'
    },
    { 
      id: 3, 
      title: 'Payment Reminder', 
      message: 'Your next payment is due on November 20, 2025.',
      date: '2025-10-30',
      type: 'warning'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0">
          <img 
            src='http://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870'
            alt="Property" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
        </div>
        <div className="relative p-8 md:p-12">
          <Badge className="rounded-full bg-blue-500/20 text-blue-400 border-blue-500/30 mb-4">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active Investment
          </Badge>
          <h2 className="text-white text-3xl md:text-4xl mb-3">Sky Tower, Unit 401</h2>
          <p className="text-gray-300 mb-6 max-w-xl">Your dream 3BHK apartment in the heart of Downtown District. Construction on track for March 2026 delivery.</p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-full px-6 py-3 border border-gray-800">
              <p className="text-gray-400 text-sm">Total Value</p>
              <p className="text-white text-xl">₹8.5 Cr</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-full px-6 py-3 border border-gray-800">
              <p className="text-gray-400 text-sm">Area</p>
              <p className="text-white text-xl">1,850 sq ft</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-full px-6 py-3 border border-gray-800">
              <p className="text-gray-400 text-sm">Progress</p>
              <p className="text-white text-xl">68%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          onClick={() => {
            setSelectedStat('investment');
            setStatsDialogOpen(true);
          }}
          className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 backdrop-blur-xl hover:border-blue-500/40 transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-blue-300">Total Investment</CardDescription>
              <div className="p-2 bg-blue-500/20 rounded-full">
                <IndianRupee className="w-4 h-4 text-blue-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-white text-3xl">₹8.5 Cr</CardTitle>
            <p className="text-gray-400 text-sm mt-1">Property Value</p>
          </CardContent>
        </Card>

        <Card 
          onClick={() => {
            setSelectedStat('paid');
            setStatsDialogOpen(true);
          }}
          className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 backdrop-blur-xl hover:border-green-500/40 transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-green-300">Paid Amount</CardDescription>
              <div className="p-2 bg-green-500/20 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-white text-3xl">₹4.75 Cr</CardTitle>
            <p className="text-gray-400 text-sm mt-1">55.88% Completed</p>
          </CardContent>
        </Card>

        <Card 
          onClick={() => {
            setSelectedStat('pending');
            setStatsDialogOpen(true);
          }}
          className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 backdrop-blur-xl hover:border-purple-500/40 transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-purple-300">Pending Amount</CardDescription>
              <div className="p-2 bg-purple-500/20 rounded-full">
                <Clock className="w-4 h-4 text-purple-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-white text-3xl">₹3.75 Cr</CardTitle>
            <p className="text-gray-400 text-sm mt-1">Remaining Balance</p>
          </CardContent>
        </Card>

        <Card 
          onClick={() => {
            setSelectedStat('nextPayment');
            setStatsDialogOpen(true);
          }}
          className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20 backdrop-blur-xl hover:border-orange-500/40 transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-orange-300">Next Payment</CardDescription>
              <div className="p-2 bg-orange-500/20 rounded-full">
                <Calendar className="w-4 h-4 text-orange-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-white text-3xl">₹1.25 Cr</CardTitle>
            <p className="text-gray-400 text-sm mt-1">Due Nov 20, 2025</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Construction Progress */}
        <Card 
          onClick={() => setProgressDialogOpen(true)}
          className="bg-gray-900/50 border-gray-800 backdrop-blur-xl overflow-hidden cursor-pointer hover:border-gray-700 transition-all duration-300 hover:scale-[1.01]"
        >
          {/* Construction Site Image */}
          <div className="relative h-48">
            <img 
              src="https://images.unsplash.com/photo-1654000749275-7b032f760975?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwY29uc3RydWN0aW9ufGVufDF8fHx8MTc2MjI2MDU3NXww&ixlib=rb-4.1.0&q=80&w=1080" 
              alt="Construction Site" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Construction Progress</CardTitle>
                  <CardDescription className="text-gray-200">Sky Tower, Unit 401</CardDescription>
                </div>
                <div className="p-2 bg-blue-500/90 rounded-full backdrop-blur-sm">
                  <Building className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Overall Progress</span>
                <span className="text-white">68%</span>
              </div>
              <Progress value={68} className="h-3" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer hover:scale-[1.02]">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div>
                    <p className="text-white text-sm">Foundation</p>
                    <p className="text-gray-400 text-xs">Completed</p>
                  </div>
                </div>
                <Badge className="rounded-full bg-green-500/20 text-green-400 border-green-500/30">100%</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer hover:scale-[1.02]">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <div>
                    <p className="text-white text-sm">Structural Work</p>
                    <p className="text-gray-400 text-xs">In Progress</p>
                  </div>
                </div>
                <Badge className="rounded-full bg-blue-500/20 text-blue-400 border-blue-500/30">75%</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer hover:scale-[1.02]">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                  <div>
                    <p className="text-white text-sm">Interior Finishing</p>
                    <p className="text-gray-400 text-xs">Upcoming</p>
                  </div>
                </div>
                <Badge className="rounded-full bg-gray-500/20 text-gray-400 border-gray-500/30">0%</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer hover:scale-[1.02]">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                  <div>
                    <p className="text-white text-sm">Final Handover</p>
                    <p className="text-gray-400 text-xs">Pending</p>
                  </div>
                </div>
                <Badge className="rounded-full bg-gray-500/20 text-gray-400 border-gray-500/30">0%</Badge>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800">
              <p className="text-gray-400 text-sm">Expected Completion: March 2026</p>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Payments */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Upcoming Payments</CardTitle>
                <CardDescription>Payment schedule for next 3 months</CardDescription>
              </div>
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-full">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingPayments.map((payment) => (
              <div 
                key={payment.id} 
                onClick={() => {
                  setSelectedPayment(payment);
                  setPaymentDialogOpen(true);
                }}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800/70 hover:border-gray-600/50 transition-all duration-300 cursor-pointer hover:scale-[1.02]"
              >
                <div className="flex-1">
                  <p className="text-white">{payment.milestone}</p>
                  <p className="text-gray-400 text-sm">Due: {payment.dueDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-white">₹{(payment.amount / 10000000).toFixed(2)} Cr</p>
                  {payment.status === 'pending' && (
                    <Badge className="rounded-full bg-orange-500/20 text-orange-400 border-orange-500/30 mt-1">
                      Due Soon
                    </Badge>
                  )}
                  {payment.status === 'upcoming' && (
                    <Badge className="rounded-full bg-blue-500/20 text-blue-400 border-blue-500/30 mt-1">
                      Upcoming
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            <Button 
              onClick={() => setPaymentDialogOpen(true)}
              className="w-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              View All Payments
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Announcements */}
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Announcements</CardTitle>
              <CardDescription>Latest updates and notifications</CardDescription>
            </div>
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full">
              <Bell className="w-5 h-5 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {announcements.map((announcement) => (
            <div 
              key={announcement.id} 
              className="flex items-start gap-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800/70 hover:border-gray-600/50 transition-all duration-300 cursor-pointer hover:scale-[1.01]"
            >
              <div className={`p-2 rounded-full ${
                announcement.type === 'success' ? 'bg-green-500/20' : 
                announcement.type === 'warning' ? 'bg-orange-500/20' : 
                'bg-blue-500/20'
              }`}>
                <Bell className={`w-4 h-4 ${
                  announcement.type === 'success' ? 'text-green-400' : 
                  announcement.type === 'warning' ? 'text-orange-400' : 
                  'text-blue-400'
                }`} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h4 className="text-white">{announcement.title}</h4>
                  <Badge className={`rounded-full ${
                    announcement.type === 'success' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 
                    announcement.type === 'warning' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 
                    'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  }`}>
                    {announcement.type}
                  </Badge>
                </div>
                <p className="text-gray-400 text-sm mt-1">{announcement.message}</p>
                <p className="text-gray-500 text-xs mt-2">{announcement.date}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Payment Details Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>Complete information about this payment milestone</DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4 mt-4">
              <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                <h4 className="text-white mb-2">{selectedPayment.milestone}</h4>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-gray-400 text-sm">Amount</p>
                    <p className="text-white text-xl">₹{(selectedPayment.amount / 10000000).toFixed(2)} Cr</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Due Date</p>
                    <p className="text-white">{selectedPayment.dueDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Status</p>
                    <Badge className={`rounded-full ${
                      selectedPayment.status === 'pending' 
                        ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' 
                        : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    }`}>
                      {selectedPayment.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button className="flex-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay Now
                </Button>
                <Button variant="outline" className="rounded-full border-gray-700 hover:bg-gray-800">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Construction Progress Dialog */}
      <Dialog open={progressDialogOpen} onOpenChange={setProgressDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Construction Progress Details</DialogTitle>
            <DialogDescription>Detailed view of construction milestones and timeline</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="relative h-48 rounded-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1654000749275-7b032f760975?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwY29uc3RydWN0aW9ufGVufDF8fHx8MTc2MjI2MDU3NXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Construction"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <p className="text-white text-xl">Overall Progress: 68%</p>
              </div>
            </div>
            <Progress value={68} className="h-3" />
            <div className="space-y-3">
              {[
                { name: 'Foundation', progress: 100, status: 'Completed' },
                { name: 'Structural Work', progress: 75, status: 'In Progress' },
                { name: 'Interior Finishing', progress: 0, status: 'Pending' },
                { name: 'Final Handover', progress: 0, status: 'Pending' }
              ].map((stage, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-gray-800/50">
                  <span className="text-white">{stage.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">{stage.status}</span>
                    <Badge className="rounded-full bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {stage.progress}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Eye className="w-4 h-4 mr-2" />
              View Photo Gallery
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stats Details Dialog */}
      <Dialog open={statsDialogOpen} onOpenChange={setStatsDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>
              {selectedStat === 'investment' && 'Total Investment Details'}
              {selectedStat === 'paid' && 'Paid Amount Breakdown'}
              {selectedStat === 'pending' && 'Pending Payment Details'}
              {selectedStat === 'nextPayment' && 'Next Payment Information'}
            </DialogTitle>
            <DialogDescription>Detailed financial information for your property</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {selectedStat === 'investment' && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-gray-400 text-sm">Property Value</p>
                  <p className="text-white text-3xl">₹8.5 Cr</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between p-3 rounded-xl bg-gray-800/50">
                    <span className="text-gray-400">Base Price</span>
                    <span className="text-white">₹7.8 Cr</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-gray-800/50">
                    <span className="text-gray-400">Taxes & Charges</span>
                    <span className="text-white">₹0.7 Cr</span>
                  </div>
                </div>
              </div>
            )}
            {selectedStat === 'paid' && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <p className="text-gray-400 text-sm">Amount Paid</p>
                  <p className="text-white text-3xl">₹4.75 Cr</p>
                  <Progress value={55.88} className="h-2 mt-3" />
                  <p className="text-gray-400 text-sm mt-2">55.88% of total amount</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between p-3 rounded-xl bg-gray-800/50">
                    <span className="text-gray-400">Number of Payments</span>
                    <span className="text-white">5</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-gray-800/50">
                    <span className="text-gray-400">Last Payment</span>
                    <span className="text-white">₹0.85 Cr</span>
                  </div>
                </div>
              </div>
            )}
            {selectedStat === 'pending' && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <p className="text-gray-400 text-sm">Remaining Balance</p>
                  <p className="text-white text-3xl">₹3.75 Cr</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between p-3 rounded-xl bg-gray-800/50">
                    <span className="text-gray-400">Upcoming Payments</span>
                    <span className="text-white">4 Milestones</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-gray-800/50">
                    <span className="text-gray-400">Expected Completion</span>
                    <span className="text-white">March 2026</span>
                  </div>
                </div>
              </div>
            )}
            {selectedStat === 'nextPayment' && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <p className="text-gray-400 text-sm">Next Payment Due</p>
                  <p className="text-white text-3xl">₹1.25 Cr</p>
                  <p className="text-orange-400 text-sm mt-2">Due on Nov 20, 2025</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between p-3 rounded-xl bg-gray-800/50">
                    <span className="text-gray-400">Milestone</span>
                    <span className="text-white">Foundation Complete</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-gray-800/50">
                    <span className="text-gray-400">Days Remaining</span>
                    <span className="text-white">15 days</span>
                  </div>
                </div>
                <Button className="w-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay Now
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
