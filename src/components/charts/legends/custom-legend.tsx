import { LegendPayloadOnClick } from '@/@types/charts';

export const renderLegend = (payload: LegendPayloadOnClick) => {
  const color = payload?.color;
  return (
    <span style={{ color }} className={'text-mono-0 cursor-pointer text-sm'}>
      <>{payload || '[none]'}</>
    </span>
  );
};
