import { DatePicker } from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ProjectsList, getProjects } from "@/database/projects";
import {
  WorkItemDuration,
  addWorkItem,
  updateWorkItem,
} from "@/database/work-items";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  taskDescription: z.string().min(3).max(255),
  date: z.date(),
  assignedBy: z.string().min(3).max(255),
  duration: z.string().regex(/^(0|0\.25|0\.5|0\.75|1)$/),
  projectId: z.string().min(1, {
    message: "Please select a project",
  }),
});

interface TimesheetFormProps {
  taskDescription?: string;
  date?: Date;
  assignedBy?: string;
  duration?: number;
  projectId?: string;
  id?: string;
}

export default function TimesheetForm(props: TimesheetFormProps) {
  const [projects, setProjects] = React.useState<ProjectsList[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskDescription: "",
      date: new Date(),
      assignedBy: "",
      duration: "0",
      projectId: "",
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      if (props.id) {
        await updateWorkItem({
          id: props.id,
          taskDescription: values.taskDescription,
          date: values.date,
          assignedBy: values.assignedBy,
          duration: parseFloat(values.duration) as WorkItemDuration,
          projectID: values.projectId,
        });

        toast({
          title: "Work Item Updated",
          description: "Work Item has been updated successfully",
        });
      } else {
        await addWorkItem({
          taskDescription: values.taskDescription,
          date: values.date,
          assignedBy: values.assignedBy,
          duration: parseFloat(values.duration) as WorkItemDuration,
          projectID: values.projectId,
        });

        toast({
          title: "Work Item Added",
          description: "Work Item has been added successfully",
        });
      }

      window.location.reload();
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later...",
      });
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getProjects().then((res) => {
      if (res.status) setProjects(res.data);
    });
  }, []);

  useEffect(() => {
    if (props.id)
      form.reset({
        taskDescription: props.taskDescription!,
        date: props.date!,
        assignedBy: props.assignedBy!,
        duration: props.duration!.toString(),
        projectId: props.projectId!,
      });
  }, [props.id]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="taskDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Description</FormLabel>
              <FormControl>
                <Input placeholder="Type Task Description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <DatePicker placeholder="Pick a date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="assignedBy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned By</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...field}
                >
                  <option value="0">0</option>
                  <option value="0.25">0.25</option>
                  <option value="0.5">0.5</option>
                  <option value="0.75">0.75</option>
                  <option value="1">1</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project</FormLabel>
              <FormControl>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...field}
                >
                  <option value="">Select Project...</option>
                  {projects.map((el) => (
                    <option key={el.id} value={el.id}>
                      {el.name} - {el.df}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Loading..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
