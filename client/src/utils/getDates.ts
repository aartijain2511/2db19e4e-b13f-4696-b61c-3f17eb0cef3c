type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const getDates = (duration: string): Value => {
  if (duration === "year") {
    let year = new Date().getFullYear()-1;
    let startDate = new Date(`${year}-01-01T00:00:00`);
    let endDate = new Date(`${year}-12-31T00:00:00`);

    return [startDate, endDate];
  }

  let endDate = new Date();
  endDate.setHours(0, 0, 0, 0);
  let startDate = new Date(endDate.getTime());
  startDate.setDate(startDate.getDate() - +duration);
  startDate.setHours(0, 0, 0, 0);
  return [startDate, endDate];
};

export default getDates;
