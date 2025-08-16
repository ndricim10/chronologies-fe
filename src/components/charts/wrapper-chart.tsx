import { ChartParams } from '@/@types/charts';
import { ReactNode } from 'react';
import Spinner from '../common-cards/Spinner';
import NoDataToDisplay from '../common-cards/no-data-display';

const WrapperChart = ({ data = [], isLoading, children }: ChartParams & { children: ReactNode }) => {
  if (isLoading) {
    return <Spinner />;
  } else if (data.length === 0) {
    return <NoDataToDisplay />;
  }
  return children;
};

export default WrapperChart;
