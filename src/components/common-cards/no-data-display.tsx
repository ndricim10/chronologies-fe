import { cn } from '@/lib/utils';
import { Card } from '../ui/card';

interface NoDataProps {
  title?: string;
  className?: string;
}

export const NoDataToDisplay = ({ title = 'No data to display', className }: NoDataProps) => {
  return (
    <Card className={cn('h-full min-h-80 w-full font-semibold', className)}>
      <div className="flex h-full flex-col items-center justify-center">{title}</div>
    </Card>
  );
};

export default NoDataToDisplay;
