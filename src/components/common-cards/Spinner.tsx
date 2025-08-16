import { Loader } from 'lucide-react';

interface SpinnerProps {
  title?: string;
  className?: string;
}

const Spinner = ({ title = 'Loading...', className = '' }: SpinnerProps) => {
  return (
    <div className={`flex min-h-[40vh] flex-col items-center justify-center ${className}`}>
      <Loader className="animate-spin" />
      <div>{title}</div>
    </div>
  );
};

export default Spinner;
