import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

export const bodyTypes = ["SUV", "Sedan", "Hatchback", "Coupe", "Convertible", "Pickup"] as const;
export const fuelTypes = ["Petrol", "Diesel", "Hybrid", "Electric", "CNG"] as const;
export const conditions = ["New", "Used", "Certified Pre-Owned"] as const;
export const transmission = ["Automatic", "Manual", "CVT", "Dual-Clutch"] as const;

const cars = defineCollection({
	loader: glob({ pattern: ["*.mdx", "!example.mdx"], base: "./src/content/cars" }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			image: image().optional(),
			imageAlt: z.string().optional(),
			gallery: z.array(z.object({ image: image(), alt: z.string() })).optional(),
			videoTourUrl: z.string().url().optional(),
			excerpt: z.string().optional(),
			publishDate: z.coerce.date().default(new Date(2025, 0, 1)),
			general: z.object({
				make: z.string(),
				model: z.coerce.string(),
				type: z.string().optional(),
				price: z.number().positive(),
				salePrice: z.number().positive().optional(),
				bodyType: z.enum(bodyTypes),
				drivetrain: z
					.enum(["Front-Wheel Drive", "Rear-Wheel Drive", "All-Wheel Drive", "Four-Wheel Drive"])
					.optional(),
				doors: z.number().int().positive(),
				seatingCapacity: z.number().int().positive(),
				condition: z.enum(conditions).optional(),
				availability: z.enum(["in-stock", "reserved", "sold", "coming-soon"]).default("in-stock"),
			}),
			history: z.object({
				mileage: z.number().nonnegative(),
				year: z.number().int().min(1886),
				previousOwners: z.number().int().nonnegative().optional(),
				accidentHistory: z.enum(["No", "Yes - Minor Damage", "Yes - Major Repair"]).optional(),
			}),
			technical: z.object({
				horsePower: z.number().positive(),
				transmission: z.enum(transmission),
				engineSizeCC: z.number().nonnegative(),
				gears: z.number().int().optional(),
				cilinders: z.number().int().optional(),
				weight: z.number().int().optional(),
			}),
			efficiency: z.object({
				fuelType: z.enum(fuelTypes),
				fuelEfficiencyMPG: z.number().positive().optional(),
				fuelEfficiencyLPer100KM: z.number().positive().optional(),
				emissionsCO2: z.string().optional(),
				emissionsRating: z.string().optional(),
			}),
			options: z
				.object({
					features: z.array(z.string()).optional(),
				})
				.optional(),
			security: z
				.object({
					alarm: z.boolean().optional(),
					immobilizer: z.boolean().optional(),
					airbags: z.number().int().positive().optional(),
					abs: z.boolean().optional(),
					esp: z.boolean().optional(),
					tireCondition: z.enum(["New", "Good", "Needs Replacement"]).optional(),
					safetyRating: z.string().optional(),
				})
				.optional(),
			exterior: z.object({
				color: z.string(),
				paintType: z.enum(["Metallic", "Pearl", "Matte"]).optional(),
				wheelSize: z.number().positive().optional(),
				wheelType: z.enum(["Alloy", "Steel", "Carbon Fiber"]).optional(),
			}),
			interior: z
				.object({
					materialSeats: z.string().optional(),
					heatedSeats: z.boolean().optional(),
					ventilatedSeats: z.boolean().optional(),
				})
				.optional(),
			misc: z
				.object({
					vin: z.string().optional(),
					registrationStatus: z.enum(["Registered", "Unregistered", "Registration Pending"]).optional(),
					warranty: z.string().optional(),
					dealerNotes: z.string().optional(),
					hidden: z.boolean().optional().default(false),
				})
				.optional(),
		}),
});

const blog = defineCollection({
	loader: glob({ pattern: "**/[^_]*.mdx", base: "./src/content/blog" }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			slug: z.string(),
			image: image(),
			imageAlt: z.string(),
			excerpt: z.string().optional(),
			publishDate: z.coerce.date().default(new Date(2025, 0, 1)),
		}),
});

export const collections = { cars, blog };
