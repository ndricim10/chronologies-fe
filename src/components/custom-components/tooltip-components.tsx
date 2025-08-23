import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ReactNode, useState } from 'react';

interface TooltipProps {
  trigerText: string;
  children: ReactNode;
  className?: string;
  len?: number;
}

const TooltipComponent = ({ trigerText, children, className, len = 5 }: TooltipProps) => {
  const [showText, setShowText] = useState(false);
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          onMouseEnter={() => setShowText(true)}
          onMouseLeave={() => setShowText(false)}
          className={className}
        >
          {children}
        </TooltipTrigger>
        {len && showText && trigerText?.length > len && <TooltipContent>{trigerText}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipComponent;
