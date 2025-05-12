
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PeopleSection from "@/components/PeopleSection";
import ItemsSection from "@/components/ItemsSection";
import BillSummary from "@/components/BillSummary";
import { toast } from "@/components/ui/use-toast";

export interface Person {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  assignedTo: string[];
}

const Index = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  const addPerson = (name: string) => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name",
        variant: "destructive",
      });
      return;
    }
    
    const newPerson: Person = {
      id: crypto.randomUUID(),
      name: name.trim(),
    };
    
    setPeople([...people, newPerson]);
    toast({
      title: "Success",
      description: `${name} has been added to the group`,
    });
  };

  const removePerson = (id: string) => {
    setPeople(people.filter(person => person.id !== id));
    // Also remove this person from any assigned items
    setItems(items.map(item => ({
      ...item,
      assignedTo: item.assignedTo.filter(personId => personId !== id)
    })));
  };

  const addItem = (name: string, price: number, assignedTo: string[]) => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter an item name",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(price) || price <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    if (assignedTo.length === 0) {
      toast({
        title: "Error",
        description: "Please assign this item to at least one person",
        variant: "destructive",
      });
      return;
    }

    const newItem: Item = {
      id: crypto.randomUUID(),
      name: name.trim(),
      price,
      assignedTo,
    };

    setItems([...items, newItem]);
    toast({
      title: "Success",
      description: `${name} has been added to the bill`,
    });
  };

  const editItem = (id: string, name: string, price: number, assignedTo: string[]) => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter an item name",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(price) || price <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    if (assignedTo.length === 0) {
      toast({
        title: "Error",
        description: "Please assign this item to at least one person",
        variant: "destructive",
      });
      return;
    }

    setItems(items.map(item => 
      item.id === id 
        ? { ...item, name, price, assignedTo } 
        : item
    ));

    toast({
      title: "Success",
      description: `${name} has been updated`,
    });
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const resetAll = () => {
    if (people.length > 0 || items.length > 0) {
      setPeople([]);
      setItems([]);
      toast({
        title: "Success",
        description: "Bill has been reset",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Split Bill App</h1>
          <p className="text-gray-600">Add people, enter items, and split the bill fairly</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>People</CardTitle>
            </CardHeader>
            <CardContent>
              <PeopleSection 
                people={people} 
                onAddPerson={addPerson} 
                onRemovePerson={removePerson}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent>
              <ItemsSection 
                items={items}
                people={people}
                onAddItem={addItem}
                onRemoveItem={removeItem}
                onEditItem={editItem}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Bill Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <BillSummary 
                people={people}
                items={items}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 text-center">
          <Button 
            variant="destructive" 
            onClick={resetAll}
            disabled={people.length === 0 && items.length === 0}
          >
            Reset Bill
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
