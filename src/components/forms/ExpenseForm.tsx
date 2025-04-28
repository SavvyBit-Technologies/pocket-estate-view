
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Calendar, CreditCard, DollarSign, FileText, Tag } from "lucide-react";
import { apiService } from "@/services/api";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  description: z.string().min(2, "Description must be at least 2 characters"),
  amount: z.string().min(1, "Amount is required"),
  category: z.string().min(1, "Please select a category"),
  date: z.string(),
});

export function ExpenseForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split('T')[0],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await apiService.createExpense({
        description: values.description,
        amount: parseFloat(values.amount),
        category: values.category,
      });
      
      toast.success("Expense record added successfully!", {
        description: `₦${values.amount} for ${values.description}`,
      });
      
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["monthly-summary"] });
      
      form.reset();
    } catch (error) {
      toast.error("Failed to add expense", {
        description: error instanceof Error ? error.message : "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-red-500" /> 
            Record New Expense
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <FileText className="h-4 w-4 opacity-70" /> Description
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter expense description" 
                        {...field} 
                        className="resize-none min-h-[100px] focus-visible:ring-red-500" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 opacity-70" /> Amount (₦)
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" {...field} className="focus-visible:ring-red-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Tag className="h-4 w-4 opacity-70" /> Category
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="focus-visible:ring-red-500">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="repairs">Repairs</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 opacity-70" /> Date
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="focus-visible:ring-red-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full bg-red-500 hover:bg-red-600 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding Expense..." : "Add Expense Record"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
