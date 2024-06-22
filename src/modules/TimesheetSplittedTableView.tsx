import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TableCell, TableRow } from "@/components/ui/table";
import { VacationList } from "@/database/vacation";
import { WorkItemsList } from "@/database/work-items";
import { PencilRuler, Trash2 } from "lucide-react";
import React from "react";
import TimesheetForm from "./TimesheetForm";

interface TimesheetSplittedTableViewProps {
  splitedData: { [key: string]: WorkItemsList[] };
  vacations: VacationList[];
  handleDelete: (id: string) => void;
}

export default function TimesheetSplittedTableView({
  splitedData,
  vacations,
  handleDelete,
}: TimesheetSplittedTableViewProps) {
  return Object.keys(splitedData).map((date) => {
    const isThisDateIsVacation = vacations.find(
      (vacation) => vacation.date.toDateString() === date
    );
    const isThisDateCompleted =
      splitedData[date].reduce((acc, item) => acc + item.duration, 0) === 1;
    return (
      <React.Fragment key={date}>
        <TableRow>
          <TableCell colSpan={9} className="">
            {date}{" "}
            {
              // verify if the total duration is 1
              !isThisDateCompleted ? (
                <span className="text-sm text-yellow-500">[Not Completed]</span>
              ) : (
                <span className="text-sm text-green-500">[Completed]</span>
              )
            }{" "}
            {
              // verify if the total duration is 1
              isThisDateIsVacation ? (
                <span className="text-sm text-red-500">[Vacation]</span>
              ) : null
            }
          </TableCell>
        </TableRow>
        {splitedData[date].map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.id}</TableCell>
            <TableCell>{item.taskDescription}</TableCell>
            <TableCell>{item.date.toDateString()}</TableCell>
            <TableCell>{item.assignedBy}</TableCell>
            <TableCell>{item.duration}</TableCell>
            <TableCell>{item.projectName}</TableCell>
            <TableCell>{item.projectCode}</TableCell>
            <TableCell>{item.projectDF}</TableCell>
            <TableCell className="flex gap-2">
              <Sheet>
                <SheetTrigger>
                  <Button variant="ghost" size="icon">
                    <PencilRuler size="18" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle className="mb-5">Edit Record</SheetTitle>
                    <TimesheetForm {...item} />
                  </SheetHeader>
                </SheetContent>
              </Sheet>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 size="18" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </React.Fragment>
    );
  });
}
