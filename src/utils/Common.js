export const formatDecimalBy3 = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const fastInterval = (func, interval) => {
  func();
  return setInterval(func, interval);
};
