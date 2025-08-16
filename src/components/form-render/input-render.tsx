import { FieldProps } from '@/@types/form-render';
import { Input } from '@/components/ui/input';

const InputRender = ({
  type,
  value,
  onChange,
  placeholder,
  selectValue,
  onInputChange,
  isPlaceholder = true,
  ...field
}: FieldProps) => {
  let inputType = '';
  switch (type) {
    case 'inputPassword':
      inputType = 'password';
      break;
    case 'inputEmail':
      inputType = 'email';
      break;
    case 'inputNumber':
      inputType = 'number';
      break;
    default:
      inputType = 'text';
      break;
  }

  return (
    <Input
      autoFocus={false}
      defaultValue={selectValue ?? value}
      value={selectValue ?? value}
      autoComplete="off"
      placeholder={isPlaceholder ? `Vendosni ${placeholder}` : placeholder}
      {...field}
      type={inputType}
      onChange={(value) => {
        onChange && onChange(value);
        onInputChange && onInputChange(value.target.value);
      }}
    />
  );
};

export default InputRender;
