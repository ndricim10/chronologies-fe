import { DecodedToken, ErrorProps, Position } from '@/@types/common';
import { jwtDecode } from 'jwt-decode';
import { debounce } from 'lodash';
import { format } from 'date-fns';
import { toast } from 'sonner';

export const tokenExpiry = () => {
  const token = localStorage.getItem('idToken');
  if (token) {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.exp;
  }
};

export const getBaseApiUrl = () => {
  return import.meta.env.VITE_REACT_APP_API;
};

export const getPrepareHeaders = (headers: Headers) => {
  const token = localStorage.getItem('idToken');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
};

export const debouncedSetName = debounce((value, setName: (value: string) => void) => {
  setName(value);
}, 600);

export const convertDate = (value?: Date | string, formatType = 'yyyy-MM-dd', toLocalDateTime = false) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (toLocalDateTime) {
    const localDate = new Date(date.getTime());
    return format(localDate, `${formatType}, HH:mm`);
  }

  return format(date, formatType);
};

export const toastComponent = (
  description: string,
  type?: 'error' | 'success' | 'info' | 'warning',
  position?: Position
) => {
  const updatedType = type ?? 'success';
  const background =
    type === 'success'
      ? 'bg-primary'
      : type === 'error'
        ? 'bg-red-700'
        : type === 'warning'
          ? 'bg-yellow-700'
          : 'bg-white';

  const textColor = type === 'info' ? 'text-primary' : 'text-white';

  return toast[updatedType]('', {
    description,
    action: {
      label: 'X',
      onClick: () => {},
    },
    className: `${background} ${textColor} rounded-md shadow-lg`,
    position,
  });
};

export const getFirstCharacters = (value = '') => {
  const words = value.split(' ');
  const initials = words.filter((item) => isNaN(Number(item.charAt(0)))).map((item) => item.charAt(0).toUpperCase());
  return initials.slice(0, 2).join('');
};

export const initialPage = {
  page: 0,
  size: 10,
};

export const initialQueryState = {
  page: 0,
  loading: false,
  hasMore: true,
  size: 10,
  search: '',
};

export const isCursorPointer = (value?: boolean) => (value ? 'cursor-not-allowed opacity-60' : 'cursor-pointer');

export const substringValue = (value: string, len = 30) =>
  value?.length > len ? value?.substring(0, len) + '...' : value;

export const handleDownloadResponse = (response: Response) => {
  if (response.status === 200) {
    return response.blob();
  }
  return response.json();
};

export const downloadFile = (responseText: Blob, name: string) => {
  const fileUrl = window.URL.createObjectURL(responseText);
  const fileName = name;
  const downloadLink = document.createElement('a');
  downloadLink.href = fileUrl;
  downloadLink.download = fileName;
  downloadLink.click();
};

export const addFilter = (queryString: string, filter: string, hasFilter: boolean) => {
  if (!hasFilter) {
    queryString += `?${filter}`;
    hasFilter = true;
  } else {
    queryString += `&${filter}`;
  }
  return { queryString, hasFilter };
};

export const capitalizeText = (text: string) => {
  if (!text) return '';

  const modifiedText = text.replace(/_/g, ' ');
  return modifiedText.charAt(0).toUpperCase() + modifiedText.slice(1).toLowerCase();
};

export const handleErrorMessages = (err: ErrorProps, label: string) => {
  if (err.status === 462) {
    toastComponent(err.data.message, 'error');
  } else {
    toastComponent(label, 'error');
  }
};

export const base64ToBlob = (base64: string, mimeType: string) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

export const formatNumber = (value: number | string, toFixed = 1, currency = '') => {
  const roundedNumber = Math.round(Number(value) * 100) / 100;

  const [integralPart, decimalPart] = roundedNumber.toFixed(toFixed).split('.');

  const formattedIntegralPart = integralPart.replace(/\B(?=(\d{3})+(?!\d))/g, `.`);

  if (decimalPart !== '00' && decimalPart !== '0') {
    return `${formattedIntegralPart},${decimalPart} ${currency ?? ''}`;
  } else {
    return `${formattedIntegralPart} ${currency ?? ''}`;
  }
};

export const filteredNullData = (data: any, filterEmptyStrings = true) => {
  const obj = Object.keys(data).reduce((acc: any, key) => {
    const value = data[key];
    if (value !== null && value !== undefined && (!filterEmptyStrings || value !== '')) {
      acc[key] = value;
    }

    return acc;
  }, {});

  return obj;
};
