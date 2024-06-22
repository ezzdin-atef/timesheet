import { DatePickerWithRange } from "@/components/DateRangePicker";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProjectsList } from "@/database/projects";
import TimesheetForm from "@/modules/TimesheetForm";
import { Download, FilterX, Grid3X3, Plus, TableRowsSplit } from "lucide-react";
import { DateRange } from "react-day-picker";

interface TimesheetHeaderProps {
  switchView: () => void;
  view: string;
  setDateRange: (date: DateRange) => void;
  selectedProject: string | undefined;
  setSelectedProject: (e: string) => void;
  resetFilters: () => void;
  projects: ProjectsList[];
}

export default function TimesheetHeader(props: TimesheetHeaderProps) {
  const {
    resetFilters,
    selectedProject,
    setDateRange,
    setSelectedProject,
    switchView,
    view,
    projects,
  } = props;

  return (
    <header className="flex justify-between items-center mb-5">
      <h1 className="text-2xl font-semibold">Timesheet</h1>
      <div className="flex gap-2">
        <Select
          onValueChange={(e) => setSelectedProject(e)}
          value={selectedProject}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((projects) => (
              <SelectItem key={projects.id} value={projects.id}>
                {projects.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DatePickerWithRange onSelect={(date) => date && setDateRange(date)} />
        <Button className="flex gap-1" variant="outline" onClick={resetFilters}>
          <FilterX size="18" />
        </Button>
        <Button className="flex gap-1" variant="outline" onClick={switchView}>
          {view === "list" ? (
            <TableRowsSplit size="18" />
          ) : (
            <Grid3X3 size="18" />
          )}
        </Button>
        <Button className="flex gap-1" variant="outline">
          <Download size="18" />
          Export
        </Button>

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
              <TimesheetForm />
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
