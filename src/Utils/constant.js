import { format, isTomorrow, isToday } from "date-fns";

export const getDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const currentdate = new Date();
    let day = date.getDay();
    let currentDay = currentdate.getDay();
    const diff = currentDay - day;
    if (diff === 0)
        return 'Today';
    else if (day === 1)
        return 'Tomorrow';
    else
        return format(date, "dd/MM/yyyy");
}

export const isTimeDifferenceFiveMinutes = (post)=>{
    const date = post?.date?.seconds ? new Date(post.date.seconds * 1000) : null;
    const formattedTime = date ? date.toLocaleTimeString() : null;
  
    if (formattedTime) {
      const currentTime = new Date();
      const timeDifference = Math.abs(currentTime.getTime() - date.getTime());
      const minutesDifference = Math.floor(timeDifference / (1000 * 60));
  
      return minutesDifference <= 5;
    }
  
    return false;
  }
  