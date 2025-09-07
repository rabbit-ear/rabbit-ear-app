
export const formatNumber = (n: number) => {
  if (n === undefined) {
    return "";
  }
  const integer = Math.floor(n);
  return integer === n ? n : n.toFixed(2);
};

export const formatPoint = (p: number[]) => p.map(formatNumber).join(", ");

