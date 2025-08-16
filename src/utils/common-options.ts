import { OptionsType } from '@/@types/common';
import { capitalizeText } from './common-functions';

export const commonOptions = <T extends object>(
  enumObject: T,
  sort = true,
  capitalize = true,
  disabledValue = ''
): OptionsType[] => {
  const enumValues = Object.values(enumObject);

  if (sort) {
    enumValues.sort();
  }

  return enumValues.map((item) => ({
    value: {
      label: capitalize ? capitalizeText(String(item)) : item,
      value: item,
    },
    label: capitalize ? capitalizeText(item) : item,
    disabled: disabledValue === item,
  }));
};
