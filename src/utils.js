
export const getDateAfterDays = (days) => {
  const today = new Date();
  today.setDate(today.getDate() + days);  
  return today.toISOString().split("T")[0];  
};

export const convertDateFormat = (date) => {
  const [y, m, d] = date.split("-");
  return `${d}-${m}-${y}`;
};

export const isWithinRange = (date, startDate, endDate) => {
  const targetDate = new Date(date);
  return targetDate >= new Date(startDate) && targetDate <= new Date(endDate);
};

export const isValidDateRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const today = new Date();
    const maxEndDate = new Date(today);
    maxEndDate.setDate(today.getDate() + 7);
  
    if (isNaN(startDate) || isNaN(endDate)) return false;
    if (startDate < today) return false;
    if (endDate > maxEndDate) return false;
    if (endDate < startDate) return false;
  
    return true;
  };