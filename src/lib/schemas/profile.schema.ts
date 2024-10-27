import { z } from "zod";

export const profileSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  personalInfo: z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
    dateOfBirth: z.date().nullable(),
    address: z.string().min(5, "Address must be at least 5 characters"),
  }),
  emergencyContact: z.object({
    name: z.string().min(2, "Contact name must be at least 2 characters"),
    relationship: z.string().min(2, "Relationship must be at least 2 characters"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
  }),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
