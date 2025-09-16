import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

export function DateFormatter(date: Date) {
  if (isToday(date)) {
    return formatDistanceToNow(date, { addSuffix: true });
  }
  if (isYesterday(date)) {
    return `Yesterday, ${format(date, "p")}`;
  }
  return format(date, "MMM d, yyyy");
}
