const useFormatTime = () => {
  function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
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

  return { timeAgo };
};

export default useFormatTime;
