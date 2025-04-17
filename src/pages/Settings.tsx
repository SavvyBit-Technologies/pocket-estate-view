
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";

export function Settings() {
  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="p-6 space-y-6 md:ml-64">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="estate-name">Estate Name</Label>
              <Input id="estate-name" placeholder="Enter estate name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Input id="currency" placeholder="₦" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Enable Email Notifications</Label>
              <Switch id="notifications" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment-due">Payment Due Day</Label>
              <Input id="payment-due" type="number" min="1" max="31" placeholder="e.g., 5" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-reminders">Automatic Payment Reminders</Label>
              <Switch id="auto-reminders" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Settings;
