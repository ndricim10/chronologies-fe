import { useMemo } from 'react';
import { XAxisProps, YAxisProps } from 'recharts';

/**
 * @param dataKey The key of data displayed in the axis.
 * @param type The type of axis.
 * @param tickLine If set false, no axis tick lines will be drawn. If set a object, the option is the configuration of tick lines. DEFAULT: true;
 * @returns An object representing the settings for an X-axis.
 */
export const useXAxisTopSettings = (
  layout: 'vertical' | 'horizontal' = 'horizontal',
  dataKey = 'name',
  type: 'category' | 'number' = 'category',
  tickLine?: boolean
): XAxisProps | YAxisProps => {
  const xAxis: XAxisProps = useMemo(() => {
    return {
      type,
      dataKey,
      baseFrequency: 5,
      axisLine: false,
      tickLine,
      padding: { left: 20, right: 20 },
      height: 35,
      label: {
        position: layout === 'horizontal' ? 'top' : 'left',
        fontSize: 10,
      },
    };
  }, [dataKey, type, tickLine]);
  return xAxis;
};
