import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TableCell, TableRow } from "@/components/ui/table";
import { WorkItemsList } from "@/database/work-items";
import { PencilRuler, Trash2 } from "lucide-react";
import React from "react";
import TimesheetForm from "./TimesheetForm";

interface TimesheetTableViewProps {
  data: WorkItemsList[];
  handleDelete: (id: string) => void;
}

export default function TimesheetTableView({
  data,
  handleDelete,
}: TimesheetTableViewProps) {
  return data.map((item) => (
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
  ));
}
