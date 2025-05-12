
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Person } from "@/pages/Index";
import { X } from "lucide-react";

interface PeopleSectionProps {
  people: Person[];
  onAddPerson: (name: string) => void;
  onRemovePerson: (id: string) => void;
}

const PeopleSection: React.FC<PeopleSectionProps> = ({ 
  people, 
  onAddPerson,
  onRemovePerson 
}) => {
  const [newPersonName, setNewPersonName] = useState("");

  const handleAddPerson = () => {
    if (newPersonName.trim()) {
      onAddPerson(newPersonName);
      setNewPersonName("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddPerson();
    }
  };

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        <Input
          placeholder="Enter name"
          value={newPersonName}
          onChange={(e) => setNewPersonName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button onClick={handleAddPerson}>Add</Button>
      </div>

      {people.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          No people added yet. Add people to split the bill with!
        </div>
      ) : (
        <ul className="space-y-2">
          {people.map((person) => (
            <li 
              key={person.id} 
              className="flex items-center justify-between bg-gray-100 p-2 rounded"
            >
              <span>{person.name}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onRemovePerson(person.id)}
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

export default PeopleSection;
