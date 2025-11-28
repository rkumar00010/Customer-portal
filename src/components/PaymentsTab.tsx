import { Download, CreditCard, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export default function PaymentsTab() {
  const payments = [
    {
      id: 'PAY-2024-001',
      date: '2024-08-15',
      milestone: 'Booking Amount',
      amount: 8500000,
      method: 'Wire Transfer',
      status: 'completed',
      transactionId: 'TXN123456789'
    },
    {
      id: 'PAY-2024-002',
      date: '2024-09-01',
      milestone: 'On Allotment',
      amount: 8500000,
      method: 'Check',
      status: 'completed',
      transactionId: 'TXN123456790'
    },
    {
      id: 'PAY-2024-003',
      date: '2024-10-12',
      milestone: 'On Start of Excavation',
      amount: 8500000,
      method: 'Wire Transfer',
      status: 'completed',
      transactionId: 'TXN123456791'
    },
    {
      id: 'PAY-2024-004',
      date: '2024-12-18',
      milestone: 'On Completion of Foundation',
      amount: 8500000,
      method: 'Wire Transfer',
      status: 'completed',
      transactionId: 'TXN123456792'
    },
    {
      id: 'PAY-2025-001',
      date: '2025-02-10',
      milestone: 'On Completion of Plinth',
      amount: 8500000,
      method: 'Online Banking',
      status: 'completed',
      transactionId: 'TXN123456793'
    },
    {
      id: 'PAY-2025-002',
      date: '2025-11-20',
      milestone: 'Foundation Complete',
      amount: 12500000,
      method: 'Pending',
      status: 'pending',
      transactionId: '-'
    },
  ];

  const stats = [
    {
      label: 'Total Paid',
      value: '₹4.25 Cr',
      icon: CheckCircle,
      color: 'green'
    },
    {
      label: 'Pending',
      value: '₹1.25 Cr',
      icon: Clock,
      color: 'orange'
    },
    {
      label: 'Next Due',
      value: 'Nov 20, 2025',
      icon: CreditCard,
      color: 'blue'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-white text-2xl">Payment History</h2>
          <p className="text-gray-400 mt-1">View all your payment transactions and status</p>
        </div>
        <div className="flex gap-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px] rounded-full text-white bg-gray-800 border-gray-700">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-gray-700">
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Button className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`bg-gradient-to-br from-${stat.color}-500/10 to-${stat.color}-600/5 border-${stat.color}-500/20 backdrop-blur-xl`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-${stat.color}-300 text-sm mb-2`}>{stat.label}</p>
                    <p className="text-white text-2xl">{stat.value}</p>
                  </div>
                  <div className={`p-3 bg-${stat.color}-500/20 rounded-full`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-400`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Payments Table */}
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Transaction History</CardTitle>
          <CardDescription>Detailed payment records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="text-gray-400">Payment ID</TableHead>
                  <TableHead className="text-gray-400">Date</TableHead>
                  <TableHead className="text-gray-400">Milestone</TableHead>
                  <TableHead className="text-gray-400">Amount</TableHead>
                  <TableHead className="text-gray-400">Method</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Transaction ID</TableHead>
                  <TableHead className="text-gray-400 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id} className="border-gray-800 hover:bg-gray-800/50">
                    <TableCell className="text-white">{payment.id}</TableCell>
                    <TableCell className="text-gray-300">{payment.date}</TableCell>
                    <TableCell className="text-gray-300">{payment.milestone}</TableCell>
                    <TableCell className="text-white">₹{(payment.amount / 10000000).toFixed(2)} Cr</TableCell>
                    <TableCell className="text-gray-300">{payment.method}</TableCell>
                    <TableCell>
                      <Badge className={`rounded-full ${
                        payment.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                          : payment.status === 'pending'
                          ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                        {payment.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {payment.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        {payment.status === 'failed' && <XCircle className="w-3 h-3 mr-1" />}
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-400 font-mono text-xs">{payment.transactionId}</TableCell>
                    <TableCell className="text-right">
                      {payment.status === 'completed' ? (
                        <Button variant="ghost" size="sm" className="rounded-full hover:bg-gray-800">
                          <Download className="w-4 h-4 mr-2" />
                          Receipt
                        </Button>
                      ) : payment.status === 'pending' ? (
                        <Button size="sm" className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                          Pay Now
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Payment Methods</CardTitle>
          <CardDescription>Available payment options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-gray-800 bg-gray-800/30 hover:border-blue-500/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <CreditCard className="w-5 h-5 text-blue-400" />
                </div>
                <h4 className="text-white">Wire Transfer</h4>
              </div>
              <p className="text-gray-400 text-sm">Direct bank transfer to company account</p>
            </div>

            <div className="p-4 rounded-xl border border-gray-800 bg-gray-800/30 hover:border-blue-500/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <h4 className="text-white">Online Banking</h4>
              </div>
              <p className="text-gray-400 text-sm">Pay directly through online banking</p>
            </div>

            <div className="p-4 rounded-xl border border-gray-800 bg-gray-800/30 hover:border-blue-500/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                </div>
                <h4 className="text-white">Cheque Payment</h4>
              </div>
              <p className="text-gray-400 text-sm">Submit cheque at office location</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
