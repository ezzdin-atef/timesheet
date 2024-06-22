import { WorkItemsList } from "@/database/work-items";
import { filterWorkItemsByRange } from "./filterWorkItemsByRange";

export function splitTimesheetByDate(
  items: WorkItemsList[],
  from: Date,
  to: Date
) {
  const filteredItems = filterWorkItemsByRange(items, from, to);

  const splitedData: { [key: string]: WorkItemsList[] } = {};

  filteredItems.forEach((item) => {
    const date = item.date.toDateString();
    if (!splitedData[date]) {
      splitedData[date] = [];
    }
    splitedData[date].push(item);
  });

  return splitedData;
}
