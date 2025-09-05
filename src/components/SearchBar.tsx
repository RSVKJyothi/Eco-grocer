import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Leaf } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearch, placeholder = "Search for fresh groceries..." }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-20 h-12 bg-card border-border/30 focus:border-primary shadow-sm"
        />
        <Button
          type="submit"
          variant="eco"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 gap-1"
        >
          <Leaf className="h-3 w-3" />
          Find
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;