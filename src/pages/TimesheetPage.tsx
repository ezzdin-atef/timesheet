import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { ProjectsList, getProjects } from "@/database/projects";
import { VacationList, getVacation } from "@/database/vacation";
import {
  WorkItemsList,
  deleteWorkItem,
  getWorkItems,
} from "@/database/work-items";
import { filterWorkItemsByRange } from "@/helpers/filterWorkItemsByRange";
import { splitTimesheetByDate } from "@/helpers/splitTimesheetByDate";
import TimesheetHeader from "@/modules/TimesheetHeader";
import TimesheetSplittedTableView from "@/modules/TimesheetSplittedTableView";
import TimesheetTableView from "@/modules/TimesheetTableView";
import React, { useEffect } from "react";
import { DateRange } from "react-day-picker";

const today = new Date();

const defaultDateValue = {
  from: new Date(
      today.getFullYear(),
      today.getDate() < 22 ? today.getMonth() - 1 : today.getMonth(),
      22
  ),
  to: new Date(
      today.getFullYear(),
      today.getDate() < 22 ? today.getMonth() : today.getMonth() + 1,
      21
  ),
}

export default function TimesheetPage() {
  const [data, setData] = React.useState<WorkItemsList[]>([]);
  const [splitedData, setSplitedData] = React.useState<{
    [key: string]: WorkItemsList[];
  }>({});
  const [view, setView] = React.useState<"list" | "splitted">("list");
  const [dateRange, setDateRange] = React.useState<DateRange | null>(defaultDateValue);
  const [projects, setProjects] = React.useState<ProjectsList[]>([]);
  const [workItems, setWorkItems] = React.useState<WorkItemsList[]>([]);
  const [vacations, setVacations] = React.useState<VacationList[]>([]);
  const [selectedProject, setSelectedProject] = React.useState<
    string | undefined
  >(undefined);
  const { toast } = useToast();

  // Handle Delete Records
  const handleDelete = async (id: string) => {
    try {
      await deleteWorkItem(id);
      toast({
        title: "Work Item Deleted",
        description: "Work Item has been deleted successfully",
      });

      window.location.reload();
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later...",
      });
    }
  };

  // Switch View between List and Splitted
  const switchView = () => {
    setView(view === "list" ? "splitted" : "list");
  };

  // Reset Filters of selected Project
  const resetFilters = () => {
    setSelectedProject(undefined);
  };

  const moveToNextMonth = () => {
    if (!dateRange || !dateRange.from || !dateRange.to) return;
    const newDateRange = {
      from: new Date(
          dateRange.from!.getFullYear(),
          dateRange.from.getMonth() + 1,
          dateRange.from.getDate()
      ),
      to: new Date(
          dateRange.to.getFullYear(),
          dateRange.to.getMonth() + 1,
          dateRange.to.getDate()
      ),
    };
    console.log("Updated to next month", dateRange, newDateRange)
    setDateRange(newDateRange);
  }

  const moveToPrevMonth = () => {
    if (!dateRange || !dateRange.from || !dateRange.to) return;
    const newDateRange = {
      from: new Date(
          dateRange.from!.getFullYear(),
          dateRange.from.getMonth() - 1,
          dateRange.from.getDate()
      ),
      to: new Date(
          dateRange.to.getFullYear(),
          dateRange.to.getMonth() - 1,
          dateRange.to.getDate()
      ),
    };
    setDateRange(newDateRange);
  }

  // Fetch Data
  useEffect(() => {
    getWorkItems().then((res) => {
      if (res.status) setWorkItems(res.data);
    });
    getProjects().then((res) => {
      if (res.status) setProjects(res.data);
    });
    getVacation().then((res) => {
      if (res.status) setVacations(res.data);
    });
  }, [selectedProject]);

  // Filter Data by Date Range and Selected Project for List View
  useEffect(() => {
    let _data = [...workItems];
    if (selectedProject) {
      _data = _data.filter((item) => item.projectID === selectedProject);
    }

    if (dateRange && dateRange.from && dateRange.to) {
      _data = filterWorkItemsByRange(_data, dateRange.from, dateRange.to);
    }

    setData(_data);
  }, [dateRange, selectedProject, workItems]);

  // Filter Data by Date Range and Selected Project for Splitted View
  useEffect(() => {
    if (!dateRange || !dateRange.from || !dateRange.to) return;

    let _data = [...workItems];
    if (selectedProject) {
      _data = _data.filter((item) => item.projectID === selectedProject);
    }

    const splitedData = splitTimesheetByDate(
      _data,
      dateRange.from,
      dateRange.to
    );
    setSplitedData(splitedData);
  }, [dateRange, selectedProject, workItems]);


  console.log("dateRange", dateRange)
  return (
    <div>
      <TimesheetHeader
        switchView={switchView}
        resetFilters={resetFilters}
        projects={projects}
        selectedProject={selectedProject}
        setDateRange={(date: DateRange) => {
          console.log("updating date range", date);
          setDateRange(date);
        }}
        setSelectedProject={setSelectedProject}
        view={view}
        dateRange={dateRange}
        moveToPrevMonth={moveToPrevMonth}
        moveToNextMonth={moveToNextMonth}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Task Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Assigned By</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Project Name</TableHead>
            <TableHead>Project Code</TableHead>
            <TableHead>Project DF</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {view === "list" && (
            <TimesheetTableView data={data} handleDelete={handleDelete} />
          )}

          {view === "splitted" && (
            <TimesheetSplittedTableView
              splitedData={splitedData}
              vacations={vacations}
              handleDelete={handleDelete}
            />
          )}
        </TableBody>
      </Table>
    </div>
  );
}
