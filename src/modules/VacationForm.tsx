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
import { useToast } from "@/components/ui/use-toast";
import { VacationType, addVacation, updateVacation } from "@/database/vacation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  type: z.string().min(1, {
    message: "Select Type",
  }),
  date: z.date(),
});

interface VacationFormProps {
  type?: VacationType;
  date?: Date;
  id?: string;
}

export default function VacationForm(props: VacationFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      date: new Date(),
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      if (props.id) {
        await updateVacation({
          id: props.id,
          type: values.type as VacationType,
          date: values.date,
        });
        toast({
          title: "Vacation Updated",
          description: "Vacation has been updated successfully",
        });
      } else {
        await addVacation({
          type: values.type as VacationType,
          date: values.date,
        });
        toast({
          title: "Vacation Added",
          description: "Vacation has been added successfully",
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
    if (props.id)
      form.reset({
        type: props.type!,
        date: props.date!,
      });
  }, [props.id]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...field}
                >
                  <option value="">Select Type</option>
                  <option value="annual">Annual</option>
                  <option value="sick">Sick</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="holiday">Holiday</option>
                </select>
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
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Loading..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
