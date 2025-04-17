
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export function WhatsAppButton() {
  const [isHovering, setIsHovering] = useState(false);
  
  const handleClick = () => {
    toast.success("WhatsApp reminder feature coming soon!", {
      description: "This will allow you to send payment reminders to tenants.",
    });
  };

  return (
    <div className="fixed bottom-6 right-6">
      {isHovering && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 mb-2 text-sm animate-fade-in">
          Send payment reminder
        </div>
      )}
      <Button
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="rounded-full w-14 h-14 bg-green-500 hover:bg-green-600 shadow-lg transition-all duration-200 hover:scale-105"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
}
