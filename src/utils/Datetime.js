export function hours12(date) {
  const hours = date instanceof Date ? date.getHours() : new Date(date).getHours();
  return (hours + 24) % 12 || 12;
}

export function hours12tohours24(hour, isPm) {
  return (hour === 12 ? 0 : hour) + (isPm ? 12 : 0);
}

export function circularDistance(a, b, min, max, step) {
  const maxDistance = max - min;
  const distance = Math.abs(a - b);

  if (distance > maxDistance / 2) {
    if (a > b) {
      return max - a + (b - min + step);
    } else {
      return max - b + (a - min + step);
    }
  }
  return distance;
}

export function floorMinutesByStep(minutes, step) {
  return (Math.floor(minutes / step) * step) % 60;
}

export function ceilMinutesByStep(minutes, step) {
  return (Math.floor(minutes / step) * step) % 60;
}

export function toRelativeTime(milli, progress = false) {
  if (milli == null) return "-";

  const now = Date.now();
  let diff = now - milli;

  let rel = diff > 0 ? "전" : "후";
  if (diff < 0) {
    diff = -diff;
  }

  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);
  const week = Math.floor(day / 7);
  const month = Math.floor(day / 30);
  const year = Math.floor(day / 365);

  if (year > 10) return `> 10년 ${rel}`;
  if (year > 0) return `${year}년 ${rel}`;
  if (month > 0) return `${month}개월 ${rel}`;
  if (week > 0) return `${week}주 ${rel}`;
  if (day > 0) return `${day}일 ${rel}`;
  if (hour > 0) return `${hour}시간 ${rel}`;
  if (min > 0) return `${min}분 ${rel}`;
  if (sec > 0) return `${sec}초 ${rel}`;
  if (diff > 0) return `0 밀리초 ${rel}`;
  return progress ? "완료" : "방금 전";
}

const YEAR = 365 * 24 * 60 * 60 * 1000;
const MONTH = 30 * 24 * 60 * 60 * 1000;
const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
const MINUTE = 60 * 1000;
const SECOND = 1000;

// relative time to relative time text
const defaultOptions = {
  showLayerCount: 4,
  showMillisec: false,
};

export function fromRelativeTime(milli, rawOptions = defaultOptions) {
  if (milli == null) return "-";
  let inversed = milli < 0;
  if (inversed) milli = -milli;

  const options = { ...defaultOptions, ...rawOptions };

  const year = Math.floor(milli / YEAR);
  milli %= YEAR;
  const month = Math.floor(milli / MONTH);
  milli %= MONTH;
  const day = Math.floor(milli / DAY);
  milli %= DAY;
  const hour = Math.floor(milli / HOUR);
  milli %= HOUR;
  const min = Math.floor(milli / MINUTE);
  milli %= MINUTE;
  const sec = Math.floor(milli / SECOND);
  milli %= SECOND;
  const msec = milli;

  const segments = [
    { value: year, unit: "년" },
    { value: month, unit: "개월" },
    { value: day, unit: "일" },
    { value: hour, unit: "시간" },
    { value: min, unit: "분" },
    { value: sec, unit: "초" },
    { value: msec, unit: "밀리초" },
  ];

  const showLayerCount = options?.showLayerCount ?? 0;

  const texts = [];
  let flag = false;
  for (let i = 0, j = 0; i < segments.length; i++) {
    const { value, unit } = segments[i];
    if (options?.showMillisec === false && unit === "밀리초") continue;
    if (value > 0 || flag) {
      let valText = unit === "밀리초" ? value.toString().padStart(3, "0") : value;
      texts.push(`${valText}${unit}`);
      j++;
      flag = true;
    }
    if (showLayerCount && j >= showLayerCount) break;
  }
  if (texts.length === 0) texts.push("0초");

  return (inversed ? "-" : "") + texts.join(" ");
}

export function toDuration(milli) {
  if (milli == null) return "-";
  let inversed = milli < 0;
  if (inversed) milli = -milli;

  const year = Math.floor(milli / YEAR);
  milli %= YEAR;
  const month = Math.floor(milli / MONTH);
  milli %= MONTH;
  const day = Math.floor(milli / DAY);
  milli %= DAY;
  const hour = Math.floor(milli / HOUR);
  milli %= HOUR;
  const min = Math.floor(milli / MINUTE);
  milli %= MINUTE;
  const sec = Math.floor(milli / SECOND);
  milli %= SECOND;
  const msec = milli;

  const segments = [
    { value: year, unit: "년" },
    { value: month, unit: "개월" },
    { value: day, unit: "일" },
    { value: hour, unit: "시간" },
    { value: min, unit: "분" },
    { value: sec, unit: "초" },
  ];

  const texts = [];
  let flag = false;
  for (let i = 0; i < segments.length; i++) {
    const { value, unit } = segments[i];
    if (value > 0 || flag) {
      texts.push(`${value}${unit}`);
      flag = true;
    }
  }
  if (texts.length === 0) texts.push("0초");

  return (inversed ? "-" : "") + texts.join(" ");
}

export default {};
