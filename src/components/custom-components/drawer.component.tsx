import { CustomDrawerProps } from '@/@types/custom-components';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { ChevronLeftIcon } from 'lucide-react';
import { useMemo } from 'react';

export function CustomDrawer({
  title,
  description = '',
  children,
  triggerButton,
  cancelButtonLabel = 'Mbyll',
  submitButtonLabel = 'Ruaj',
  onSubmit,
  onCancel,
  showFooter = true,
  className,
  open,
  setOpen,
}: CustomDrawerProps) {
  const submitBtn = useMemo(() => {
    return (
      <Button className="bg-primary focus:bg-primary w-full" onClick={() => onSubmit?.()}>
        {submitButtonLabel}
      </Button>
    );
  }, [submitButtonLabel, onSubmit]);
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent>
        <div className={cn(`mx-auto w-full max-w-sm`, className)}>
          <DrawerHeader>
            <DrawerTitle onClick={onCancel}>
              <DrawerClose>
                <ChevronLeftIcon className="mr-2 h-5 w-5" />
              </DrawerClose>
              {title}
            </DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          {children}
          {showFooter && (
            <DrawerFooter>
              <div className="flex items-center gap-1">
                <DrawerClose asChild>
                  <Button variant="outline" className="w-full bg-black text-white" onClick={onCancel}>
                    {cancelButtonLabel}
                  </Button>
                </DrawerClose>
                {onSubmit ? submitBtn : <DrawerClose asChild>{submitBtn}</DrawerClose>}
              </div>
            </DrawerFooter>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
