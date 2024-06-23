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
import { addProject, updateProject } from "@/database/projects";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(3).max(255),
  code: z.string().min(1).max(255),
  df: z.string().min(1).max(255),
  description: z.string(),
});

interface ProjectFormProps {
  id?: string;
  name?: string;
  code?: string;
  df?: string;
  description?: string;
}

export default function ProjectForm(props: ProjectFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      df: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (props.id) {
        // Update the record.
        await updateProject({
          id: props.id,
          name: values.name,
          code: values.code,
          df: values.df,
          description: values.description,
        });

        toast({
          title: "Project Updated",
          description: "Project has been updated successfully",
        });
      } else {
        // Add a new record.
        await addProject({
          name: values.name,
          code: values.code,
          df: values.df,
          description: values.description,
        });

        toast({
          title: "Project Added",
          description: "Project has been added successfully",
        });
      }

      window.location.reload();
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later...",
      });
    }
  }

  useEffect(() => {
    if (props.id)
      form.reset({
        name: props.name!,
        code: props.code!,
        df: props.df!,
        description: props.description!,
      });
  }, [props.id]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input placeholder="Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="df"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DF</FormLabel>
              <FormControl>
                <Input placeholder="DF" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
