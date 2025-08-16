import { CustomPayload, CustomToolTipProps } from '@/@types/charts';
import GeneralToolTip from './general-tooltip';

const LineChartCustomToolTip = ({ name, payload, color, tooltipData }: CustomToolTipProps) => {
  if (payload && payload.length > 0 && tooltipData) {
    const matchingPayload: CustomPayload | undefined = payload.find((item) => item.name === name);
    const defaultPayload = payload[0];
    const status = matchingPayload?.payload?.name;
    const lineValue = matchingPayload?.payload && matchingPayload.payload[name || ''];
    const toolTipPayload = `${lineValue ? name : defaultPayload.payload?.value}: ${
      lineValue ? lineValue : defaultPayload.value
    }`;
    const colorValue = color ?? defaultPayload.fill;
    const tooltipName = payload.length > 1 ? status : defaultPayload.name;
    return <GeneralToolTip color={colorValue} name={tooltipName} field={toolTipPayload} />;
  }
  return null;
};

export default LineChartCustomToolTip;
