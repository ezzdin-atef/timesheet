import { WorkItemsList } from "@/database/work-items";
import { format, isAfter, isBefore, isEqual } from "date-fns";

export function filterWorkItemsByRange(
  items: WorkItemsList[],
  from: Date,
  to: Date
) {
  const _from = format(from, "yyyy-MM-dd");
  const _to = format(to, "yyyy-MM-dd");

  const _data = items.filter((item) => {
    const date = format(new Date(item.date), "yyyy-MM-dd");
    return (
      (isAfter(date, _from) && isBefore(date, _to)) ||
      isEqual(date, _from) ||
      isEqual(date, _to)
    );
  });

  return _data;
}
