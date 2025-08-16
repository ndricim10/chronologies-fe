import { Chronology, FileType } from '@/@types/chronology';
import { CommonColumns } from '@/@types/common';
import CommonActions from '@/components/custom-components/common-actions';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { Download, FileText, Loader2, User } from 'lucide-react';

interface ChronologyColumns extends CommonColumns<Chronology> {
  handleDownload: (id: number, type: FileType) => void;
  downloadingFiles: Set<string>;
  deletingFiles: Set<number>;
}

export const columns = ({
  handleDownload,
  handleDelete,
  downloadingFiles,
  deletingFiles,
}: ChronologyColumns): ColumnDef<Chronology>[] => {
  return [
    {
      accessorKey: 'originalName',
      header: 'File Name',
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{getValue() as string}</span>
        </div>
      ),
    },
    {
      accessorKey: 'uploadedBy',
      header: 'Uploaded By',
      cell: ({ getValue }) => {
        const uploadedBy = getValue() as { name: string; surname: string };
        return (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            {uploadedBy.name} {uploadedBy.surname}
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Upload Date',
      cell: ({ getValue }) => {
        const date = new Date(getValue() as string);
        return (
          <div>
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </div>
        );
      },
    },
    {
      id: 'download-actions',
      header: 'Download',
      cell: ({ row: { original } }) => {
        const isDownloadingImport = downloadingFiles.has(`${original.id}-IM`);
        const isDownloadingExport = downloadingFiles.has(`${original.id}-EX`);

        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDownload(original.id, 'IM')}
              disabled={isDownloadingImport || isDownloadingExport}
            >
              {isDownloadingImport ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <Download className="mr-1 h-3 w-3" />
              )}
              Import
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDownload(original.id, 'EX')}
              disabled={isDownloadingImport || isDownloadingExport}
            >
              {isDownloadingExport ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <Download className="mr-1 h-3 w-3" />
              )}
              Export
            </Button>
            <CommonActions
              original={original}
              handleDelete={handleDelete}
              isDeleting={deletingFiles.has(original.id)}
            />
          </div>
        );
      },
    },
  ];
};
