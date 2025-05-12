
import React, { useState } from "react";
import { Item, Person } from "@/pages/Index";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface BillSummaryProps {
  people: Person[];
  items: Item[];
}

const BillSummary: React.FC<BillSummaryProps> = ({ people, items }) => {
  const [taxRate, setTaxRate] = useState<number>(0);
  const [showTax, setShowTax] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const calculateTotalBill = (): number => {
    return items.reduce((sum, item) => sum + item.price, 0);
  };

  const calculateTax = (amount: number): number => {
    return amount * (taxRate / 100);
  };

  const calculateTotalWithTax = (): number => {
    const subtotal = calculateTotalBill();
    return subtotal + calculateTax(subtotal);
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

  const calculatePersonTotalWithTax = (personId: string): number => {
    const subtotal = calculatePersonTotal(personId);
    return subtotal + calculateTax(subtotal);
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

  const handleTaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setTaxRate(isNaN(value) ? 0 : value);
  };

  const toggleTax = () => {
    setShowTax(!showTax);
  };

  const generateBillSummaryText = (): string => {
    let summary = "BILL SUMMARY\n";
    summary += "==============\n\n";
    summary += `Subtotal: ${formatCurrency(calculateTotalBill())} (${getTotalItemCount()} items)\n`;
    
    if (showTax) {
      summary += `Tax Rate: ${taxRate}%\n`;
      summary += `Total with Tax: ${formatCurrency(calculateTotalWithTax())}\n`;
    }
    
    summary += "\nITEMS:\n";
    items.forEach(item => {
      const assignedNames = item.assignedTo.map(id => {
        const person = people.find(p => p.id === id);
        return person ? person.name : "Unknown";
      }).join(", ");
      
      summary += `- ${item.name}: ${formatCurrency(item.price)} (${assignedNames})\n`;
    });
    
    summary += "\nPER PERSON:\n";
    people.forEach(person => {
      const subtotal = calculatePersonTotal(person.id);
      summary += `- ${person.name}: ${formatCurrency(subtotal)}`;
      if (showTax) {
        summary += ` (with tax: ${formatCurrency(calculatePersonTotalWithTax(person.id))})`;
      }
      summary += "\n";
    });
    
    return summary;
  };

  const copyToClipboard = () => {
    const billText = generateBillSummaryText();
    navigator.clipboard.writeText(billText).then(() => {
      setCopied(true);
      toast({
        title: "Success",
        description: "Bill summary copied to clipboard",
      });
      
      // Reset copied state after a delay
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }).catch(err => {
      toast({
        title: "Error",
        description: "Failed to copy bill summary",
        variant: "destructive",
      });
      console.error("Failed to copy bill summary:", err);
    });
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
      <div className="flex justify-between mb-2 items-center">
        <div>
          <h3 className="text-xl font-semibold">Subtotal</h3>
          <p className="text-gray-600 text-sm">{getTotalItemCount()} items</p>
        </div>
        <div className="text-2xl font-bold">
          {formatCurrency(calculateTotalBill())}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <Button 
          variant="secondary" 
          className="text-sm" 
          onClick={toggleTax}
        >
          {showTax ? "Hide Tax" : "Add Tax"}
        </Button>
        
        {showTax && (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={taxRate}
              onChange={handleTaxRateChange}
              className="w-20 text-right"
            />
            <span className="text-sm">%</span>
          </div>
        )}
      </div>

      {showTax && (
        <div className="flex justify-between mb-6 items-center">
          <div>
            <h3 className="text-xl font-semibold">Total with Tax</h3>
          </div>
          <div className="text-2xl font-bold">
            {formatCurrency(calculateTotalWithTax())}
          </div>
        </div>
      )}

      {people.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Person</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
              {showTax && <TableHead className="text-right">With Tax</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {people.map((person) => {
              const subtotal = calculatePersonTotal(person.id);
              const totalWithTax = calculatePersonTotalWithTax(person.id);
              return (
                <TableRow key={person.id}>
                  <TableCell className="font-medium">{person.name}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(subtotal)}
                  </TableCell>
                  {showTax && (
                    <TableCell className="text-right">
                      {formatCurrency(totalWithTax)}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      
      <div className="mt-4 flex justify-end">
        <Button 
          variant="outline" 
          onClick={copyToClipboard} 
          className="flex gap-2 items-center"
          disabled={copied}
        >
          {copied ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy Bill Summary
            </>
          )}
        </Button>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Each item is split equally among the people assigned to it.</p>
        {showTax && <p>Tax is calculated as {taxRate}% of each person's subtotal.</p>}
      </div>
    </div>
  );
};

export default BillSummary;
