import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getCurrencySymbol = (currencyCode) => {
  const symbol = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).formatToParts()[0].value;
  return symbol
}

export const updatePayments = (firstList, secondList) => {
  for (const item2 of secondList) {
      const item1Index = firstList.findIndex(item1 => item1.id === item2.id);
      if (item1Index !== -1) {
          firstList[item1Index].payment_expected_at = item2.payment_expected_at;
          firstList[item1Index].payment_made_at = item2.payment_made_at;
      }
  }
  return firstList;
}