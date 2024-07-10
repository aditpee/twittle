import { useMemo } from "react";

const useFormatTime = () => {
  const getMonth = useMemo(() => {
    return (date) => {
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
      return monthNames[new Date(date).getMonth()];
    };
  }, []);

  const getYear = useMemo(() => {
    return (date) => {
      return new Date(date).getFullYear();
    };
  }, []);

  const getDate = useMemo(() => {
    return (date) => {
      return new Date(date).getDate();
    };
  }, []);

  const getTime = useMemo(() => {
    return (date) => {
      let hour = new Date(date).getHours();
      const minute = new Date(date).getMinutes();

      const pmAm = hour < 12 ? "AM" : "PM";

      if (hour === 0) hour = 12;

      return `${hour}:${minute} ${pmAm}`;
    };
  }, []);

  const getFullDate = useMemo(() => {
    return (date) => {
      const day = getDate(date);
      const month = getMonth(date);
      const year = getYear(date);

      return `${month} ${day}, ${year}`;
    };
  }, [getDate, getMonth, getYear]);

  const timeAgo = useMemo(() => {
    return (date) => {
      const seconds = Math.floor((new Date() - date) / 1000);

      let interval = seconds / 31536000;
      const month = getMonth(date);
      const year = new Date(date).getFullYear();
      const day = new Date(date).getDate();
      let kkdk = 0;
      console.log(kkdk++);

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
    };
  }, [getMonth]);

  return { timeAgo, getMonth, getYear, getTime, getFullDate };
};

export default useFormatTime;
