
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  tenant: z.string().min(1, "Please select a tenant"),
  payment_due_id: z.string().min(1, "Please select a payment issue"),
  amount: z.string().min(1, "Amount is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
});

export default function CreatePayment() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch tenants
  const { data: tenantsData, isLoading: isLoadingTenants } = useQuery({
    queryKey: ["tenants"],
    queryFn: apiService.fetchTenants,
  });

  // Fetch payment issues using the new endpoint
  const { data: issuesData, isLoading: isLoadingIssues } = useQuery({
    queryKey: ["paymentIssues"],
    queryFn: apiService.fetchPaymentIssues,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenant: "",
      payment_due_id: "",
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().split('T')[0],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await apiService.createPayment({
        tenant: parseInt(values.tenant),
        payment_due_id: parseInt(values.payment_due_id),
        amount: parseFloat(values.amount),
        category: values.category,
        issue: parseInt(values.payment_due_id),
        description: values.description,
        date: values.date,
      });
      
      toast.success("Payment created successfully");
      navigate("/dashboard/transactions");
    } catch (error) {
      console.error("Failed to create payment:", error);
      toast.error("Failed to create payment", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Safe rendering of tenant items with null checks
  const renderTenantItems = () => {
    if (!tenantsData || !tenantsData.tenants || !Array.isArray(tenantsData.tenants)) {
      return <SelectItem value="loading">No tenants available</SelectItem>;
    }

    return tenantsData.tenants.map((tenant) => {
      if (!tenant || typeof tenant !== 'object' || tenant.tenant_id === undefined) {
        return null;
      }
      
      const id = String(tenant.tenant_id);
      const name = tenant.full_name || "Unknown Tenant";
      
      return (
        <SelectItem key={id} value={id}>
          {name}
        </SelectItem>
      );
    });
  };

  // Safe rendering of payment issue items with null checks
  const renderIssueItems = () => {
    if (!issuesData || !Array.isArray(issuesData)) {
      return <SelectItem value="loading">No payment issues available</SelectItem>;
    }

    return issuesData.map((issue) => {
      if (!issue || typeof issue !== 'object' || issue.id === undefined) {
        return null;
      }
      
      const id = String(issue.id);
      const title = issue.title || "Unknown Issue";
      const amount = typeof issue.amount === 'number' ? issue.amount.toString() : '0';
      
      return (
        <SelectItem key={id} value={id}>
          {title} - ₦{amount}
        </SelectItem>
      );
    });
  };

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="tenant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tenant</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoadingTenants}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingTenants ? "Loading tenants..." : "Select a tenant"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {renderTenantItems()}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payment_due_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Issue</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoadingIssues}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingIssues ? "Loading payment issues..." : "Select a payment issue"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {renderIssueItems()}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
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
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Rent, Security Fee" {...field} />
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
                      <Input placeholder="Payment description" {...field} />
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
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting || isLoadingTenants || isLoadingIssues}>
                {isSubmitting ? "Creating Payment..." : "Create Payment"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
