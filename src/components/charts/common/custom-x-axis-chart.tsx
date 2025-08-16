import { Customized, Text } from 'recharts';
import { AxisProps } from '@/@types/charts';

type TextElWithTooltipType = {
  value?: string;
  x: number;
  y: number;
  rotateLabel: boolean;
  textWidth: number;
};

export const XAxisLineChart = ({ x, y, payload, visibleTicksCount }: AxisProps) => {
  const rotateLabels = visibleTicksCount > 3;
  return <CustomizedTextWithTooltip x={x} y={y} textWidth={300} rotateLabel={rotateLabels} value={payload.value} />;
};

const getAttributeFromCondition = <T,>(conditon: boolean, first: T, second: T): T => {
  return conditon ? first : second;
};

const CustomizedTextWithTooltip = ({ value, x, y, rotateLabel, textWidth }: TextElWithTooltipType) => {
  return value ? (
    <Customized
      component={
        <>
          <title>{value}</title>
          <Text
            x={x}
            y={y}
            fontSize={getAttributeFromCondition(rotateLabel, 8, 10.5)}
            verticalAnchor="start"
            textAnchor={getAttributeFromCondition(rotateLabel, 'end', 'middle')}
            angle={getAttributeFromCondition(rotateLabel, -40, 0)}
            width={textWidth}
            maxLines={getAttributeFromCondition(rotateLabel, 1, 2)}
          >
            {value}
          </Text>
        </>
      }
    />
  ) : (
    <></>
  );
};

export const compactNumberFormatter = (value: number | bigint) =>
  new Intl.NumberFormat('en', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
