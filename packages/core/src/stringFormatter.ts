import { isEmpty, isNull } from 'lodash-es';
import dayjs from 'dayjs';

import { regexThousandFilter } from './validation';

export const addCommasToNumber = (number: number | string) => {
  if (number) {
    // 숫자를 문자열로 변환하고 소수점을 기준으로 나눕니다.
    const parts = number.toString().split('.');

    // 첫 번째 부분(정수 부분)에 쉼표를 추가합니다.
    parts[0] = parts[0].replace(regexThousandFilter, ',');

    // 변환된 정수 부분과 소수점 아래 부분을 합쳐 반환합니다.
    return parts.join('.');
  }
  return 0;
};

export const nullValueToDash = (value?: string | number) => {
  if (typeof value === 'number' && isNull(value)) {
    return '-';
  }
  if (typeof value === 'string' && typeof value === 'undefined' && isEmpty(value)) {
    return '-';
  }
  return value;
};

export const formatDate = (data: string) => {
  if (isNull(data) || data === ' ') {
    return '-';
  }

  const trimmed = data.trim();

  return dayjs(trimmed).format('YYYY.MM.DD');
};

export const formatDateWithTime = (data: string) => {
  if (isNull(data) || data === ' ') {
    return '-';
  }

  const trimmed = data.trim();

  return dayjs(trimmed).format('YYYY.MM.DD HH시 mm분');
};
