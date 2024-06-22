import { DatePickerWithRange } from "@/components/DateRangePicker";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VacationList, getVacation } from "@/database/vacation";
import VacationForm from "@/modules/VacationForm";
import { PencilRuler, Plus, Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import { DateRange } from "react-day-picker";

export default function VacationsPage() {
  const [data, setData] = React.useState<VacationList[]>([]);
  const [dateRange, setDateRange] = React.useState<DateRange | null>(null);
  const [vacations, setVacations] = React.useState<VacationList[]>([]);

  // Handle Delete Records
  const handleDelete = (id: string) => {
    console.log(id);
  };

  // Fetch Data
  useEffect(() => {
    getVacation().then(setVacations);
  }, []);

  // Set Data
  useEffect(() => {
    setData(vacations);
  }, [dateRange, vacations]);

  return (
    <div>
      <header className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold">Vacations</h1>
        <div className="flex gap-2">
          <DatePickerWithRange
            onSelect={(date) => date && setDateRange(date)}
          />

          <Sheet>
            <SheetTrigger>
              <Button className="flex gap-1">
                <Plus size="18" />
                Add Record
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="mb-5">Add New Record</SheetTitle>
                <VacationForm />
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.date.toDateString()}</TableCell>
              <TableCell>{item.type}</TableCell>
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
                      <VacationForm {...item} />
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
        </TableBody>
      </Table>
    </div>
  );
}
