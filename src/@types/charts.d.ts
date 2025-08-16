import { Key } from 'react';
import { Payload } from 'recharts/types/component/DefaultLegendContent';
import { LabelPosition } from 'recharts/types/component/Label';
import { DataKey } from 'recharts/types/util/types';

export type LegendPayloadOnClick = Payload & {
  dataKey?: Key | DataKey<unknown>;
};

export type ElementProps = {
  dataKey: string;
  name: string;
  field: string;
  value: string;
  color: string;
  fill: string;
  [key: string]: Key;
};

export interface CircleProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
}

interface TooltipPayloadProps extends Partial<ColorItemProps> {
  name: string;
  value: number;
  payload: {
    payload: {
      name: string;
      value: number;
      percentage: number;
    };
    cursor: string;
    fill: string;
    cx: number;
    cy: number;
    stroke: string;
    name: string;
    value: number;
    percentage: number;
    style: {
      outline: string;
    };
  };
  stroke: string;
  dataKey: string;
}

export interface ToolTipElement extends CircleProps {
  points?: Array<{
    payload: {
      field: string;
    };
  }>;
  name?: string;
  tooltipPosition: {
    x: number;
    y: number;
  };
  payload: ElementProps;
  percent: number;
  fill: string;
  value: number;
  id: number;
  index: number;
  color: string;
  endAngle: number;
  startAngle: number;
  labelFormat: string;
  labelDecimals: number;
  x: number;
  y: number;
  tooltipPayload: TooltipPayloadProps[];
}

export interface CustomPayload extends ColorItemProps, CommonResponse {
  dataKey: string;
  stroke?: string;
  value: number | string;
  payload?: ElementProps;
}

export interface CustomToolTipProps {
  name?: string;
  fill?: string;
  stroke?: string;
  color?: string;
  field?: string;
  tooltipPayload?: TooltipPayloadProps[];
  payload?: Array<CustomPayload>;
  bgColor?: string;
  tooltipData?: any;
}

interface ColorItemProps {
  color: string;
  fill: string;
}

export interface ValueProps {
  value?: number;
  text?: string;
}

export interface CommonResponse {
  name?: string;
  value?: number;
  [key: string]: Key;
}

export interface AxisPropsPayload {
  value: string;
  offset: string | number;
}

export interface AxisProps {
  x: number;
  y: number;
  scaleToFit: boolean;
  payload: AxisPropsPayload;
  index?: number;
  visibleTicksCount: number;
}

export interface PayloadChart {
  name: string;
  fill: string;
  Injury: number;
  x: number;
  y: number;
  width: number;
  height: number;
  value: number[];
  payload: {
    name: string;
    color: string;
    Injury: number;
  };
  background: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  tooltipPayload: [
    {
      fill: string;
      dataKey: string;
      name: string;
      color: string;
      payload: {
        name: string;
        Injury: number;
      };
    },
  ];
  tooltipPosition: {
    x: string;
    y: number;
  };
  layout?: string;
}

export interface ChartParams {
  data: CommonResponse[];
  tooltipData?: CustomToolTipProps;
  setTooltipData?: (value: React.SetStateAction<CustomToolTipProps | undefined>) => void;
  isPercentage?: boolean;
  colors?: string[];
  isLoading?: boolean;
  dataKey?: string;
  barSize?: number;
  labelPosition?: LabelPosition;
  height?: number;
  width?: string;
  barName?: string;
  barGap?: number;
  layout?: 'vertical' | 'horizontal';
  showLegend?: boolean;
  showLabel?: boolean;
  isReferenceLine?: boolean;
  nameKey?: string;
  outerRadius?: string;
  referenceLineColor?: string;
  stackId?: 'stack' | undefined;
  radius?: number | [number, number, number, number];
}
