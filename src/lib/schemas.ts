import { z } from 'zod'

export const onboardingSchema = z.object({
  characterName: z.string().min(2, "Name must be at least 2 characters").max(30),
  kingdomName: z.string().min(2, "Kingdom name must be at least 2 characters").max(40),
  class: z.enum(['scholar', 'warrior', 'builder', 'commander']),
  companionName: z.string().min(2).max(20).default('Aegis'),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})
