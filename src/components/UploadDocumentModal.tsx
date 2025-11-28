import { useState, useRef, useCallback } from 'react';
import { X, Upload as UploadIcon, File as FileIcon, CheckCircle2, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export type DocumentType =
  | 'Pan Card'
  | 'Aadhar Card'
  | 'Income & Financial Proof'
  | 'Residential Background Verification'
  | 'Passport Size Photograph';

export interface UploadedFile {
  id: string;
  name: string;
  type: DocumentType;
  size: number;
  uploadDate: Date;
  url?: string;
  fileId?: string;
}

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, documentType: DocumentType) => Promise<UploadedFile>;
}


export function UploadDocumentModal({ isOpen, onClose, onUpload }: UploadDocumentModalProps) {
  const [selectedDocument, setSelectedDocument] = useState<DocumentType>('Pan Card');
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentTypes: DocumentType[] = [
    'Pan Card',
    'Aadhar Card',
    'Income & Financial Proof',
    'Residential Background Verification',
    'Passport Size Photograph'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    try {
      // Upload each file and collect the results
      const uploadPromises = files.map(file => onUpload(file, selectedDocument));
      await Promise.all(uploadPromises);
      
      // Reset and close on successful upload
      setFiles([]);
      onClose();
    } catch (error) {
      console.error('Error uploading files:', error);
      // Handle error (you might want to show an error message to the user)
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="lg:max-w-[500px] bg-gray-900 border-gray-800">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-white">Upload Documents</DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <DialogDescription className="text-gray-400">
            Upload your documents for verification
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Document Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="document-type" className="text-white">
              Select Document Type
            </Label>
            <Select
              value={selectedDocument}
              onValueChange={(value: DocumentType) => setSelectedDocument(value)}
            >
              <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Choose Document Type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {documentTypes.map((type) => (
                  <SelectItem
                    key={type}
                    value={type}
                    className="hover:bg-gray-700 cursor-pointer"
                  >
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Upload Area */}
          <div className="space-y-2">
            <Label className="text-white">
              Upload {selectedDocument}
            </Label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileInput}
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <UploadIcon className="w-8 h-8 text-gray-400" />
                <p className="text-sm text-gray-300">
                  <span className="text-blue-400 font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PDF, PNG, JPG, JPEG (max. 10MB)
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg"
                multiple
              />
            </div>
          </div>

          {/* Selected Files Preview */}
          {files.length > 0 && (
            <div className="space-y-2">
              <Label className="text-white">Files to upload</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-800/50 p-2 rounded"
                  >
                    <div className="flex items-center space-x-2">
                      <FileIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300 truncate max-w-[200px]">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Button */}
          <div className="pt-2">
            <Button
              className="w-full"
              onClick={handleUpload}
              disabled={files.length === 0}
              style={{ backgroundColor: "#6f60ff", color: "#fff", cursor: "pointer" }}
            >
{isUploading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                `Upload ${files.length > 0 ? `(${files.length})` : ''}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
