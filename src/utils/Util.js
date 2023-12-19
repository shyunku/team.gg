export const colorByRate = (rate) => {
  if (rate < 0.5) {
    return "rgb(255, 100, 100)";
  } else if (rate < 0.85) {
    return "rgb(213, 193, 104)";
  } else {
    return "rgb(80, 219, 108)";
  }
};

export const bgColorByRate = (rate) => {
  if (rate < 0.5) {
    return "rgb(97, 53, 53)";
  } else if (rate < 0.85) {
    return "rgb(109, 91,13)";
  } else {
    return "rgb(19, 83, 30)";
  }
};

export const formatMasteryPoints = (points) => {
  if (points < 10000) {
    return `${Math.floor(points)}`;
  } else {
    return `${Math.floor(points / 10000)}만`;
  }
};
