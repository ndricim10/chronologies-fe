import { CommonColumns } from '@/@types/common';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';

interface CommonActionProps<T> extends CommonColumns<T> {
  original: T;
  className?: string;
  isDeleting?: boolean;
}

const CommonActions = <T,>({
  handleDelete,
  handleEdit,
  original,
  className = 'flex items-center gap-2',
  isDeleting,
}: CommonActionProps<T>) => {
  return (
    <div className={className}>
      {handleEdit && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEdit(original)}
          className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-600"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      )}
      {handleDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDelete(original)}
          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-600"
          isLoading={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default CommonActions;
