import dayjs from 'dayjs';

export const Timezone = {
  Malaysia: {
    name: 'Asia/Kuala_Lumpur',
    offset: '+08:00',
  },
  Singapore: {
    name: 'Asia/Singapore',
    offset: '+08:00',
  },
  Bangkok: {
    name: 'Asia/Bangkok',
    offset: '+07:00',
  },
  Jakarta: {
    name: 'Asia/Jakarta',
    offset: '+07:00',
  },
  Manila: {
    name: 'Asia/Manila',
    offset: '+08:00',
  },
  HongKong: {
    name: 'Asia/Hong_Kong',
    offset: '+08:00',
  },
  Taipei: {
    name: 'Asia/Taipei',
    offset: '+08:00',
  },
  Tokyo: {
    name: 'Asia/Tokyo',
    offset: '+09:00',
  },
  Seoul: {
    name: 'Asia/Seoul',
    offset: '+09:00',
  },
  Beijing: {
    name: 'Asia/Shanghai',
    offset: '+08:00',
  },
  Sydney: {
    name: 'Australia/Sydney',
    offset: '+10:00',
  },
  London: {
    name: 'Europe/London',
    offset: '+01:00',
  },
  NewYork: {
    name: 'America/New_York',
    offset: '-04:00',
  },
};

export const parseDate = (
  value: Date,
  tz: keyof typeof Timezone = 'Malaysia'
) => {
  return dayjs.utc(value).tz(Timezone[tz].name);
};

export const toTimezone = (date: dayjs.Dayjs, tz: keyof typeof Timezone) => {
  const value = new Date(date.format());
  const offset = Timezone[tz].offset;
  value.setHours(value.getHours() + parseInt(offset, 10));
  return value;
};
