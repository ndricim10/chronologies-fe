import { ModalProps } from '@/@types/common';
import { CustomModalHeader } from '@/components/dialogs/dialog-header';
import FormFooter from '@/components/dialogs/form-footer';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { FileIcon, X } from 'lucide-react';
import type React from 'react';
import { ReactNode } from 'react';

interface GenericModalProps<T, U> extends ModalProps<T> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  onSubmit?: (data: U) => void;
  isLoading?: boolean;
  saveLabel?: string;
  cancelLabel?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '6xl' | '8xl';
  children: ReactNode;
  showFooter?: boolean;
  showCustomAction?: boolean;
  customActionHandler?: () => void;
  onClose?: () => void;
  customActionIcon?: ReactNode;
  customActionLabel?: string;
}

export const GenericModal = <T extends object, U>({
  openModal,
  setOpenModal,
  form,
  icon,
  title,
  description,
  onSubmit,
  isLoading = false,
  saveLabel = 'Ruaj',
  cancelLabel = 'Anulo',
  setDefaultValues,
  maxWidth = '6xl',
  children,
  showFooter = true,
  showCustomAction,
  customActionHandler,
  customActionLabel = 'Documentet',
  customActionIcon = <FileIcon className="h-6 w-6 text-indigo-600" />,
  onClose,
}: GenericModalProps<T, U>) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    '8xl': 'max-w-8xl',
  };

  const handleClose = () => {
    setOpenModal(false);
    form?.reset();
    setDefaultValues?.(undefined);
    onClose?.();
  };

  return (
    <Dialog
      open={openModal}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        hideDefaultClose={true}
        className={cn(
          'flex max-h-[95vh] flex-col overflow-hidden border-0 bg-white p-0 shadow-2xl dark:bg-gray-800 dark:shadow-gray-900/50',
          'duration-300 animate-in fade-in-0 zoom-in-95',
          maxWidthClasses[maxWidth]
        )}
        onWheel={() => {}}
      >
        <div className="absolute right-2 top-4 z-50 flex items-center gap-2">
          {showCustomAction && customActionHandler && (
            <button
              onClick={customActionHandler}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 dark:border-gray-600',
                'bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 shadow-lg backdrop-blur-sm dark:from-gray-700/20 dark:via-gray-700/20 dark:to-gray-700/20 dark:shadow-gray-900/50',
                'transition-all duration-300 hover:scale-110 hover:border-gray-300 hover:shadow-xl',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                'group'
              )}
              aria-label={customActionLabel}
            >
              {customActionIcon}
            </button>
          )}

          <button
            onClick={handleClose}
            disabled={isLoading}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 dark:border-gray-600',
              'bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 shadow-lg backdrop-blur-sm dark:from-gray-700/20 dark:via-gray-700/20 dark:to-gray-700/20 dark:shadow-gray-900/50',
              'transition-all duration-300 hover:scale-110 hover:border-gray-300 hover:shadow-xl',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              'group disabled:cursor-not-allowed disabled:opacity-50'
            )}
            aria-label="Close modal"
          >
            <X
              className={cn(
                'h-8 w-8 text-gray-600 transition-all duration-300 dark:text-gray-300',
                'group-hover:rotate-90 group-hover:text-gray-900 dark:group-hover:text-white'
              )}
            />
          </button>
        </div>

        <div className="flex-shrink-0">
          <CustomModalHeader icon={icon} title={title} description={description} />
        </div>

        <div className="flex-1">{children}</div>

        {showFooter && (
          <div className="flex-shrink-0">
            <FormFooter
              onCancel={handleClose}
              onClick={() => {
                if (onSubmit) {
                  form?.handleSubmit?.(onSubmit)();
                }
              }}
              isLoading={isLoading}
              save={saveLabel}
              cancel={cancelLabel}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
