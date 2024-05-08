const formatValue = (val: number | string): string => {
  return typeof val === "number" ? (+val.toFixed(1)).toLocaleString() : val;
};

export default formatValue;
