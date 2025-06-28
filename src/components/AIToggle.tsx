import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";

interface AIToggleProps {
  onChange: (enabled: boolean) => void;
  loading?: boolean;
}

const AIToggle: React.FC<AIToggleProps> = ({ onChange, loading = false }) => {
  const [enabled, setEnabled] = useState(false);

  const handleToggle = (checked: boolean) => {
    setEnabled(checked);
    onChange(checked);
  };

  return (
    <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg border border-blue-200">
      <div className="flex items-center space-x-2">
        <Switch
          id="ai-mode"
          checked={enabled}
          onCheckedChange={handleToggle}
          disabled={loading}
        />
        <Label htmlFor="ai-mode" className="cursor-pointer flex items-center">
          {loading ? (
            <Loader2 size={18} className="mr-2 animate-spin text-blue-600" />
          ) : (
            <Sparkles 
              size={18} 
              className={`mr-2 ${enabled ? 'text-blue-600' : 'text-gray-400'}`} 
            />
          )}
          <span>
            {loading ? "AI Processing..." : `AI Selection ${enabled ? "(Automatic)" : "(Manual)"}`}
          </span>
        </Label>
      </div>
      <div className="text-xs text-gray-500 ml-2">
        {loading 
          ? "OpenAI is analyzing and selecting the most relevant employees..." 
          : enabled 
            ? "AI will automatically select the most relevant employees" 
            : "Select employees manually by clicking on their cards"}
      </div>
    </div>
  );
};

export default AIToggle;
