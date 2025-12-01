import { useState } from 'react';
import { CheckCircle2, Circle, Clock, DollarSign, Upload as UploadIcon, File as FileIcon, Download, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface UploadedMilestoneDocument {
  id: string;
  title: string;
  amount: string;
  status: string;
  dueDate: string;
  documentType: 'Demand Letter' | 'Invoice';
  fileName: string;
  fileSize: number;
  fileUrl: string;
}

export default function PaymentMilestonesTab() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [documentType, setDocumentType] = useState<'Demand Letter' | 'Invoice' | ''>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedMilestoneDocument[]>([]);

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

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setStatus('');
    setDueDate('');
    setDocumentType('');
    setSelectedFile(null);
  };

  const handleSaveAndUpload = () => {
    if (!title || !amount || !status || !dueDate || !documentType || !selectedFile) return;

    const fileUrl = URL.createObjectURL(selectedFile);

    const newDoc: UploadedMilestoneDocument = {
      id: `${Date.now()}`,
      title,
      amount,
      status,
      dueDate,
      documentType: documentType as 'Demand Letter' | 'Invoice',
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      fileUrl,
    };

    setUploadedDocs(prev => [newDoc, ...prev]);
    setIsUploadModalOpen(false);
    resetForm();
  };

  const handleViewDocument = (doc: UploadedMilestoneDocument) => {
    window.open(doc.fileUrl, '_blank');
  };

  const handleDownloadDocument = (doc: UploadedMilestoneDocument) => {
    const link = document.createElement('a');
    link.href = doc.fileUrl;
    link.download = doc.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-2xl">Payment Milestones</h2>
          <p className="text-gray-400 mt-1">Track your payment schedule and milestones</p>
        </div>
        <Button
          className="text-white hover:opacity-90 flex items-center gap-2"
          style={{ backgroundColor: "#6f60ff" }}
          onClick={() => setIsUploadModalOpen(true)}
        >
          <UploadIcon className="w-4 h-4" />
          Upload Document
        </Button>
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

      {/* Uploaded milestone documents list */}
      {uploadedDocs.length > 0 && (
        <Card className="bg-gray-900/60 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileIcon className="w-5 h-5 text-blue-400" />
              Uploaded Milestone Documents
            </CardTitle>
            <CardDescription className="text-gray-400">
              All milestone documents you have uploaded from this section
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-gray-800/60 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <FileIcon className="w-5 h-5 text-blue-400 mt-1" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-medium text-sm">{doc.title}</p>
                        <Badge
                          className={`rounded-full px-2 py-0.5 text-[10px] ${doc.documentType === 'Demand Letter'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                              : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                            }`}
                        >
                          {doc.documentType}
                        </Badge>
                        <Badge
                          className={`rounded-full px-2 py-0.5 text-[10px] ${doc.status === 'Completed'
                              ? 'bg-green-500/20 text-green-300 border-green-500/40'
                              : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                            }`}
                        >
                          {doc.status}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-xs mb-1">
                        Amount: ₹{Number(doc.amount).toLocaleString('en-IN')} • Due: {doc.dueDate}
                      </p>
                      <p className="text-gray-500 text-[11px]">
                        File: {doc.fileName} • {(doc.fileSize / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-blue-400 hover:bg-gray-700/70"
                      onClick={() => handleViewDocument(doc)}
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-green-400 hover:bg-gray-700/70"
                      onClick={() => handleDownloadDocument(doc)}
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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

                <div className={`flex gap-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer hover:scale-[1.01] ${milestone.status === 'completed'
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
                      <Badge className={`rounded-full flex-shrink-0 ${milestone.status === 'completed'
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

      {/* Upload Document Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="lg:max-w-[600px] bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Upload Milestone Document</DialogTitle>
            <DialogDescription className="text-gray-400">
              Fill the milestone details and upload the related document
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Top Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white text-sm">Title</Label>
                <Input
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Enter title (e.g. Second Installment)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white text-sm">Amount</Label>
                <Input
                  type="number"
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white text-sm">Status</Label>
                <Select
                  value={status}
                  onValueChange={(val: any) => setStatus(val)}
                >
                  <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

          <div className="space-y-2">
  <Label className="text-white text-sm">Due Date</Label>
  <Input
    type="date"
    className="bg-black border-gray-700 text-white"
    value={dueDate}
    onChange={(e) => setDueDate(e.target.value)}
    style={{
      color: "black",               
      filter: "invert(1)",         
      backgroundColor: "transparent" 
    }}
  />
</div>

            </div>

            {/* Document Type Picklist */}
            <div className="space-y-2">
              <Label className="text-white text-sm">Document Type</Label>
              <Select
                value={documentType}
                onValueChange={(val: 'Demand Letter' | 'Invoice') => setDocumentType(val)}
              >
                <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="Demand Letter">Demand Letter</SelectItem>
                  <SelectItem value="Invoice">Invoice</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* File Upload Area - show only after document type is selected */}
            {documentType && (
              <div className="space-y-2">
                <Label className="text-white text-sm">
                  Upload {documentType}
                </Label>
                <label
                  className="border-2 border-dashed border-gray-700 hover:border-gray-600 bg-gray-800/50 rounded-lg p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2"
                >
                  <UploadIcon className="w-8 h-8 text-gray-400" />
                  <p className="text-sm text-gray-300">
                    <span className="text-blue-400 font-medium">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, PNG, JPG, JPEG (max. 10MB)
                  </p>
                  <Input
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setSelectedFile(file);
                    }}
                  />
                </label>

                {selectedFile && (
                  <div className="flex items-center justify-between bg-gray-800/70 rounded-lg px-3 py-2 mt-2">
                    <div className="flex items-center gap-2">
                      <FileIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-200 truncate max-w-[260px]">
                        {selectedFile.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-red-400"
                      onClick={() => setSelectedFile(null)}
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="w-full flex justify-center gap-3 pt-2">
              <Button
                className="bg-white text-black hover:bg-gray-100 border border-gray-300"
                onClick={() => {
                  setIsUploadModalOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={!title || !amount || !status || !dueDate || !documentType || !selectedFile}
                className="bg-[#6f60ff] hover:bg-[#5a4dcc] text-white"
                style={{ backgroundColor: '#6f60ff', color: '#ffffff' }}
                onClick={handleSaveAndUpload}
              >
                Save & Upload
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
