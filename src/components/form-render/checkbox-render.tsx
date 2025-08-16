import { FieldProps } from '@/@types/form-render';
import { Checkbox } from '@/components/ui/checkbox';

const CheckboxRender = ({
  checkBoxId,
  checkBoxLabel,
  value,
  onChange,
  disabled,
  defaultChecked = false,
  onCheckedChange,
}: FieldProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={checkBoxId}
        checked={value}
        defaultValue={value}
        onCheckedChange={(value) => {
          onChange?.(value);
          onCheckedChange?.(value as boolean);
        }}
        disabled={disabled}
        defaultChecked={defaultChecked}
      />
      <label
        htmlFor={checkBoxId}
        className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {checkBoxLabel}
      </label>
    </div>
  );
};

export default CheckboxRender;
