import { Chronology, FileType } from '@/@types/chronology';
import ConfirmationModal from '@/components/custom-components/confirmation-modal';
import AppLayout from '@/components/layout/AppLayout';
import { GenericTable } from '@/components/tables/generic-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import {
  useDeleteChronologyMutation,
  useGetChronologyFilesQuery,
  useLazyExportExelFileQuery,
  useUploadChronologyMutation,
} from '@/redux/services/chronologyApi';
import { convertDate, downloadFile, initialPage, toastComponent } from '@/utils/common-functions';
import { Clock, FileText, Loader2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { columns } from './columns';

export default function Chronologies() {
  const { user, token } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [vlerePoliuretan, setVlerePoliuretan] = useState('0');
  const [pagination, setPagination] = useState(initialPage);

  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set());
  const [deletingFiles, setDeletingFiles] = useState<Set<number>>(new Set());

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    fileId: null as number | null,
    fileName: '',
  });

  const { data: filesData, isFetching: isLoadingFiles, isError, refetch } = useGetChronologyFilesQuery(undefined);

  const [downloadChronology, { isFetching }] = useLazyExportExelFileQuery();
  const [deleteChronology, { isLoading: isDeletingAny }] = useDeleteChronologyMutation();

  const downloadChronologyById = async (fileId: number, type: FileType, vlereValue?: string) => {
    const loadingKey = `${fileId}-${type}`;
    setDownloadingFiles((prev) => new Set(prev).add(loadingKey));

    try {
      const res = await downloadChronology({ fileId, type, vlereValue }).unwrap();
      const date = new Date();
      downloadFile(res, `chronologies_${type === 'EX' ? 'EXPORT' : 'IMPORT'}_${convertDate(date, 'yyyy-MM-dd')}`);

      toastComponent(`File ${type === 'EX' ? 'exported' : 'imported'} successfully`);
    } catch (error: any) {
      toastComponent(error?.data?.message || 'Something went wrong!', 'error');
    } finally {
      setDownloadingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(loadingKey);
        return newSet;
      });
    }
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
        toastComponent('Please select an Excel (.xls, .xlsx) or CSV file', 'error');
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toastComponent('Please select a file to upload', 'error');
      return;
    }

    try {
      await uploadFile(selectedFile).unwrap();
      toastComponent(`${selectedFile.name} has been processed`, 'error');

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      toastComponent(error?.data?.message || 'An error occurred during upload', 'error');
    }
  };

  const handleDownload = async (fileId: number, type: FileType) => {
    if (!token) return;

    try {
      const vlereValue = type === 'EX' ? vlerePoliuretan : undefined;
      await downloadChronologyById(fileId, type, vlereValue);
    } catch (error) {
      toastComponent('An error occurred during download', 'error');
    }
  };

  const handleDeleteClick = (file: Chronology) => {
    setDeleteModal({
      open: true,
      fileId: file.id,
      fileName: file.originalName,
    });
  };

  const handleDeleteConfirm = async (fileId: number) => {
    if (!fileId) return;

    setDeletingFiles((prev) => new Set(prev).add(fileId));

    try {
      await deleteChronology(fileId).unwrap();

      toastComponent('The chronology file has been removed', 'error');
      setDeleteModal({ open: false, fileId: null, fileName: '' });
    } catch (error: any) {
      toastComponent(error?.data?.message || 'An error occurred during deletion', 'error');
    } finally {
      setDeletingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  const files = filesData?.data || [];
  const needsFrontendPagination = files.length > 10;
  const totalPages = Math.ceil(files.length / pagination.size);

  const paginatedData = needsFrontendPagination
    ? files.slice(pagination.page * pagination.size, (pagination.page + 1) * pagination.size)
    : files;

  const emptyStateContent = (
    <div className="py-8 text-center">
      <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
      <p className="text-muted-foreground">No files uploaded yet</p>
      <p className="text-sm text-muted-foreground">Upload your first chronology file to get started</p>
    </div>
  );

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
            <GenericTable<Chronology>
              data={paginatedData}
              columns={columns({
                downloadingFiles,
                deletingFiles,
                handleDownload,
                handleDelete: handleDeleteClick,
              })}
              pagination={needsFrontendPagination ? pagination : undefined}
              setPagination={needsFrontendPagination ? setPagination : undefined}
              totalPages={needsFrontendPagination ? totalPages : undefined}
              isFetching={isLoadingFiles}
              isError={isError}
              onRetry={refetch}
              noRowsChildren={emptyStateContent}
              showItemsPerPage={needsFrontendPagination}
              showJumpToEnds={needsFrontendPagination}
            />
          </CardContent>
        </Card>
      </div>

      <ConfirmationModal
        id={deleteModal.fileId!}
        title="Delete Chronology File"
        description={`Are you sure you want to delete "${deleteModal.fileName}"? This action cannot be undone.`}
        cancel="Cancel"
        submit="Delete"
        handleSubmit={handleDeleteConfirm}
        openModal={deleteModal.open}
        setOpenModal={(open) => setDeleteModal((prev) => ({ ...prev, open }))}
        isLoading={deletingFiles.has(deleteModal.fileId!)}
      />
    </AppLayout>
  );
}
