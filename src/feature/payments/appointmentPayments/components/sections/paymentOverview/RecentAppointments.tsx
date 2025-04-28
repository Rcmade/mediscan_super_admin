"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { PaymentOverviewResponseT } from "../../../types";

interface RecentAppointmentsProps {
  stats: PaymentOverviewResponseT["recentAppointments"];
}
export function RecentAppointments({ stats }: RecentAppointmentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Appointments</CardTitle>
        <CardDescription>Latest patient appointments</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell className="font-medium">
                  {appointment.patientName}
                </TableCell>
                <TableCell>
                  {format(new Date(appointment.date), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>{appointment.reason}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      appointment.status === "Completed"
                        ? "success"
                        : appointment.status === "Scheduled"
                          ? "default"
                          : "destructive"
                    }
                  >
                    {appointment.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      appointment.paymentStatus === "PAID"
                        ? "success"
                        : appointment.paymentStatus === "PENDING"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {appointment.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  ${appointment.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
