import { CheckCircle2, Circle, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

export default function PaymentMilestonesTab() {
  const milestones = [
    {
      id: 1,
      name: 'Booking Amount',
      amount: 8500000,
      percentage: 10,
      status: 'completed',
      dueDate: '2024-08-15',
      paidDate: '2024-08-15',
      description: 'Initial booking amount'
    },
    {
      id: 2,
      name: 'On Allotment',
      amount: 8500000,
      percentage: 10,
      status: 'completed',
      dueDate: '2024-09-01',
      paidDate: '2024-09-01',
      description: 'Unit allotment confirmation'
    },
    {
      id: 3,
      name: 'On Start of Excavation',
      amount: 8500000,
      percentage: 10,
      status: 'completed',
      dueDate: '2024-10-15',
      paidDate: '2024-10-12',
      description: 'Excavation work commenced'
    },
    {
      id: 4,
      name: 'On Completion of Foundation',
      amount: 8500000,
      percentage: 10,
      status: 'completed',
      dueDate: '2024-12-20',
      paidDate: '2024-12-18',
      description: 'Foundation work completed'
    },
    {
      id: 5,
      name: 'On Completion of Plinth',
      amount: 8500000,
      percentage: 10,
      status: 'completed',
      dueDate: '2025-02-10',
      paidDate: '2025-02-10',
      description: 'Plinth level completed'
    },
    {
      id: 6,
      name: 'Foundation Complete',
      amount: 12500000,
      percentage: 15,
      status: 'pending',
      dueDate: '2025-11-20',
      paidDate: null,
      description: 'Complete foundation milestone'
    },
    {
      id: 7,
      name: 'Structural Work',
      amount: 15000000,
      percentage: 18,
      status: 'upcoming',
      dueDate: '2025-12-15',
      paidDate: null,
      description: 'Structural work completion'
    },
    {
      id: 8,
      name: 'Finishing Work',
      amount: 10000000,
      percentage: 12,
      status: 'upcoming',
      dueDate: '2026-01-30',
      paidDate: null,
      description: 'Interior finishing'
    },
    {
      id: 9,
      name: 'On Possession',
      amount: 5000000,
      percentage: 5,
      status: 'upcoming',
      dueDate: '2026-03-15',
      paidDate: null,
      description: 'Final possession payment'
    },
  ];

  const completedAmount = milestones
    .filter(m => m.status === 'completed')
    .reduce((sum, m) => sum + m.amount, 0);
  
  const totalAmount = milestones.reduce((sum, m) => sum + m.amount, 0);
  const completionPercentage = (completedAmount / totalAmount) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-white text-2xl">Payment Milestones</h2>
        <p className="text-gray-400 mt-1">Track your payment schedule and milestones</p>
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 border-blue-500/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Payment Progress</CardTitle>
          <CardDescription>Overall milestone completion</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Total Amount</p>
              <p className="text-white text-2xl">₹{(totalAmount / 10000000).toFixed(2)} Cr</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Paid Amount</p>
              <p className="text-green-400 text-2xl">₹{(completedAmount / 10000000).toFixed(2)} Cr</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Remaining</p>
              <p className="text-orange-400 text-2xl">₹{((totalAmount - completedAmount) / 10000000).toFixed(2)} Cr</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Completion</span>
              <span className="text-white">{completionPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Milestones Timeline */}
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Milestone Timeline</CardTitle>
          <CardDescription>Detailed payment schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={milestone.id} className="relative">
                {/* Connector Line */}
                {index !== milestones.length - 1 && (
                  <div className="absolute left-5 top-12 w-0.5 h-full bg-gray-800"></div>
                )}
                
                <div className={`flex gap-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer hover:scale-[1.01] ${
                  milestone.status === 'completed' 
                    ? 'bg-green-500/5 border-green-500/20 hover:bg-green-500/10 hover:border-green-500/30' 
                    : milestone.status === 'pending'
                    ? 'bg-orange-500/5 border-orange-500/20 hover:bg-orange-500/10 hover:border-orange-500/30'
                    : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70 hover:border-gray-700'
                }`}>
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {milestone.status === 'completed' ? (
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center border-2 border-green-500">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      </div>
                    ) : milestone.status === 'pending' ? (
                      <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center border-2 border-orange-500 animate-pulse">
                        <Clock className="w-5 h-5 text-orange-400" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-700/20 flex items-center justify-center border-2 border-gray-700">
                        <Circle className="w-5 h-5 text-gray-500" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h4 className="text-white">{milestone.name}</h4>
                        <p className="text-gray-400 text-sm mt-1">{milestone.description}</p>
                      </div>
                      <Badge className={`rounded-full flex-shrink-0 ${
                        milestone.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                          : milestone.status === 'pending'
                          ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }`}>
                        {milestone.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Amount</p>
                        <p className="text-white">₹{(milestone.amount / 10000000).toFixed(2)} Cr</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Percentage</p>
                        <p className="text-white">{milestone.percentage}%</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Due Date</p>
                        <p className="text-white text-sm">{milestone.dueDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Paid Date</p>
                        <p className="text-white text-sm">
                          {milestone.paidDate || '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
