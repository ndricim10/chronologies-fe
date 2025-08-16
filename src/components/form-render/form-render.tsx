import { FormRenderProps } from '@/@types/form-render';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import FormFieldRender from './form-field';

const FormRender = <T extends string, >(props: FormRenderProps<T>) => {
  const { form, formFields, formFieldWrapperStyles, isClassName = true, customFieldComponents } = props;

  const className = `flex flex-col pr-2 ${isClassName && 'max-h-[600px] h-full'} gap-4 overflow-y-auto overflow-x-hidden dark:hover:bg-slate-800`;

  return (
    <div className={cn(className, formFieldWrapperStyles)}>
      {formFields.map(({ showItem = true, ...formField }, index) => {
        return (
          <div className={showItem ? '' : 'hidden'}>
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
                  <FormItem className={`${formField.gridcolumnclass}`}>
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
