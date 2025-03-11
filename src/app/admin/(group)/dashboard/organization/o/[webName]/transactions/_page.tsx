// "use client";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import TransactionList from "@/components/transaction-list";
// // import CreateTransaction from "@/components/create-transaction";

// import { useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { formatCurrency } from "@/lib/utils";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// // import TransactionDetails from "./transaction-details";

// export default function Home() {
//   return (
//     <div className="container mx-auto py-10">
//       <h1 className="mb-6 text-3xl font-bold">Transaction Management</h1>

//       <Tabs defaultValue="list" className="w-full">
//         <TabsList className="grid w-full max-w-md grid-cols-2">
//           <TabsTrigger value="list">Transactions</TabsTrigger>
//           <TabsTrigger value="create">Create Transaction</TabsTrigger>
//         </TabsList>
//         <TabsContent value="list">
//           <TransactionList />
//         </TabsContent>
//         <TabsContent value="create">
//           <CreateTransaction />
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

// function TransactionList() {
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedTransaction, setSelectedTransaction] = useState(null);

//   // useEffect(() => {
//   //   const fetchTransactions = async () => {
//   //     try {
//   //       const response = await fetch("/api/transactions");
//   //       const data = await response.json();
//   //       setTransactions(data);
//   //     } catch (error) {
//   //       console.error("Error fetching transactions:", error);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchTransactions();
//   // }, []);

//   const getStatusBadge = (total, paid) => {
//     if (paid >= total) {
//       return <Badge className="bg-green-500">Paid</Badge>;
//     } else if (paid > 0) {
//       return <Badge className="bg-yellow-500">Partial</Badge>;
//     } else {
//       return <Badge className="bg-red-500">Unpaid</Badge>;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center p-8">Loading transactions...</div>
//     );
//   }

//   return (
//     <div className="rounded-md border">
//       <Table>
//         <TableCaption>List of all transactions</TableCaption>
//         <TableHeader>
//           <TableRow>
//             <TableHead>ID</TableHead>
//             <TableHead>Date</TableHead>
//             <TableHead>Total</TableHead>
//             <TableHead>Paid</TableHead>
//             <TableHead>Due</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {transactions.length === 0 ? (
//             <TableRow>
//               <TableCell colSpan={7} className="text-center">
//                 No transactions found
//               </TableCell>
//             </TableRow>
//           ) : (
//             transactions.map((transaction) => (
//               <TableRow key={transaction.id}>
//                 <TableCell className="font-medium">
//                   {transaction.id.substring(0, 8)}
//                 </TableCell>
//                 <TableCell>
//                   {new Date(transaction.createdAt).toLocaleDateString()}
//                 </TableCell>
//                 <TableCell>{formatCurrency(transaction.total)}</TableCell>
//                 <TableCell>{formatCurrency(transaction.paid)}</TableCell>
//                 <TableCell>{formatCurrency(transaction.due)}</TableCell>
//                 <TableCell>
//                   {getStatusBadge(transaction.total, transaction.paid)}
//                 </TableCell>
//                 <TableCell>
//                   <Dialog>
//                     <DialogTrigger asChild>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => setSelectedTransaction(transaction)}
//                       >
//                         View
//                       </Button>
//                     </DialogTrigger>
//                     <DialogContent className="max-w-3xl">
//                       <DialogHeader>
//                         <DialogTitle>Transaction Details</DialogTitle>
//                         <DialogDescription>
//                           View and manage transaction payments
//                         </DialogDescription>
//                       </DialogHeader>
//                       {selectedTransaction && (
//                         <TransactionDetails transaction={selectedTransaction} />
//                       )}
//                     </DialogContent>
//                   </Dialog>
//                 </TableCell>
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }

// const formSchema = z.object({
//   total: z.coerce
//     .number()
//     .positive("Total amount must be positive")
//     .min(0.01, "Total amount must be at least 0.01"),
//   organizationId: z.string().min(1, "Organization ID is required"),
// });
// function CreateTransaction() {
//   const router = useRouter();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       total: 0,
//       organizationId: "",
//     },
//   });

//   const onSubmit = async (values) => {
//     setIsSubmitting(true);
//     try {
//       const response = await fetch("/api/transactions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           total: values.total,
//           organizationId: values.organizationId,
//         }),
//       });

//       if (response.ok) {
//         form.reset();
//         router.refresh();
//         // Show success message or redirect
//         alert("Transaction created successfully!");
//       } else {
//         const error = await response.json();
//         throw new Error(error.message || "Failed to create transaction");
//       }
//     } catch (error) {
//       console.error("Error creating transaction:", error);
//       alert(
//         error.message || "An error occurred while creating the transaction",
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Card className="mx-auto w-full max-w-2xl">
//       <CardHeader>
//         <CardTitle>Create New Transaction</CardTitle>
//         <CardDescription>
//           Enter the details to create a new transaction
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             <FormField
//               control={form.control}
//               name="total"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Total Amount</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="number"
//                       step="0.01"
//                       placeholder="0.00"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormDescription>
//                     Enter the total amount for this transaction
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="organizationId"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Organization ID</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter organization ID" {...field} />
//                   </FormControl>
//                   <FormDescription>
//                     Enter the ID of the organization this transaction belongs to
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <Button type="submit" className="w-full" disabled={isSubmitting}>
//               {isSubmitting ? "Creating..." : "Create Transaction"}
//             </Button>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   );
// }
