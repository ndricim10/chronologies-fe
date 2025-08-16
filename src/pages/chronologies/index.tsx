import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import {
  useGetChronologyFilesQuery,
  useLazyExportExelFileQuery,
  useUploadChronologyMutation,
} from '@/redux/services/chronologyApi';
import { downloadFile, toastComponent } from '@/utils/common-functions';
import { Clock, Download, FileText, Loader2, Upload, User } from 'lucide-react';
import { useRef, useState } from 'react';

export default function Chronologies() {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [vlerePoliuretan, setVlerePoliuretan] = useState('0');

  const { data: filesData, isLoading: isLoadingFiles } = useGetChronologyFilesQuery({});

  const [downloadChronoly, { isFetching }] = useLazyExportExelFileQuery();

  const downloadChronologyById = (fileId: number, mode: string, vlereValue?: string) => {
    downloadChronoly({ fileId, mode, vlereValue })
      .unwrap()
      .then((res) => {
        downloadFile(res, 'Chronology_');
      })
      .catch((error) => {
        toastComponent(error?.data?.message || 'Something went wrong!', 'error');
      });
  };

  const [uploadFile, { isLoading: isUploading }] = useUploadChronologyMutation();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
      ];

      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(xls|xlsx|csv)$/i)) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an Excel (.xls, .xlsx) or CSV file',
          variant: 'destructive',
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to upload',
        variant: 'destructive',
      });
      return;
    }

    try {
      await uploadFile(selectedFile).unwrap();
      toast({
        title: 'File uploaded successfully',
        description: `${selectedFile.name} has been processed`,
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error?.data?.message || 'An error occurred during upload',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = async (fileId: number, mode: 'IM' | 'EX') => {
    if (!token) return;

    try {
      const vlereValue = mode === 'EX' ? vlerePoliuretan : undefined;

      downloadChronologyById(fileId, mode, vlereValue);

      toast({
        title: 'Download started',
        description: `Downloading ${mode.toLowerCase()} file...`,
      });
    } catch (error) {
      toast({
        title: 'Download failed',
        description: 'An error occurred during download',
        variant: 'destructive',
      });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold">
            <Clock className="h-8 w-8 text-primary" />
            Chronologies
          </h1>
          <p className="mt-2 text-muted-foreground">Upload and manage chronology files for data processing</p>
        </div>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload New File
            </CardTitle>
            <CardDescription>Upload Excel (.xls, .xlsx) or CSV files for chronology processing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".xls,.xlsx,.csv"
                onChange={handleFileSelect}
                className="flex-1"
              />
              <Button onClick={handleUpload} disabled={!selectedFile || isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </div>

            {selectedFile && (
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm text-muted-foreground">
                  Selected: <span className="font-medium">{selectedFile.name}</span> (
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {user?.role === 'ADMIN' && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Export Configuration</CardTitle>
              <CardDescription>Configure the Vlere Poliuretan value for export operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <label htmlFor="vlere" className="min-w-0 text-sm font-medium">
                  Vlere Poliuretan:
                </label>
                <Input
                  id="vlere"
                  type="number"
                  value={vlerePoliuretan}
                  onChange={(e) => setVlerePoliuretan(e.target.value)}
                  className="w-32"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {user?.role === 'FINANCE' && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Export Configuration</CardTitle>
              <CardDescription>Current Vlere Poliuretan value (admin controlled)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Vlere Poliuretan:</label>
                <Input type="number" value={vlerePoliuretan} disabled className="w-32" />
                <p className="text-xs text-muted-foreground">Only administrators can modify this value</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Uploaded Files
            </CardTitle>
            <CardDescription>View and download processed chronology files</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingFiles ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading files...</span>
              </div>
            ) : filesData?.data && filesData.data.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filesData.data.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {file.originalName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {file.uploadedBy.name} {file.uploadedBy.surname}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(file.createdAt).toLocaleDateString()} {new Date(file.createdAt).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            isLoading={isFetching}
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(file.id, 'IM')}
                          >
                            <Download className="mr-1 h-3 w-3" />
                            Import
                          </Button>
                          <Button
                            isLoading={isFetching}
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(file.id, 'EX')}
                          >
                            <Download className="mr-1 h-3 w-3" />
                            Export
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-8 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">No files uploaded yet</p>
                <p className="text-sm text-muted-foreground">Upload your first chronology file to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
