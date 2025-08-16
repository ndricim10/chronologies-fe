import { CustomFieldComponents, FieldProps } from '@/@types/form-render';
import CheckboxRender from './checkbox-render';
import DatePickerRender from './date-picker-render';
import InputRender from './input-render';
import PopoverRender from './popover-render';
import TextAreaRender from './text-area-render';
import MultiSelectRender from './multiselect-render';

interface FormFieldRenderProps {
  fieldProps: FieldProps;
  customFieldComponents?: CustomFieldComponents;
}

const FormFieldRender = ({ fieldProps, customFieldComponents }: FormFieldRenderProps) => {
  const { type = 'inputText' } = fieldProps;

  switch (type) {
    case 'select':
      return <PopoverRender {...fieldProps} />;
    case 'multiselect':
      return (
        <MultiSelectRender
          {...fieldProps}
          multiselectValue={fieldProps.value || []}
          setValue={(newValues) => {
            fieldProps.onChange?.(newValues);
          }}
        />
      );
    case 'textArea':
      return <TextAreaRender {...fieldProps} />;
    case 'datePicker':
      return <DatePickerRender {...fieldProps} />;
    case 'inputText':
    case 'inputEmail':
    case 'inputNumber':
    case 'inputPassword':
      return <InputRender {...fieldProps} />;
    case 'checkbox':
      return <CheckboxRender {...fieldProps} />;
    default:
      const CustomField = customFieldComponents?.[type];
      return CustomField ? <CustomField {...{ ...fieldProps, ...fieldProps?.customProps }} /> : <div></div>;
  }
};

export default FormFieldRender;
