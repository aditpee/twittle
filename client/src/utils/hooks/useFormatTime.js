const useFormatTime = () => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getMonth = (date) => {
    return monthNames[new Date(date).getMonth()];
  };
  const getYear = (date) => {
    return new Date(date).getFullYear();
  };
  const getDate = (date) => {
    return new Date(date).getDate();
  };

  const getTime = (date) => {
    let hour = new Date(date).getHours();
    const minute = new Date(date).getMinutes();

    if (hour === 0) hour = 12;

    return hour < 12 ? `${hour}:${minute} AM` : `${hour - 12}:${minute} PM`;
  };

  const getFullDate = (date) => {
    const day = getDate(date);
    const month = getMonth(date);
    const year = getYear(date);

    return `${month} ${day}, ${year}`;
  };

  function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;
    const month = monthNames[new Date(date).getMonth()];
    const year = new Date(date).getFullYear();
    const day = new Date(date).getDate();

    if (interval > 1) {
      return `${month} ${day}, ${year}`;
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return `${month} ${day}`;
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return `${month} ${day}`;
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + "h";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + "m";
    }
    if (seconds !== 0) {
      return Math.floor(seconds) + "s";
    }
    return "Now";
  }

  return { timeAgo, getMonth, getYear, getTime, getFullDate };
};

export default useFormatTime;
