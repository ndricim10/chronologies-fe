import { CustomToolTipProps } from '@/@types/charts';
import GeneralToolTip from './general-tooltip';

const PieChartTooltip = ({ tooltipPayload }: CustomToolTipProps) => {
  const hoveredItem = tooltipPayload && tooltipPayload[0];
  if (hoveredItem) {
    const colorValue = hoveredItem.payload?.fill ?? hoveredItem.payload.stroke;
    const fieldName = hoveredItem?.name;
    const toolTipPayloadValue = `${fieldName}: ${hoveredItem.value}`;

    return <GeneralToolTip color={colorValue} field={toolTipPayloadValue} />;
  }
  return null;
};

export default PieChartTooltip;
