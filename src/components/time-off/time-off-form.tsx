'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TimeOffFormData, timeOffSchema } from "../../lib/schemas/time-off.schema";
import { Button } from "../../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "../../../components/ui/calendar";
import { cn } from "../../lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "../../../hooks/use-toast";
import { useAuth } from "../../lib/context/auth-context";
import { addDays, differenceInBusinessDays } from "date-fns";
import { createTimeOffRequest, getOverlappingTimeOffRequests } from '../../lib/firebase/time-off';
import { Timestamp } from 'firebase/firestore';

const timeOffTypes = [
  { value: 'vacation', label: 'Vacation' },
  { value: 'sick', label: 'Sick Leave' },
  { value: 'personal', label: 'Personal' },
  { value: 'extra', label: 'Extra Work Days' },
] as const;

export function TimeOffForm() {
  const { userProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<TimeOffFormData>({
    resolver: zodResolver(timeOffSchema),
    defaultValues: {
      type: 'vacation',
      reason: '',
    },
  });

  const startDate = form.watch('startDate');
  const endDate = form.watch('endDate');

  const businessDays = startDate && endDate 
    ? differenceInBusinessDays(endDate, startDate) + 1
    : 0;

  async function onSubmit(data: TimeOffFormData) {
    try {
      setIsSubmitting(true);

      if (!userProfile) {
        throw new Error("User profile not found");
      }

      // Check for overlapping requests
      const overlapping = await getOverlappingTimeOffRequests(
        data.startDate,
        data.endDate,
        userProfile.uid
      );


      if (overlapping.length > 0) {
        toast({
          title: "Overlapping request",
          description: "You already have a time off request for these dates.",
          variant: "destructive",
        });
        return;
      }

      const timeOffData = {
        type: data.type,
        startDate: Timestamp.fromDate(data.startDate),
        endDate: Timestamp.fromDate(data.endDate),
        reason: data.reason,
        status: 'pending',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        userId: userProfile.uid,
      };


      await createTimeOffRequest(userProfile.uid, timeOffData);

      toast({
        title: "Request submitted",
        description: "Your time off request has been submitted for approval.",
      });
      form.reset();
    } catch (error) {
      console.error('Error submitting time off request:', error);
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: `Error: ${error.message}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "There was an error submitting your request.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div suppressHydrationWarning>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Time Off Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Leave</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type of leave" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeOffTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date > addDays(new Date(), 365)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < (startDate || new Date()) ||
                              date > addDays(startDate || new Date(), 365)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {startDate && endDate && (
                <div className="text-sm text-muted-foreground">
                  Duration: {businessDays} business day{businessDays !== 1 ? 's' : ''}
                </div>
              )}

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide a reason for your time off request"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
