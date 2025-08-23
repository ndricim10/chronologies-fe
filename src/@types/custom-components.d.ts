import { ReactNode } from 'react';
import { OpenModalProps } from './common';

export interface ConfirmationModalProps extends OpenModalProps {
  id: number;
  title: string;
  description: string;
  cancel?: string;
  submit?: string;
  handleSubmit: (id: number) => void;
  isLoading?: boolean;
}

export interface CustomDrawerProps {
  title: ReactNode;
  description?: string;
  children: ReactNode;
  triggerButton: ReactNode;
  submitButtonLabel?: string;
  cancelButtonLabel?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
  showFooter?: boolean;
  className?: string;
  open?: boolean;
  setOpen?: (value: boolean) => void;
}

export interface FormFooterProps {
  onCancel?: () => void;
  disabled?: boolean;
  save?: string;
  cancel?: string;
  onClick?: () => void;
  className?: string;
  isSave?: boolean;
  submitClassName?: string;
  isLoading?: boolean;
}
