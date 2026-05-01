export const isTenMinutesLater = (updatedAt: Date) => {
  const currentTime = new Date();
  const tenMinutesLater = new Date(updatedAt.getTime() + 10 * 60 * 1000);
  return currentTime >= tenMinutesLater;
};
export const getDatePeriods = (startDate, endDate) => {
  const ONE_DAY = 24 * 60 * 60 * 1000;

  const finalStartDate = new Date(startDate);
  const finalEndDate = new Date(endDate);

  const duration = Math.round((finalEndDate.getTime() - finalStartDate.getTime()) / ONE_DAY) + 1;
  console.log('Duration:', duration);
  const previousEndDate = new Date(finalStartDate);
  previousEndDate.setDate(previousEndDate.getDate() - 1);

  const previousStartDate = new Date(previousEndDate);
  previousStartDate.setDate(previousStartDate.getDate() - (duration - 1));

  return {
    duration,
    previousStartDate,
    previousEndDate,
  };
};

export const getPreviousYearDatePeriod = (startDate, endDate) => {
  const finalStartDate = new Date(startDate);
  const finalEndDate = new Date(endDate);
  finalEndDate.setFullYear(finalEndDate.getFullYear() - 1);
  finalStartDate.setFullYear(finalStartDate.getFullYear() - 1);
  return {
    previousStartDate: finalStartDate,
    previousEndDate: finalEndDate,
  };
};
