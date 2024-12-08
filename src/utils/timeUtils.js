export const parseTime = (timeString) => {
    if (!timeString) return "—";
    const regex = /PT(\d+H)?(\d+M)?/;
    const match = timeString.match(regex);
    if (!match) return "—";
  
    const hours = match[1] ? parseInt(match[1], 10) : 0;
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
  
    let result = "";
    if (hours > 0) result += `${hours} ч. `;
    if (minutes > 0) result += `${minutes} мин`;
    return result.trim();
  };
  