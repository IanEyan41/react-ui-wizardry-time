
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Item, Person } from "@/pages/Index";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ItemsSectionProps {
  items: Item[];
  people: Person[];
  onAddItem: (name: string, price: number, assignedTo: string[]) => void;
  onRemoveItem: (id: string) => void;
}

const ItemsSection: React.FC<ItemsSectionProps> = ({
  items,
  people,
  onAddItem,
  onRemoveItem,
}) => {
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);

  const handleAddItem = () => {
    const price = parseFloat(newItemPrice);
    if (newItemName.trim() && !isNaN(price) && price > 0 && selectedPeople.length > 0) {
      onAddItem(newItemName, price, selectedPeople);
      setNewItemName("");
      setNewItemPrice("");
      setSelectedPeople([]);
    }
  };

  const togglePersonSelection = (personId: string) => {
    setSelectedPeople(prev => 
      prev.includes(personId)
        ? prev.filter(id => id !== personId)
        : [...prev, personId]
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div>
      <div className="space-y-3 mb-6">
        <div>
          <Label htmlFor="item-name">Item</Label>
          <Input
            id="item-name"
            placeholder="Enter item"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="item-price">Price ($)</Label>
          <Input
            id="item-price"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={newItemPrice}
            onChange={(e) => setNewItemPrice(e.target.value)}
          />
        </div>
        
        <div>
          <Label className="block mb-2">Assigned to</Label>
          {people.length === 0 ? (
            <div className="text-sm text-gray-500">
              Add people first before assigning items
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {people.map((person) => (
                <div key={person.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`person-${person.id}`}
                    checked={selectedPeople.includes(person.id)}
                    onCheckedChange={() => togglePersonSelection(person.id)}
                  />
                  <Label
                    htmlFor={`person-${person.id}`}
                    className={cn(
                      "text-sm",
                      selectedPeople.includes(person.id) && "font-medium"
                    )}
                  >
                    {person.name}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <Button
          onClick={handleAddItem}
          disabled={
            !newItemName.trim() || 
            !newItemPrice || 
            isNaN(parseFloat(newItemPrice)) || 
            parseFloat(newItemPrice) <= 0 || 
            selectedPeople.length === 0 ||
            people.length === 0
          }
          className="w-full mt-2"
        >
          Add Item
        </Button>
      </div>
      
      {items.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          No items added yet. Add items to split!
        </div>
      ) : (
        <ul className="space-y-2 max-h-[300px] overflow-y-auto">
          {items.map((item) => (
            <li 
              key={item.id} 
              className="flex justify-between bg-gray-100 p-3 rounded"
            >
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-600">
                  {formatCurrency(item.price)} • Split between {item.assignedTo.length} {item.assignedTo.length === 1 ? 'person' : 'people'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {item.assignedTo.map(id => 
                    people.find(p => p.id === id)?.name
                  ).filter(Boolean).join(', ')}
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onRemoveItem(item.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ItemsSection;
