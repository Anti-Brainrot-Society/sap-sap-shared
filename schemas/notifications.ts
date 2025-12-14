import { z } from 'zod';

export const registerDeviceSchema = z
  .object({
    deviceId: z.string().min(1),
    platform: z.enum(['ios', 'android', 'web']).optional(),
    expoPushToken: z.string().min(1).optional(),
    oneSignalPlayerId: z.string().min(1).optional(),
    appVersion: z.string().optional(),
    deviceModel: z.string().optional(),
  })
  .strict();

export type RegisterDeviceInput = z.infer<typeof registerDeviceSchema>;

export const sendTestNotificationSchema = z
  .object({
    title: z.string().optional(),
    body: z.string().optional(),
    data: z.record(z.any()).optional(),
  })
  .strict();

export type SendTestNotificationInput = z.infer<typeof sendTestNotificationSchema>;
