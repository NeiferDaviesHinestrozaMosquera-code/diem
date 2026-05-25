import { z } from 'zod';

export const quoteRequestSchema = z.object({
  fullName: z.string().min(2, 'Nombre muy corto').max(100),
  email: z.string().email('Email inválido'),
  company: z.string().max(100).optional(),
  phone: z.string().min(7, 'Teléfono inválido').max(20),
  service: z.string().min(1, 'Selecciona un servicio'),
  projectDetails: z.string().min(10, 'Describe tu proyecto (mín. 10 caracteres)').max(5000),
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
