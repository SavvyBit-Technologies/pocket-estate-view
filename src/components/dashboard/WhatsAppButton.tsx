
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WhatsAppButton() {
  return (
    <Button
      className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-green-500 hover:bg-green-600 shadow-lg"
      size="icon"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
}
