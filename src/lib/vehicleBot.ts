import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { SOURCES, type VehicleSource } from "./scraperSources";
import { scrapeSource } from "./scraper";

type SavedSource = {
  brand: string;
  vehicleType: VehicleSource["vehicleType"];
  inserted: number;
  priceChanges: number;
};

export async function runVehicleSlice(slice = 0, perSlice = 3): Promise<{ saved: SavedSource[] }> {
  if (!Number.isInteger(slice) || slice < 0) throw new RangeError("slice must be a non-negative integer.");
  if (!Number.isInteger(perSlice) || perSlice < 1) throw new RangeError("perSlice must be a positive integer.");

  const batch = SOURCES.slice(slice * perSlice, (slice + 1) * perSlice);
  const saved: SavedSource[] = [];

  for (const source of batch) {
    const models = await scrapeSource(source);
    const brand = await prisma.brand.upsert({
      where: { name: source.brand },
      update: { vehicleType: source.vehicleType, origin: source.origin },
      create: { name: source.brand, vehicleType: source.vehicleType, origin: source.origin },
    });
    let inserted = 0;
    let priceChanges = 0;

    for (const model of models) {
      const current = await prisma.carModel.findUnique({
        where: { brandId_name: { brandId: brand.id, name: model.name } },
      });
      const specs = model.specs ? model.specs as Prisma.InputJsonValue : Prisma.JsonNull;

      if (!current) {
        const created = await prisma.carModel.create({
          data: {
            brandId: brand.id,
            name: model.name,
            vehicleType: source.vehicleType,
            bodyType: model.bodyType,
            pricePKR: model.pricePKR,
            specs,
          },
        });
        await prisma.catalogHistory.create({
          data: {
            modelId: created.id,
            newPricePKR: model.pricePKR,
            newSpecs: specs,
            changeType: "created",
          },
        });
        inserted++;
        continue;
      }

      const priceChanged = model.pricePKR !== undefined && model.pricePKR !== current.pricePKR;
      const specsChanged = model.specs !== undefined && JSON.stringify(model.specs) !== JSON.stringify(current.specs);
      const bodyTypeChanged = model.bodyType !== undefined && model.bodyType !== current.bodyType;
      if (!priceChanged && !specsChanged && !bodyTypeChanged) continue;

      await prisma.carModel.update({
        where: { id: current.id },
        data: {
          ...(model.pricePKR !== undefined ? { pricePKR: model.pricePKR } : {}),
          ...(model.bodyType !== undefined ? { bodyType: model.bodyType } : {}),
          ...(model.specs !== undefined ? { specs } : {}),
        },
      });
      await prisma.catalogHistory.create({
        data: {
          modelId: current.id,
          oldPricePKR: current.pricePKR,
          newPricePKR: model.pricePKR ?? current.pricePKR,
          oldSpecs: current.specs ?? Prisma.JsonNull,
          newSpecs: model.specs ? specs : current.specs ?? Prisma.JsonNull,
          changeType: priceChanged ? "price" : "specs",
        },
      });
      if (priceChanged) priceChanges++;
    }

    saved.push({ brand: source.brand, vehicleType: source.vehicleType, inserted, priceChanges });
  }

  return { saved };
}

export async function runFullVehicleScrape(): Promise<{ saved: SavedSource[] }[]> {
  const results: { saved: SavedSource[] }[] = [];
  const perSlice = 3;
  for (let slice = 0; slice * perSlice < SOURCES.length; slice++) {
    results.push(await runVehicleSlice(slice, perSlice));
  }
  return results;
}
