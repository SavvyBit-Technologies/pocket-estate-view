
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Calendar, CreditCard, DollarSign, Tag, User } from "lucide-react";
import { apiService } from "@/services/api";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  amount: z.string().min(1, "Amount is required"),
  description: z.string().min(2, "Description is required"),
  date: z.string(),
});

export function IncomeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split('T')[0],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await apiService.createPaymentIssue({
        title: values.title,
        amount: parseFloat(values.amount),
        description: values.description,
      });
      
      toast.success("Payment issue created successfully!", {
        description: `₦${values.amount} for ${values.title}`,
      });
      
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["payment-issues"] });
      
      form.reset();
    } catch (error) {
      toast.error("Failed to create payment issue", {
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
            <CreditCard className="h-5 w-5 text-green-500" /> 
            Create Payment Issue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <User className="h-4 w-4 opacity-70" /> Payment Title
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Security Fee - May" {...field} className="focus-visible:ring-green-500" />
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
                      <Input type="number" placeholder="0.00" {...field} className="focus-visible:ring-green-500" />
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
                    <FormLabel className="flex items-center gap-1">
                      <Tag className="h-4 w-4 opacity-70" /> Description
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter payment description" {...field} className="focus-visible:ring-green-500" />
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
                    <FormLabel className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 opacity-70" /> Date
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="focus-visible:ring-green-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full bg-green-500 hover:bg-green-600 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Payment Issue..." : "Create Payment Issue"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
