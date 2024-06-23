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
import { useToast } from "@/components/ui/use-toast";
import { ProjectsList, deleteProject, getProjects } from "@/database/projects";
import { WorkItemsList, getWorkItems } from "@/database/work-items";
import { filterWorkItemsByRange } from "@/helpers/filterWorkItemsByRange";
import ProjectForm from "@/modules/ProjectForm";
import { PencilRuler, Plus, Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import { DateRange } from "react-day-picker";

type ProjectsWithDuration = ProjectsList & { duration: number };

export default function ProjectsPage() {
  const [data, setData] = React.useState<ProjectsWithDuration[]>([]);
  const [dateRange, setDateRange] = React.useState<DateRange | null>(null);
  const [projects, setProjects] = React.useState<ProjectsWithDuration[]>([]);
  const [workItems, setWorkItems] = React.useState<WorkItemsList[]>([]);
  const { toast } = useToast();

  // Hanlde delete project
  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
      toast({
        title: "Project Deleted",
        description: "Project has been deleted successfully",
      });
      window.location.reload();
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later...",
      });
    }
  };

  // Fetch Projects
  useEffect(() => {
    getProjects().then((res) => {
      if (res.status) {
        setProjects(res.data.map((project) => ({ ...project, duration: 0 })));
      }
    });
    getWorkItems().then((res) => {
      if (res.status) setWorkItems(res.data);
    });
  }, []);

  // Filter Data by Date Range if selected and if not show all
  useEffect(() => {
    const _data: ProjectsWithDuration[] = [];

    if (dateRange && dateRange.from && dateRange.to) {
      const filteredWorkItems = filterWorkItemsByRange(
        workItems,
        dateRange.from,
        dateRange.to
      );

      projects.forEach((project) => {
        // Calculate the duration of the project
        const duration = filteredWorkItems
          .filter((workitem) => workitem.projectID === project.id)
          .reduce((acc, workitem) => acc + workitem.duration, 0);

        _data.push({ ...project, duration });
      });
    } else {
      _data.push(...projects);
    }

    setData(_data);
  }, [dateRange, projects, workItems]);

  return (
    <div>
      <header className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold">Projects</h1>
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
                <ProjectForm />
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>DF</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.code}</TableCell>
              <TableCell>{item.df}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.duration}</TableCell>
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
                      <ProjectForm {...item} />
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
