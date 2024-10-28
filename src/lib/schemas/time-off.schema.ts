import { z } from "zod";
import { TimeOffType } from "../../types/time-off";

export const timeOffSchema = z.object({
  type: z.enum(['vacation', 'sick', 'personal', 'extra'] as const),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  reason: z.string().min(10, "Reason must be at least 10 characters"),
}).refine((data) => {
  return data.endDate >= data.startDate;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export type TimeOffFormData = z.infer<typeof timeOffSchema>;
