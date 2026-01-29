import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSettings, useUpdateSettings } from "@/hooks/use-settings";
import { insertSettingsSchema } from "@shared/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Bell } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// Only validating email + notification boolean
const formSchema = insertSettingsSchema.pick({
  emailNotifications: true,
  notificationEmail: true,
});

type FormValues = z.infer<typeof formSchema>;

export default function Settings() {
  const { data: settings, isLoading } = useSettings();
  const { mutate: updateSettings, isPending } = useUpdateSettings();
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailNotifications: false,
      notificationEmail: "",
    },
  });

  // Populate form once data is loaded
  useEffect(() => {
    if (settings) {
      form.reset({
        emailNotifications: settings.emailNotifications,
        notificationEmail: settings.notificationEmail || user?.email || "",
      });
    } else if (user?.email) {
      form.setValue("notificationEmail", user.email);
    }
  }, [settings, user, form]);

  const onSubmit = (data: FormValues) => {
    updateSettings(data, {
      onSuccess: () => {
        toast({
          title: "Settings Saved",
          description: "Your notification preferences have been updated.",
        });
      },
      onError: (err) => {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8 pb-10">
      <div>
        <h2 className="text-3xl font-display font-bold">Notification Settings</h2>
        <p className="text-muted-foreground">Manage how you receive alerts from CandleAlert.</p>
      </div>

      <div className="glass-panel p-8 rounded-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="emailNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border/50 bg-black/20 p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-bold flex items-center gap-2">
                      <Bell className="w-4 h-4 text-primary" />
                      Email Alerts
                    </FormLabel>
                    <FormDescription>
                      Receive instant emails when a Buy or Sell signal triggers.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notificationEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notification Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="you@example.com" 
                      {...field} 
                      value={field.value || ""}
                      className="bg-background border-border/50 focus:border-primary h-12"
                    />
                  </FormControl>
                  <FormDescription>
                    The email address where alerts will be sent.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={isPending}
              className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 rounded-xl text-base font-semibold"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" /> Save Preferences
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
