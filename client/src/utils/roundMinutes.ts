const roundMinutes = (dtStr: string): string => {
  const dt = new Date(dtStr);
  const minute = dt.getMinutes() > 30 ? 0 : 30;
  dt.setMinutes(minute);
  dt.setSeconds(0);
  return dt.toISOString();
};

export default roundMinutes;
