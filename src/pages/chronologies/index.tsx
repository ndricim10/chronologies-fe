import { Chronology, FileType } from '@/@types/chronology';
import ConfirmationModal from '@/components/custom-components/confirmation-modal';
import AppLayout from '@/components/layout/AppLayout';
import { GenericTable } from '@/components/tables/generic-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  useDeleteChronologyMutation,
  useGetChronologyFilesQuery,
  useLazyExportExelFileQuery,
  useUploadChronologyMutation,
} from '@/redux/services/chronologyApi';
import { convertDate, downloadFile, initialPage } from '@/utils/common-functions';
import { Clock, FileText, Loader2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { columns } from './columns';
import { useToast } from '@/hooks/use-toast';

export default function Chronologies() {
  const { toast } = useToast();
  const initModal = { open: false, fileId: undefined, fileName: '' };
  const [downloadChronology] = useLazyExportExelFileQuery();
  const [deleteChronology, { isLoading: isDeleting }] = useDeleteChronologyMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadChronologyMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pagination, setPagination] = useState(initialPage);

  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set());
  const [deletingFiles, setDeletingFiles] = useState<Set<number>>(new Set());

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    fileId?: number;
    fileName: string;
  }>(initModal);

  const { data: filesData, isFetching: isLoadingFiles, isError, refetch } = useGetChronologyFilesQuery(undefined);

  const handleDownload = (fileId: number, type: FileType) => {
    const loadingKey = `${fileId}-${type}`;
    setDownloadingFiles((prev) => new Set(prev).add(loadingKey));

    downloadChronology({ fileId, type })
      .unwrap()
      .then((res) => {
        const date = new Date();
        downloadFile(res, `chronologies_${type === 'EX' ? 'EXPORT' : 'IMPORT'}_${convertDate(date, 'yyyy-MM-dd')}`);
        toast({
          title: 'File exported',
          description: `File ${type === 'EX' ? 'exported' : 'imported'} successfully`,
          type: 'background',
        });
      })
      .catch(() => {
        toast({
          title: 'Failed',
          description: 'Something went wrong!',
          type: 'background',
        });
      })
      .finally(() => {
        setDownloadingFiles((prev) => {
          const newSet = new Set(prev);
          newSet.delete(loadingKey);
          return newSet;
        });
      });
  };

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
          title: 'Warning',
          description: 'Please select an Excel (.xls, .xlsx) or CSV file',
          type: 'background',
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'Warning',
        description: 'Please select a file to upload',
        type: 'background',
      });
      return;
    }

    uploadFile(selectedFile)
      .unwrap()
      .then(() => {
        toast({
          title: 'Success!',
          description: `${selectedFile.name} has been processed`,
          type: 'background',
        });

        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      })
      .catch((error) => {
        toast({
          title: 'Failed',
          description: error?.data?.message || 'An error occurred during upload',
          type: 'background',
        });
      });
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

    deleteChronology(fileId)
      .unwrap()
      .then(() => {
        toast({
          title: 'Failed',
          description: 'The chronology file has been removed',
          type: 'background',
        });
        setDeleteModal(initModal);
      })
      .catch((error) => {
        toast({
          title: 'Failed',
          description: error?.data?.message || 'An error occurred during deletion',
          type: 'background',
        });
      })
      .finally(() => {
        setDeletingFiles((prev) => {
          const newSet = new Set(prev);
          newSet.delete(fileId);
          return newSet;
        });
      });
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
                className="flex-1 cursor-pointer text-black dark:text-white"
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
        isLoading={deletingFiles.has(deleteModal.fileId!) && isDeleting}
      />
    </AppLayout>
  );
}
