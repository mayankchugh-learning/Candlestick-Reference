import { z } from 'zod';
import { insertStockSchema, insertAlertSchema, insertSettingsSchema, stocks, alerts, settings } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  stocks: {
    list: {
      method: 'GET' as const,
      path: '/api/stocks',
      input: z.object({
        search: z.string().optional(),
        signal: z.enum(['BUY', 'SELL', 'NONE']).optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof stocks.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/stocks/:symbol',
      responses: {
        200: z.custom<typeof stocks.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  alerts: {
    list: {
      method: 'GET' as const,
      path: '/api/alerts',
      responses: {
        200: z.array(z.custom<typeof alerts.$inferSelect>()),
      },
    },
  },
  settings: {
    get: {
      method: 'GET' as const,
      path: '/api/settings',
      responses: {
        200: z.custom<typeof settings.$inferSelect>(),
        404: errorSchemas.notFound, // Or default settings if not found
      },
    },
    update: {
      method: 'PATCH' as const, // Changed to PATCH for partial updates
      path: '/api/settings',
      input: insertSettingsSchema.partial(),
      responses: {
        200: z.custom<typeof settings.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  scan: {
    run: {
      method: 'POST' as const,
      path: '/api/scan',
      responses: {
        200: z.object({ message: z.string(), scannedCount: z.number() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
