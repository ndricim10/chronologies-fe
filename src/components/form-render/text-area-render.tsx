import { FieldProps } from '@/@types/form-render';
import { Textarea } from '@/components/ui/textarea';

const TextAreaRender = ({ placeholder, disabled, isPlaceholder = true, ...field }: FieldProps) => {
  return (
    <Textarea
      placeholder={isPlaceholder ? `Vendosni ${placeholder}` : placeholder}
      onChange={field.onChange}
      value={field.value}
      disabled={disabled}
    />
  );
};

export default TextAreaRender;
