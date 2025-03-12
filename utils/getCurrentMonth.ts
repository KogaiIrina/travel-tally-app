export const getCurrentMonth = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
  });
  return currentMonth;
};
