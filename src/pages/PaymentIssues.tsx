
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, List, RefreshCw } from "lucide-react";
import { apiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PaymentIssue {
  id: number;
  estate: number;
  title: string;
  amount: string;
  description: string;
  date_issued: string;
}

export function PaymentIssues() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch payment issues
  const { 
    data: issues, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ["paymentIssues"],
    queryFn: apiService.fetchPaymentIssues,
  });

  // Mutation for resolving issues
  const resolveIssueMutation = useMutation({
    mutationFn: (issueId: number) => apiService.resolvePaymentIssue(issueId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payment issue has been resolved.",
      });
      // Refresh the issues list
      queryClient.invalidateQueries({ queryKey: ["paymentIssues"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to resolve issue: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleResolveIssue = (issueId: number) => {
    resolveIssueMutation.mutate(issueId);
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Issues</h1>
          <p className="text-muted-foreground mt-1">
            Manage and resolve pending payment issues.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="flex gap-2"
        >
          <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" /> Issue List
          </CardTitle>
          <CardDescription>
            All pending payment issues that require attention.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center p-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading payment issues...</p>
            </div>
          ) : isError ? (
            <div className="text-center p-6 text-red-500">
              <p>Error loading payment issues: {error instanceof Error ? error.message : "Unknown error"}</p>
              <Button variant="outline" onClick={() => refetch()} className="mt-2">
                Try Again
              </Button>
            </div>
          ) : issues && issues.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Date Issued</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issues.map((issue: PaymentIssue) => (
                    <TableRow key={issue.id}>
                      <TableCell className="font-medium">{issue.title}</TableCell>
                      <TableCell className="hidden md:table-cell">{new Date(issue.date_issued).toLocaleDateString()}</TableCell>
                      <TableCell>₦{parseFloat(issue.amount).toLocaleString()}</TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs truncate">
                        {issue.description}
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          className="flex items-center gap-1" 
                          onClick={() => handleResolveIssue(issue.id)}
                          disabled={resolveIssueMutation.isPending && resolveIssueMutation.variables === issue.id}
                        >
                          <Check className="h-4 w-4" />
                          Resolve
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center p-8">
              <p className="text-muted-foreground">No payment issues found.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <p className="text-sm text-muted-foreground">
            Total issues: {issues?.length || 0}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default PaymentIssues;
