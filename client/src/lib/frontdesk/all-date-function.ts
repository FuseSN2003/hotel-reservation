export const thisYear = new Date().getFullYear();
export const thisMonthNumber = new Date().getMonth() + 1;
export const startYear = 2023;
export const endYear = thisYear + 22;
export const YearPerPage = 8;
export const arrayYear = Array.from(
  { length: endYear - startYear + 1 },
  (_, i) => startYear + i
);
export const arrayMonth = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
