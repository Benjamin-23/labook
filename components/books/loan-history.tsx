// components/books/loan-history.tsx
import { formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface LoanHistoryProps {
  loans: any[];
}

export function LoanHistory({ loans }: LoanHistoryProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Borrower</TableHead>
          <TableHead>Checkout Date</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Return Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loans.map((loan) => (
          <TableRow key={loan.id}>
            <TableCell className="font-medium">
              {loan.users.full_name}
              <div className="text-xs text-muted-foreground">{loan.users.email}</div>
            </TableCell>
            <TableCell>{formatDate(loan.checkout_date)}</TableCell>
            <TableCell>{formatDate(loan.due_date)}</TableCell>
            <TableCell>{loan.return_date ? formatDate(loan.return_date) : "Not returned"}</TableCell>
            <TableCell>
              <Badge
                variant={
                  loan.status === "active"
                    ? "default"
                    : loan.status === "overdue"
                    ? "destructive"
                    : "outline"
                }
              >
                {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
