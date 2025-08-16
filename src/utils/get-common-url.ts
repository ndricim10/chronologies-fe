import { CommonUrlParams } from '@/@types/common';
import { addFilter, convertDate } from './common-functions';

export const getCommonUrl = (args: CommonUrlParams, queryString: string, date = 'date') => {
  let hasFilter = false;

  const eqOperators = ['date', 'status', 'from', 'to', 'fromDate', 'toDate', 'year'];
  const ilikeOperators = ['name'];

  if (args.page !== undefined) {
    ({ queryString, hasFilter } = addFilter(queryString, `page=${args.page}`, hasFilter));
  }

  if (args.size) {
    ({ queryString, hasFilter } = addFilter(queryString, `size=${args.size}`, hasFilter));
  }

  Object.entries(args).forEach(([key, value]) => {
    if (value && String(value).length > 0 && key !== 'page' && key !== 'size') {
      switch (key) {
        case 'from':
        case 'fromDate':
          ({ queryString, hasFilter } = addFilter(
            queryString,
            `filter=${date}:gte:${convertDate(String(value))}`,
            hasFilter
          ));
          break;

        case 'to':
        case 'toDate':
          ({ queryString, hasFilter } = addFilter(
            queryString,
            `filter=${date}:lte:${convertDate(String(value))}`,
            hasFilter
          ));
          break;

        default:
          if (Array.isArray(value)) {
            const inValues = value.join(';');
            ({ queryString, hasFilter } = addFilter(queryString, `filter=${key}:in:${inValues}`, hasFilter));
          }
          if (eqOperators.includes(key)) {
            ({ queryString, hasFilter } = addFilter(queryString, `filter=${key}:eq:${value}`, hasFilter));
          } else if (ilikeOperators.includes(key)) {
            ({ queryString, hasFilter } = addFilter(queryString, `filter=${key}:ilike:${value}`, hasFilter));
          }
          break;
      }
    }
  });

  return queryString;
};
