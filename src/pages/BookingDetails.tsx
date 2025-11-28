import { useParams, useNavigate } from 'react-router';
import { Building2, MapPin, ArrowLeft, Calendar, IndianRupee, Home, Download, FileText, Clock, CheckCircle2, Circle, TrendingUp, User, Mail, Phone, Hash, File as FileIcon, Paperclip, Upload as UploadIcon, Eye, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { UploadDocumentModal, type DocumentType, type UploadedFile } from '../components/UploadDocumentModal';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import { getBookingById } from '../utils/bookingsData';
import jsPDF from 'jspdf';

// Function to upload file to the server - DEBUGGED VERSION
const uploadFileToServer = async (file: File, documentType: DocumentType): Promise<UploadedFile> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('DocumentType', documentType);
  
  try {
    console.log('Uploading file:', file.name, 'Type:', documentType);
    
    const response = await fetch('https://cp-upload-docs.onrender.com/api/files/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed:', response.status, errorText);
      throw new Error(`Upload failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Upload response:', data);
    
    // Create a proper UploadedFile object
    const uploadedFile: UploadedFile = {
      id: data.fileId || Math.random().toString(36).substring(2, 9),
      name: file.name,
      type: documentType,
      size: file.size,
      uploadDate: new Date(),
      url: data.fileUrl || URL.createObjectURL(file),
      fileId: data.fileId || data.id // Try multiple possible field names
    };

    console.log('Created uploaded file:', uploadedFile);
    return uploadedFile;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Function to download file from the server
const downloadFileFromServer = async (fileId: string, fileName: string) => {
  try {
    console.log('Downloading file with ID:', fileId);
    
    const response = await fetch(`https://cp-upload-docs.onrender.com/api/files/download/${fileId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Download failed with status: ${response.status}`);
    }

    // Get the blob from response
    const blob = await response.blob();
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
    
    console.log('File downloaded successfully:', fileName);
    return true;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};

// Function to view file - Uses the same download API but opens in new tab
const viewFileFromServer = async (fileId: string, fileName: string) => {
  try {
    console.log('Viewing file with ID:', fileId);
    
    const response = await fetch(`https://cp-upload-docs.onrender.com/api/files/download/${fileId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`View failed with status: ${response.status}`);
    }

    // Get the blob from response
    const blob = await response.blob();
    
    // Create object URL for viewing
    const fileUrl = window.URL.createObjectURL(blob);
    
    // Open in new tab for viewing
    window.open(fileUrl, '_blank');
    
    console.log('File opened for viewing:', fileName);
    return true;
  } catch (error) {
    console.error('Error viewing file:', error);
    throw error;
  }
};

export default function BookingDetails() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null);
  const [viewingFileId, setViewingFileId] = useState<string | null>(null);

  // Load saved files from localStorage on component mount
  useEffect(() => {
    const savedFiles = localStorage.getItem(`uploadedFiles_${bookingId}`);
    if (savedFiles) {
      try {
        const parsedFiles = JSON.parse(savedFiles);
        console.log('Loaded files from localStorage:', parsedFiles);
        
        const filesWithDates = parsedFiles.map((file: any) => ({
          ...file,
          uploadDate: new Date(file.uploadDate)
        }));
        setUploadedFiles(filesWithDates);
      } catch (error) {
        console.error('Error parsing saved files:', error);
      }
    }
    setIsLoading(false);
  }, [bookingId]);

  // Save files to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      console.log('Saving files to localStorage:', uploadedFiles);
      localStorage.setItem(`uploadedFiles_${bookingId}`, JSON.stringify(uploadedFiles));
    }
  }, [uploadedFiles, bookingId, isLoading]);

  const handleFileUpload = async (file: File, documentType: DocumentType) => {
    try {
      console.log('Starting file upload...');
      const uploadedFile = await uploadFileToServer(file, documentType);
      console.log('Upload successful, adding to state:', uploadedFile);
      setUploadedFiles(prev => [...prev, uploadedFile]);
      return uploadedFile;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleDownloadFile = async (file: UploadedFile) => {
    console.log('Download button clicked for:', file);
    
    // Check if fileId exists
    if (!file.fileId) {
      console.error('File ID not available for download. File object:', file);
      alert('File ID not available for download. Please re-upload the file.');
      return;
    }

    setDownloadingFileId(file.id);
    try {
      await downloadFileFromServer(file.fileId, file.name);
    }catch (error) {
  const err = error as Error;
  alert(`Download failed: ${err.message}`);
}
finally {
      setDownloadingFileId(null);
    }
  };

  const handleViewFile = async (file: UploadedFile) => {
    console.log('View button clicked for:', file);
    
    // Check if fileId exists
    if (!file.fileId) {
      console.error('File ID not available for viewing. File object:', file);
      alert('File ID not available for viewing. Please re-upload the file.');
      return;
    }

    setViewingFileId(file.id);
    try {
      await viewFileFromServer(file.fileId, file.name);
    } catch (error) {
  const err = error as Error;
  alert(`Cannot view file: ${err.message}`);
}
finally {
      setViewingFileId(null);
    }
  };

  const getDocumentStatus = (docType: DocumentType): 'COMPLETE' | 'PENDING' => {
    return uploadedFiles.some(file => file.type === docType) ? 'COMPLETE' : 'PENDING';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const booking = bookingId ? getBookingById(bookingId) : null;

  if (!booking) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate('/bookings')}
            variant="outline"
            className="rounded-full border-gray-700 hover:bg-gray-800 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bookings
          </Button>
        </div>
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 bg-gray-800/50 rounded-full mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-white text-xl mb-2">Booking Not Found</h3>
            <p className="text-gray-400 text-center mb-6">The booking you're looking for doesn't exist</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Function to generate and download invoice PDF
  const downloadInvoice = (booking: any, milestone: any) => {
    const doc = new jsPDF();

    // Set font
    doc.setFont('helvetica');

    // Add KLOUDRAC header
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('KLOUDRAC', 20, 25);
    doc.setFontSize(10);
    doc.text('Real Estate Solutions', 20, 32);

    // Invoice title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.text('TAX INVOICE', 150, 25);

    // Invoice details box
    doc.setFontSize(10);
    doc.setDrawColor(200, 200, 200);
    doc.rect(140, 35, 60, 30);
    doc.text(`Invoice No: ${milestone.invoiceNumber}`, 145, 42);
    doc.text(`Date: ${milestone.invoiceDate}`, 145, 49);
    doc.text(`Due Date: ${milestone.dueDate}`, 145, 56);
    doc.text(`Booking ID: ${booking.bookingId}`, 145, 63);

    // Company details
    doc.setFontSize(10);
    doc.text('From:', 20, 50);
    doc.setFontSize(9);
    doc.text('KLOUDRAC Real Estate Pvt Ltd', 20, 57);
    doc.text('123 Business District', 20, 62);
    doc.text('Mumbai, Maharashtra - 400001', 20, 67);
    doc.text('GSTIN: 27AABCU9603R1ZV', 20, 72);
    doc.text('PAN: AABCU9603R', 20, 77);

    // Customer details
    doc.setFontSize(10);
    doc.text('Bill To:', 20, 90);
    doc.setFontSize(9);
    doc.text(booking.customerName, 20, 97);
    doc.text(booking.customerEmail, 20, 102);
    doc.text(booking.customerPhone, 20, 107);

    // Property details
    doc.setFontSize(10);
    doc.text('Property Details:', 110, 90);
    doc.setFontSize(9);
    doc.text(`${booking.propertyName} - Unit ${booking.unit}`, 110, 97);
    doc.text(`${booking.type}, ${booking.area}`, 110, 102);
    doc.text(booking.location, 110, 107);

    // Table header
    const tableTop = 125;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, tableTop, 170, 10, 'F');
    doc.setFontSize(10);
    doc.text('Description', 25, tableTop + 7);
    doc.text('Percentage', 110, tableTop + 7);
    doc.text('Amount (₹)', 160, tableTop + 7);

    // Table content
    let yPos = tableTop + 17;
    doc.setFontSize(9);
    doc.text(milestone.name, 25, yPos);
    doc.text(milestone.description, 25, yPos + 5);
    doc.text(`${milestone.percentage}%`, 110, yPos);
    doc.text(milestone.amount.toLocaleString('en-IN'), 160, yPos);

    // Subtotal
    yPos += 20;
    doc.line(20, yPos, 190, yPos);
    yPos += 7;
    doc.text('Subtotal:', 130, yPos);
    doc.text(`₹ ${milestone.amount.toLocaleString('en-IN')}`, 160, yPos);

    // GST breakdown
    yPos += 7;
    doc.text('CGST (9%):', 130, yPos);
    doc.text(`₹ ${(milestone.gstAmount / 2).toLocaleString('en-IN')}`, 160, yPos);

    yPos += 7;
    doc.text('SGST (9%):', 130, yPos);
    doc.text(`₹ ${(milestone.gstAmount / 2).toLocaleString('en-IN')}`, 160, yPos);

    // Total
    yPos += 10;
    doc.setFillColor(59, 130, 246);
    doc.rect(130, yPos - 5, 60, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text('Total Amount:', 135, yPos + 2);
    doc.text(`₹ ${milestone.totalAmount.toLocaleString('en-IN')}`, 160, yPos + 2);

    // Amount in words
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    yPos += 15;
    doc.text('Amount in words:', 20, yPos);
    const crores = Math.floor(milestone.totalAmount / 10000000);
    const lakhs = Math.floor((milestone.totalAmount % 10000000) / 100000);
    doc.text(`${crores} Crore ${lakhs} Lakh Rupees Only`, 20, yPos + 5);

    // Payment status
    yPos += 15;
    if (milestone.status === 'completed') {
      doc.setTextColor(0, 150, 0);
      doc.setFontSize(10);
      doc.text(`PAID on ${milestone.paidDate}`, 20, yPos);
    } else if (milestone.status === 'pending') {
      doc.setTextColor(255, 100, 0);
      doc.setFontSize(10);
      doc.text(`PAYMENT PENDING - Due on ${milestone.dueDate}`, 20, yPos);
    }

    // Terms and conditions
    yPos += 15;
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text('Terms & Conditions:', 20, yPos);
    doc.text('1. Payment must be made within the due date mentioned above.', 20, yPos + 5);
    doc.text('2. Late payment may attract interest charges as per agreement.', 20, yPos + 10);
    doc.text('3. All disputes are subject to Mumbai jurisdiction only.', 20, yPos + 15);

    // Footer
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 280, 210, 17, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('KLOUDRAC Real Estate Pvt Ltd | Email: info@kloudrac.com | Phone: +91 22 1234 5678', 105, 290, { align: 'center' });

    // Save the PDF
    doc.save(`Invoice-${milestone.invoiceNumber}-${booking.bookingId}.pdf`);
  };

  // Function to generate and download SOA (Statement of Accounts)
  const downloadSOA = (booking: any) => {
    const doc = new jsPDF();
    doc.setFont('helvetica');

    // Header
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('KLOUDRAC', 20, 25);
    doc.setFontSize(10);
    doc.text('Real Estate Solutions', 20, 32);

    // Document title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.text('STATEMENT OF ACCOUNTS', 105, 25, { align: 'center' });

    // Document details
    doc.setFontSize(10);
    doc.text(`Booking ID: ${booking.bookingId}`, 20, 50);
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 20, 57);

    // Customer details
    doc.text('Customer Details:', 20, 70);
    doc.setFontSize(9);
    doc.text(booking.customerName, 20, 77);
    doc.text(booking.customerEmail, 20, 82);
    doc.text(booking.customerPhone, 20, 87);

    // Property details
    doc.setFontSize(10);
    doc.text('Property Details:', 20, 100);
    doc.setFontSize(9);
    doc.text(`${booking.propertyName} - Unit ${booking.unit}`, 20, 107);
    doc.text(`${booking.type}, ${booking.area}`, 20, 112);
    doc.text(`Total Value: ₹${(booking.price / 10000000).toFixed(2)} Crores`, 20, 117);

    // Payment Summary table
    let yPos = 135;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos, 170, 10, 'F');
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text('Milestone', 25, yPos + 7);
    doc.text('Due Date', 80, yPos + 7);
    doc.text('Amount', 120, yPos + 7);
    doc.text('Status', 160, yPos + 7);

    yPos += 15;
    booking.milestones.forEach((milestone: any) => {
      doc.text(milestone.name, 25, yPos, { maxWidth: 50 });
      doc.text(milestone.dueDate, 80, yPos);
      doc.text(`₹${(milestone.amount / 10000000).toFixed(2)} Cr`, 120, yPos);
      doc.text(milestone.status, 160, yPos);
      yPos += 10;
    });

    // Summary
    const paidAmount = booking.milestones.filter((m: any) => m.status === 'completed').reduce((sum: number, m: any) => sum + m.amount, 0);
    const pendingAmount = booking.price - paidAmount;

    yPos += 10;
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
    doc.setFontSize(10);
    doc.text('Total Property Value:', 20, yPos);
    doc.text(`₹${(booking.price / 10000000).toFixed(2)} Crores`, 160, yPos);
    yPos += 7;
    doc.setTextColor(0, 150, 0);
    doc.text('Amount Paid:', 20, yPos);
    doc.text(`₹${(paidAmount / 10000000).toFixed(2)} Crores`, 160, yPos);
    yPos += 7;
    doc.setTextColor(255, 100, 0);
    doc.text('Balance Due:', 20, yPos);
    doc.text(`₹${(pendingAmount / 10000000).toFixed(2)} Crores`, 160, yPos);

    // Footer
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 280, 210, 17, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('KLOUDRAC Real Estate Pvt Ltd | Email: info@kloudrac.com | Phone: +91 22 1234 5678', 105, 290, { align: 'center' });

    doc.save(`SOA-${booking.bookingId}.pdf`);
  };

  // Function to generate and download Allotment Letter
  const downloadAllotmentLetter = (booking: any) => {
    const doc = new jsPDF();
    doc.setFont('helvetica');

    // Header
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('KLOUDRAC', 20, 25);
    doc.setFontSize(10);
    doc.text('Real Estate Solutions', 20, 32);

    // Document title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text('UNIT ALLOTMENT LETTER', 105, 55, { align: 'center' });

    // Date and reference
    doc.setFontSize(10);
    doc.text(`Ref: ${booking.bookingId}`, 20, 70);
    doc.text(`Date: ${booking.bookingDate}`, 20, 77);

    // Salutation
    doc.text('Dear ' + booking.customerName + ',', 20, 95);

    // Content
    doc.setFontSize(10);
    let yPos = 110;
    doc.text('Subject: Allotment of Unit in ' + booking.propertyName, 20, yPos);

    yPos += 15;
    doc.setFontSize(9);
    const content1 = 'We are pleased to inform you that based on your booking application and the receipt of the booking amount, we hereby allot you the following unit:';
    const splitContent1 = doc.splitTextToSize(content1, 170);
    doc.text(splitContent1, 20, yPos);

    // Unit details box
    yPos += 20;
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.5);
    doc.rect(20, yPos, 170, 45);
    doc.setFontSize(10);
    yPos += 10;
    doc.text(`Project Name: ${booking.propertyName}`, 30, yPos);
    yPos += 8;
    doc.text(`Unit Number: ${booking.unit}`, 30, yPos);
    yPos += 8;
    doc.text(`Type: ${booking.type}`, 30, yPos);
    yPos += 8;
    doc.text(`Carpet Area: ${booking.area}`, 30, yPos);
    yPos += 8;
    doc.text(`Floor: ${booking.floorNumber}`, 30, yPos);

    yPos += 20;
    const content2 = 'This allotment is subject to the terms and conditions mentioned in the Agreement to Sell. The total consideration for the said unit is ₹' + (booking.price / 10000000).toFixed(2) + ' Crores.';
    const splitContent2 = doc.splitTextToSize(content2, 170);
    doc.text(splitContent2, 20, yPos);

    yPos += 20;
    const content3 = 'The expected date of possession is ' + booking.possession + '. Please ensure timely payment of all installments as per the payment plan.';
    const splitContent3 = doc.splitTextToSize(content3, 170);
    doc.text(splitContent3, 20, yPos);

    yPos += 20;
    doc.text('Congratulations on your new home!', 20, yPos);

    yPos += 15;
    doc.text('Yours sincerely,', 20, yPos);
    yPos += 15;
    doc.setFontSize(11);
    doc.text('KLOUDRAC Real Estate Pvt Ltd', 20, yPos);
    doc.setFontSize(9);
    yPos += 7;
    doc.text('Authorized Signatory', 20, yPos);

    // Footer
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 280, 210, 17, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('KLOUDRAC Real Estate Pvt Ltd | Email: info@kloudrac.com | Phone: +91 22 1234 5678', 105, 290, { align: 'center' });

    doc.save(`Allotment-Letter-${booking.bookingId}.pdf`);
  };

  // Function to generate Agreement to Sell
  const downloadAgreement = (booking: any) => {
    const doc = new jsPDF();
    doc.setFont('helvetica');

    // Header
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('KLOUDRAC', 20, 25);
    doc.setFontSize(10);
    doc.text('Real Estate Solutions', 20, 32);

    // Document title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('AGREEMENT TO SELL', 105, 55, { align: 'center' });

    doc.setFontSize(9);
    let yPos = 70;
    doc.text('This Agreement to Sell is executed on ' + booking.bookingDate, 20, yPos);

    yPos += 15;
    doc.text('BETWEEN', 20, yPos);
    yPos += 10;
    doc.text('KLOUDRAC Real Estate Pvt Ltd, a company incorporated under the Companies Act, 1956,', 20, yPos);
    yPos += 7;
    doc.text('having its registered office at 123 Business District, Mumbai (hereinafter called the "Seller")', 20, yPos);

    yPos += 15;
    doc.text('AND', 20, yPos);
    yPos += 10;
    doc.text(`${booking.customerName}, residing at [Address]`, 20, yPos);
    yPos += 7;
    doc.text('(hereinafter called the "Purchaser")', 20, yPos);

    yPos += 15;
    doc.text('WHEREAS:', 20, yPos);
    yPos += 10;
    const clause1 = `The Seller has agreed to sell and the Purchaser has agreed to purchase Unit ${booking.unit} in ${booking.propertyName}, ${booking.location}.`;
    const splitClause1 = doc.splitTextToSize(clause1, 170);
    doc.text(splitClause1, 20, yPos);

    yPos += 15;
    doc.text('The particulars of the said unit are as follows:', 20, yPos);
    yPos += 10;
    doc.text(`- Unit Number: ${booking.unit}`, 25, yPos);
    yPos += 7;
    doc.text(`- Type: ${booking.type}`, 25, yPos);
    yPos += 7;
    doc.text(`- Carpet Area: ${booking.area}`, 25, yPos);
    yPos += 7;
    doc.text(`- Total Consideration: ₹${(booking.price / 10000000).toFixed(2)} Crores`, 25, yPos);

    yPos += 15;
    doc.text('The Purchaser shall pay the consideration as per the payment plan agreed upon.', 20, yPos);

    yPos += 10;
    doc.text('The expected date of possession is ' + booking.possession + '.', 20, yPos);

    yPos += 20;
    doc.text('For KLOUDRAC Real Estate Pvt Ltd', 20, yPos);
    doc.text('Purchaser', 140, yPos);
    yPos += 15;
    doc.text('(Authorized Signatory)', 20, yPos);
    doc.text(`(${booking.customerName})`, 140, yPos);

    // Footer
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 280, 210, 17, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('KLOUDRAC Real Estate Pvt Ltd | Email: info@kloudrac.com | Phone: +91 22 1234 5678', 105, 290, { align: 'center' });

    doc.save(`Agreement-${booking.bookingId}.pdf`);
  };

  // Documents data structure
  const getDocuments = (booking: any) => [
    {
      id: 1,
      name: 'Statement of Accounts (SOA)',
      description: 'Complete payment history and account summary',
      status: 'available',
      generatedDate: new Date().toLocaleDateString('en-IN'),
      downloadFunc: () => downloadSOA(booking)
    },
    {
      id: 2,
      name: 'Allotment Letter',
      description: 'Official unit allotment confirmation letter',
      status: 'available',
      generatedDate: booking.bookingDate,
      downloadFunc: () => downloadAllotmentLetter(booking)
    },
    {
      id: 3,
      name: 'Agreement to Sell',
      description: 'Legal agreement between buyer and seller',
      status: 'available',
      generatedDate: booking.bookingDate,
      downloadFunc: () => downloadAgreement(booking)
    },
    {
      id: 4,
      name: 'Payment Receipts',
      description: 'All payment receipts and invoices',
      status: 'available',
      generatedDate: new Date().toLocaleDateString('en-IN'),
      category: 'info',
      info: 'Available in Invoices tab'
    },
    {
      id: 5,
      name: 'Construction Updates',
      description: 'Monthly construction progress reports',
      status: booking.status === 'active' ? 'available' : 'pending',
      generatedDate: new Date().toLocaleDateString('en-IN'),
      category: 'construction'
    },
    {
      id: 6,
      name: 'Possession Letter',
      description: 'Property possession confirmation',
      status: booking.status === 'completed' ? 'available' : 'pending',
      generatedDate: booking.status === 'completed' ? booking.possession : '-',
      category: 'completion'
    },
    {
      id: 7,
      name: 'Completion Certificate',
      description: 'Building completion certification',
      status: booking.status === 'completed' ? 'available' : 'pending',
      generatedDate: booking.status === 'completed' ? booking.possession : '-',
      category: 'completion'
    },
    {
      id: 8,
      name: 'Occupancy Certificate',
      description: 'Legal occupancy permission certificate',
      status: booking.status === 'completed' ? 'available' : 'pending',
      generatedDate: booking.status === 'completed' ? booking.possession : '-',
      category: 'completion'
    }
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate('/bookings')}
            variant="outline"
            className="rounded-full border-gray-700 hover:bg-gray-800 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bookings
          </Button>
          <Badge className={`rounded-full px-6 py-2 ${booking.status === 'active'
              ? 'bg-green-500/90 text-white border-green-500'
              : 'bg-blue-500/90 text-white border-blue-500'
            }`}>
            {booking.status}
          </Badge>
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Card */}
          <Card className="flex-1 bg-gray-900/50 border-gray-800 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                {/* Left Side Content */}
                <div>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Building2 className="w-5 h-5" />
                    Complete Booking Details
                  </CardTitle>
                  <CardDescription>
                    View all information, milestones, and invoices for this booking
                  </CardDescription>
                </div>

                {/* Right Side Upload Button */}
                <Button
                  className="text-white hover:opacity-90 flex items-center gap-2"
                  style={{ backgroundColor: "#6f60ff" }}
                  onClick={() => setIsUploadModalOpen(true)}
                >
                  <UploadIcon className="w-4 h-4" />
                  Upload Document
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="overview" className="mt-4">
                <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 rounded-full p-1">
                  <TabsTrigger value="overview" className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="milestones" className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600">
                    Milestones
                  </TabsTrigger>
                  <TabsTrigger value="invoices" className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600">
                    Invoices
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600">
                    Files
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6 mt-6">
                  {/* Property Image */}
                  <div className="relative h-64 rounded-xl overflow-hidden">
                    <img
                      src={booking.image}
                      alt={booking.propertyName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-white text-2xl">{booking.propertyName}</h3>
                      <p className="text-gray-200">Unit {booking.unit} • {booking.towerName}</p>
                    </div>
                  </div>

                  {/* Booking ID & Customer Info */}
                  <Card className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Hash className="w-5 h-5" />
                        Booking ID: {booking.bookingId}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-full">
                          <User className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Customer Name</p>
                          <p className="text-white">{booking.customerName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-full">
                          <Mail className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Email</p>
                          <p className="text-white text-sm">{booking.customerEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-full">
                          <Phone className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Phone</p>
                          <p className="text-white">{booking.customerPhone}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Property Details */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                      <p className="text-gray-400 text-sm mb-1">Property Type</p>
                      <p className="text-white">{booking.type}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                      <p className="text-gray-400 text-sm mb-1">Location</p>
                      <p className="text-white">{booking.location}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                      <p className="text-gray-400 text-sm mb-1">Total Area</p>
                      <p className="text-white">{booking.area}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                      <p className="text-gray-400 text-sm mb-1">Floor</p>
                      <p className="text-white">{booking.floorNumber}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                      <p className="text-gray-400 text-sm mb-1">Facing</p>
                      <p className="text-white">{booking.facing}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                      <p className="text-gray-400 text-sm mb-1">Parking Slots</p>
                      <p className="text-white">{booking.parkingSlots}</p>
                    </div>
                  </div>

                  {/* Financial Details */}
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <IndianRupee className="w-5 h-5" />
                        Financial Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
                        <p className="text-gray-400 text-sm mb-1">Property Value</p>
                        <p className="text-white text-2xl">₹{(booking.price / 10000000).toFixed(2)} Cr</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20">
                        <p className="text-gray-400 text-sm mb-1">Amount Paid</p>
                        <p className="text-green-400 text-2xl">
                          ₹{(booking.milestones
                            .filter((m: any) => m.status === 'completed')
                            .reduce((sum: number, m: any) => sum + m.amount, 0) / 10000000).toFixed(2)} Cr
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20">
                        <p className="text-gray-400 text-sm mb-1">Balance</p>
                        <p className="text-orange-400 text-2xl">
                          ₹{((booking.price - booking.milestones
                            .filter((m: any) => m.status === 'completed')
                            .reduce((sum: number, m: any) => sum + m.amount, 0)) / 10000000).toFixed(2)} Cr
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Side - Uploaded Files */}
                    <Card className="bg-gray-900/50 border-gray-800">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white">Uploaded Files ({uploadedFiles.length})</CardTitle>
                          <Button 
                            onClick={() => setIsUploadModalOpen(true)}
                            className="bg-[#6f60ff] hover:bg-[#5a4dcc] text-white flex items-center gap-2"
                            size="sm"
                          >
                            <Plus className="w-4 h-4" />
                            Add Files
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {uploadedFiles.length > 0 ? (
                          <div className="space-y-3 max-h-96 overflow-y-auto">
                            {uploadedFiles.map((file) => (
                              <div key={file.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
                                <div className="flex items-center gap-3">
                                  <FileIcon className="w-5 h-5 text-blue-400" />
                                  <div>
                                    <p 
                                      className="text-white text-sm font-medium hover:text-blue-400 cursor-pointer transition-colors"
                                      onClick={() => handleViewFile(file)}
                                    >
                                      {file.name}
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                      {format(file.uploadDate, 'dd-MMM-yyyy')} • {formatFileSize(file.size)} • {file.type}
                                      {file.fileId && ` • ID: ${file.fileId.substring(0, 8)}...`}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-gray-400 hover:text-blue-400 hover:bg-gray-700/50"
                                    onClick={() => handleViewFile(file)}
                                    disabled={viewingFileId === file.id}
                                  >
                                    {viewingFileId === file.id ? (
                                      <Clock className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Eye className="w-4 h-4" />
                                    )}
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-gray-400 hover:text-green-400 hover:bg-gray-700/50"
                                    onClick={() => handleDownloadFile(file)}
                                    disabled={downloadingFileId === file.id}
                                  >
                                    {downloadingFileId === file.id ? (
                                      <Clock className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Download className="w-4 h-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <FileIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400">No files uploaded yet</p>
                            <Button 
                              onClick={() => setIsUploadModalOpen(true)}
                              className="mt-4 bg-[#6f60ff] hover:bg-[#5a4dcc] text-white"
                            >
                              <UploadIcon className="w-4 h-4 mr-2" />
                              Upload Files
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Right Side - Document Checklist */}
                    <Card className="bg-gray-900/50 border-gray-800">
                      <CardHeader>
                        <CardTitle className="text-white">Document Checklist</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[
                            'Pan Card', 
                            'Aadhar Card', 
                            'Income & Financial Proof', 
                            'Residential Background Verification', 
                            'Passport Size Photograph'
                          ].map((doc, index) => {
                            const status = getDocumentStatus(doc as DocumentType);
                            return (
                              <div 
                                key={index} 
                                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  {status === 'COMPLETE' ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                  ) : (
                                    <Clock className="w-5 h-5 text-yellow-500" />
                                  )}
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-400" />
                                    <span className="text-white">{doc}</span>
                                  </div>
                                </div>
                                <Badge 
                                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                                    status === 'COMPLETE' 
                                      ? 'bg-green-500/20 text-green-400' 
                                      : 'bg-yellow-500/20 text-yellow-400'
                                  }`}
                                >
                                  {status}
                                </Badge>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-400 text-sm">Booking Date</p>
                      </div>
                      <p className="text-white text-lg">{booking.bookingDate}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-400 text-sm">Expected Possession</p>
                      </div>
                      <p className="text-white text-lg">{booking.possession}</p>
                    </div>
                  </div>

                  {/* Amenities */}
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Included Amenities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {booking.amenities.map((amenity: string, index: number) => (
                          <Badge key={index} className="rounded-full bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-1">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Files Tab */}
                <TabsContent value="documents" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Side - Uploaded Files */}
                    <Card className="bg-gray-900/50 border-gray-800">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white">Uploaded Files ({uploadedFiles.length})</CardTitle>
                          <Button 
                            onClick={() => setIsUploadModalOpen(true)}
                            className="bg-[#6f60ff] hover:bg-[#5a4dcc] text-white flex items-center gap-2"
                            size="sm"
                          >
                            <Plus className="w-4 h-4" />
                            Add Files
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {uploadedFiles.length > 0 ? (
                          <div className="space-y-3 max-h-96 overflow-y-auto">
                            {uploadedFiles.map((file) => (
                              <div key={file.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
                                <div className="flex items-center gap-3">
                                  <FileIcon className="w-5 h-5 text-blue-400" />
                                  <div>
                                    <p 
                                      className="text-white text-sm font-medium hover:text-blue-400 cursor-pointer transition-colors"
                                      onClick={() => handleViewFile(file)}
                                    >
                                      {file.name}
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                      {format(file.uploadDate, 'dd-MMM-yyyy')} • {formatFileSize(file.size)} • {file.type}
                                      {file.fileId && ` • ID: ${file.fileId.substring(0, 8)}...`}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-gray-400 hover:text-blue-400 hover:bg-gray-700/50"
                                    onClick={() => handleViewFile(file)}
                                    disabled={viewingFileId === file.id}
                                  >
                                    {viewingFileId === file.id ? (
                                      <Clock className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Eye className="w-4 h-4" />
                                    )}
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-gray-400 hover:text-green-400 hover:bg-gray-700/50"
                                    onClick={() => handleDownloadFile(file)}
                                    disabled={downloadingFileId === file.id}
                                  >
                                    {downloadingFileId === file.id ? (
                                      <Clock className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Download className="w-4 h-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <FileIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400">No files uploaded yet</p>
                            <Button 
                              onClick={() => setIsUploadModalOpen(true)}
                              className="mt-4 bg-[#6f60ff] hover:bg-[#5a4dcc] text-white"
                            >
                              <UploadIcon className="w-4 h-4 mr-2" />
                              Upload Files
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Right Side - Document Checklist */}
                    <Card className="bg-gray-900/50 border-gray-800">
                      <CardHeader>
                        <CardTitle className="text-white">Document Checklist</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[
                            'Pan Card', 
                            'Aadhar Card', 
                            'Income & Financial Proof', 
                            'Residential Background Verification', 
                            'Passport Size Photograph'
                          ].map((doc, index) => {
                            const status = getDocumentStatus(doc as DocumentType);
                            return (
                              <div 
                                key={index} 
                                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  {status === 'COMPLETE' ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                  ) : (
                                    <Clock className="w-5 h-5 text-yellow-500" />
                                  )}
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-400" />
                                    <span className="text-white">{doc}</span>
                                  </div>
                                </div>
                                <Badge 
                                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                                    status === 'COMPLETE' 
                                      ? 'bg-green-500/20 text-green-400' 
                                      : 'bg-yellow-500/20 text-yellow-400'
                                  }`}
                                >
                                  {status}
                                </Badge>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Downloadable Documents Section - Full Width */}
                  <Card className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Paperclip className="w-5 h-5" />
                        Generated Documents
                      </CardTitle>
                      <CardDescription>Download and view all your property documents</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <p className="text-gray-400 text-sm mb-2">Total Documents</p>
                          <p className="text-white text-2xl">{getDocuments(booking).length}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-400 text-sm mb-2">Available</p>
                          <p className="text-green-400 text-2xl">
                            {getDocuments(booking).filter((d: any) => d.status === 'available').length}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-400 text-sm mb-2">Pending</p>
                          <p className="text-orange-400 text-2xl">
                            {getDocuments(booking).filter((d: any) => d.status === 'pending').length}
                          </p>
                        </div>
                      </div>

                      {/* Documents List */}
                      <div className="grid gap-4">
                        {getDocuments(booking).map((document: any) => (
                          <Card key={document.id} className={`border transition-all duration-300 ${document.status === 'available'
                              ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                              : 'bg-gray-800/30 border-gray-800/50'
                            }`}>
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                  <div className={`p-3 rounded-xl ${document.status === 'available'
                                      ? 'bg-blue-500/20'
                                      : 'bg-gray-700/20'
                                    }`}>
                                    {document.status === 'available' ? (
                                      <FileIcon className="w-6 h-6 text-blue-400" />
                                    ) : (
                                      <Clock className="w-6 h-6 text-gray-500" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h4 className="text-white">{document.name}</h4>
                                      <Badge className={`rounded-full ${document.status === 'available'
                                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                          : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                                        }`}>
                                        {document.status}
                                      </Badge>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-3">{document.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                      <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {document.generatedDate}
                                      </span>
                                      {document.info && (
                                        <span className="text-blue-400">{document.info}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {document.status === 'available' && document.downloadFunc && (
                                  <Button
                                    onClick={document.downloadFunc}
                                    size="sm"
                                    className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                  >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                  </Button>
                                )}
                                {document.status === 'pending' && (
                                  <Button
                                    size="sm"
                                    disabled
                                    variant="outline"
                                    className="rounded-full border-gray-700 text-gray-500 cursor-not-allowed"
                                  >
                                    Not Available
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Information Note */}
                  <Card className="bg-blue-500/5 border-blue-500/20">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg h-fit">
                          <FileText className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="text-white mb-1">Important Note</h4>
                          <p className="text-gray-400 text-sm">
                            • All documents are legally verified and digitally signed<br />
                            • Pending documents will be available upon completion of respective milestones<br />
                            • Downloaded PDFs are valid for all legal and official purposes<br />
                            • Keep your documents safe and secure for future reference
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Milestones Tab */}
                <TabsContent value="milestones" className="space-y-6 mt-6">
                  {/* Progress Summary */}
                  <Card className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Payment Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-gray-400 text-sm mb-2">Total Milestones</p>
                          <p className="text-white text-2xl">{booking.milestones.length}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-400 text-sm mb-2">Completed</p>
                          <p className="text-green-400 text-2xl">
                            {booking.milestones.filter((m: any) => m.status === 'completed').length}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-400 text-sm mb-2">Pending</p>
                          <p className="text-orange-400 text-2xl">
                            {booking.milestones.filter((m: any) => m.status !== 'completed').length}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Overall Completion</span>
                          <span className="text-white">
                            {((booking.milestones.filter((m: any) => m.status === 'completed').length /
                              booking.milestones.length) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress
                          value={(booking.milestones.filter((m: any) => m.status === 'completed').length /
                            booking.milestones.length) * 100}
                          className="h-3"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Milestones Timeline */}
                  <div className="space-y-4">
                    {booking.milestones.map((milestone: any, index: number) => (
                      <div key={milestone.id} className="relative">
                        {/* Connector Line */}
                        {index !== booking.milestones.length - 1 && (
                          <div className="absolute left-5 top-12 w-0.5 h-full bg-gray-800"></div>
                        )}

                        <Card className={`border transition-all duration-300 cursor-pointer hover:scale-[1.01] ${milestone.status === 'completed'
                            ? 'bg-green-500/5 border-green-500/20 hover:bg-green-500/10 hover:border-green-500/30'
                            : milestone.status === 'pending'
                              ? 'bg-orange-500/5 border-orange-500/20 hover:bg-orange-500/10 hover:border-orange-500/30'
                              : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70 hover:border-gray-700'
                          }`}>
                          <CardContent className="flex gap-4 p-4">
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
                              <div className="flex items-start justify-between gap-4 mb-3">
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

                              <Separator className="my-3 bg-gray-700" />

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

                              {milestone.invoiceNumber && (
                                <div className="mt-3 pt-3 border-t border-gray-700">
                                  <Button
                                    onClick={() => downloadInvoice(booking, milestone)}
                                    size="sm"
                                    className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                  >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Invoice
                                  </Button>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Invoices Tab */}
                <TabsContent value="invoices" className="space-y-6 mt-6">
                  <div className="grid gap-4">
                    {booking.milestones
                      .filter((m: any) => m.invoiceNumber)
                      .map((milestone: any) => (
                        <Card key={milestone.id} className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-500/20 rounded-xl">
                                  <FileText className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                  <h4 className="text-white flex items-center gap-2">
                                    {milestone.invoiceNumber}
                                    <Badge className={`rounded-full ${milestone.status === 'completed'
                                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                        : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                                      }`}>
                                      {milestone.status === 'completed' ? 'PAID' : 'PENDING'}
                                    </Badge>
                                  </h4>
                                  <p className="text-gray-400 text-sm mt-1">{milestone.name}</p>
                                </div>
                              </div>
                              <Button
                                onClick={() => downloadInvoice(booking, milestone)}
                                size="sm"
                                className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download PDF
                              </Button>
                            </div>

                            <Separator className="my-4 bg-gray-700" />

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-gray-400 text-xs mb-1">Invoice Date</p>
                                <p className="text-white text-sm">{milestone.invoiceDate}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs mb-1">Due Date</p>
                                <p className="text-white text-sm">{milestone.dueDate}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs mb-1">Payment Date</p>
                                <p className="text-white text-sm">{milestone.paidDate || 'Not Paid'}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs mb-1">Percentage</p>
                                <p className="text-white text-sm">{milestone.percentage}%</p>
                              </div>
                            </div>

                            <div className="bg-gray-900/50 rounded-xl p-4 space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Base Amount</span>
                                <span className="text-white">₹{milestone.amount.toLocaleString('en-IN')}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">CGST (9%)</span>
                                <span className="text-white">₹{(milestone.gstAmount / 2).toLocaleString('en-IN')}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">SGST (9%)</span>
                                <span className="text-white">₹{(milestone.gstAmount / 2).toLocaleString('en-IN')}</span>
                              </div>
                              <Separator className="my-2 bg-gray-700" />
                              <div className="flex justify-between items-center">
                                <span className="text-white">Total Amount</span>
                                <span className="text-white text-xl">₹{milestone.totalAmount.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                    {booking.milestones.filter((m: any) => m.invoiceNumber).length === 0 && (
                      <Card className="bg-gray-800/50 border-gray-700">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                          <div className="p-4 bg-gray-700/50 rounded-full mb-4">
                            <FileText className="w-8 h-8 text-gray-400" />
                          </div>
                          <h3 className="text-white text-lg mb-2">No Invoices Yet</h3>
                          <p className="text-gray-400 text-center">Invoices will appear here once milestones are reached</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Status Cards Sidebar */}
          <div className="w-full lg:w-80 flex flex-col gap-4">
            {/* Complete Status Card */}
            <Card className="bg-green-500/5 border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Complete</p>
                    <p className="text-2xl font-bold text-white">
                      {getDocuments(booking).filter((d: any) => d.status === 'available').length}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-green-500/20">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Status Card */}
            <Card className="bg-yellow-500/5 border-yellow-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Pending</p>
                    <p className="text-2xl font-bold text-white">
                      {getDocuments(booking).filter((d: any) => d.status === 'pending').length}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-yellow-500/20">
                    <Clock className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleFileUpload}
      />
    </>
  );
}

