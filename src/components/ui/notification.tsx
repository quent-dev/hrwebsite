'use client';

import { useEffect } from "react";
import { useToast } from "../../../hooks/use-toast";

interface NotificationProps {
  title: string;
  description: string;
  variant?: "default" | "destructive";
}

export function Notification({ title, description, variant = "default" }: NotificationProps) {
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title,
      description,
      variant,
    });
  }, [title, description, variant, toast]);

  return null; // This component doesn't render anything itself
}
