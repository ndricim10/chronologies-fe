import { FieldProps } from '@/@types/form-render';
import { Textarea } from '@/components/ui/textarea';

const TextAreaRender = ({ placeholder, disabled, ...field }: FieldProps) => {
  return <Textarea placeholder={placeholder} onChange={field.onChange} value={field.value} disabled={disabled} />;
};

export default TextAreaRender;
