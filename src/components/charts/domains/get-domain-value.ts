import { CommonResponse } from '@/@types/charts';

export const roundHighest = (highest: number) => {
  const getCeiledValue = (ceilBy: number) => Math.ceil((highest + 1) / ceilBy) * ceilBy;
  if (highest < 1) {
    return highest;
  } else if (highest < 5) {
    return getCeiledValue(1);
  } else if (highest < 10) {
    return getCeiledValue(2);
  } else if (highest <= 100) {
    return getCeiledValue(4);
  } else if (highest <= 1000) {
    return getCeiledValue(200);
  } else if (highest <= 10000) {
    return getCeiledValue(2000);
  } else if (highest > 10000 && highest <= 100000) {
    return getCeiledValue(20000);
  }
  return getCeiledValue(200000);
};

function getDomainValue<T extends CommonResponse>(data: T[]) {
  const highest = Math.max(...data.map((item) => Math.max(Number(item.value))));
  return roundHighest(highest);
}

export { getDomainValue };
