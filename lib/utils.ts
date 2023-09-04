import { clsx, type ClassValue } from "clsx";
import { randomUUID } from "crypto";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUUID() {
  return randomUUID();
}

export function formatDate(date: Date) {
  const day = date.getDate();
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
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Pad the day and minutes with leading zeros if needed
  const paddedDay = String(day).padStart(2, "0");
  const paddedMinutes = String(minutes).padStart(2, "0");

  // Construct the formatted string
  const formattedDate = `${paddedDay} ${month} ${year} ${hours}:${paddedMinutes}`;

  return formattedDate;
}
