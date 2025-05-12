
import React from "react";
import { Item, Person } from "@/pages/Index";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface BillSummaryProps {
  people: Person[];
  items: Item[];
}

const BillSummary: React.FC<BillSummaryProps> = ({ people, items }) => {
  const calculateTotalBill = (): number => {
    return items.reduce((sum, item) => sum + item.price, 0);
  };

  const calculatePersonTotal = (personId: string): number => {
    return items.reduce((total, item) => {
      if (item.assignedTo.includes(personId)) {
        // Split the item price equally among all assignees
        return total + (item.price / item.assignedTo.length);
      }
      return total;
    }, 0);
  };
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getTotalItemCount = (): number => {
    return items.length;
  };

  if (people.length === 0 && items.length === 0) {
    return (
      <div className="text-center text-gray-500 py-6">
        Add people and items to see the bill summary
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between mb-6 items-center">
        <div>
          <h3 className="text-xl font-semibold">Total</h3>
          <p className="text-gray-600 text-sm">{getTotalItemCount()} items</p>
        </div>
        <div className="text-2xl font-bold">
          {formatCurrency(calculateTotalBill())}
        </div>
      </div>

      {people.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Person</TableHead>
              <TableHead className="text-right">Amount to Pay</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {people.map((person) => {
              const total = calculatePersonTotal(person.id);
              return (
                <TableRow key={person.id}>
                  <TableCell className="font-medium">{person.name}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(total)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Each item is split equally among the people assigned to it.</p>
      </div>
    </div>
  );
};

export default BillSummary;
