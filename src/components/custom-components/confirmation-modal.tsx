import { ConfirmationModalProps } from '@/@types/custom-components';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Check, CornerDownLeft } from 'lucide-react';

const ConfirmationModal = ({
  id,
  title,
  description,
  cancel,
  submit,
  handleSubmit,
  openModal,
  setOpenModal,
  isLoading,
}: ConfirmationModalProps) => {
  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent className='dark:text-white" dark:bg-slate-700'>
        <DialogHeader>
          <DialogTitle className='dark:text-white" text-red-700 dark:bg-slate-700 dark:text-secondary'>
            {title}
          </DialogTitle>
          <DialogDescription className='dark:text-white" dark:bg-slate-700 dark:text-white'>
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-between gap-1 sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            className="flex items-center gap-2 bg-black text-white hover:bg-black sm:min-w-[100px]"
            onClick={() => setOpenModal(false)}
          >
            <CornerDownLeft size={18} />
            {cancel ?? 'Kthehu'}
          </Button>
          <Button
            isLoading={isLoading}
            type="button"
            variant="secondary"
            className="flex items-center gap-2 bg-primary text-white hover:bg-primary dark:bg-primary dark:text-white dark:hover:bg-primary sm:min-w-[100px]"
            onClick={() => handleSubmit(id)}
          >
            <Check size={18} className="text-white" />
            {submit ?? 'Yes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
