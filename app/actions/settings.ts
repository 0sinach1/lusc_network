"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function updateLuggagePrice(newPrice: number) {
  try {
    await prisma.platformSettings.upsert({
      where: { settingKey: 'LUGGAGE_PRICE_PER_BAG' },
      update: { settingValue: String(newPrice) },
      create: { settingKey: 'LUGGAGE_PRICE_PER_BAG', settingValue: String(newPrice) },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to update price:", error);
    return { success: false };
  }
}