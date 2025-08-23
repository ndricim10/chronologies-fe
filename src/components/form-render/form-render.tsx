import { FormRenderProps } from '@/@types/form-render';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import FormFieldRender from './form-field';

const FormRender = <T extends string>(props: FormRenderProps<T>) => {
  const { form, formFields, formFieldWrapperStyles, customFieldComponents } = props;

  return (
    <div
      className={cn(
        'flex flex-col gap-4 overflow-y-auto overflow-x-hidden pr-2 dark:hover:bg-slate-800',
        formFieldWrapperStyles
      )}
    >
      {formFields.map(({ showItem = true, ...formField }, index) => {
        return (
          <div className={cn(formField.gridcolumnclass, showItem ? '' : 'hidden')}>
            <FormField
              key={index}
              control={form.control}
              name={formField.name ?? ''}
              render={({ field }) => {
                const formFieldConfig = { ...formField, ...field };
                const removeValue = () => {
                  form.resetField(formField.name ?? '');
                  form.setValue(formField.name ?? '', '' as any);
                };

                return (
                  <FormItem className={formField.gridcolumnclass}>
                    {formField.showlabel !== false && <FormLabel className="pl-1">{formField.label}</FormLabel>}
                    <FormControl>
                      <FormFieldRender
                        fieldProps={{ ...formFieldConfig, removeValue }}
                        customFieldComponents={customFieldComponents}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default FormRender;
