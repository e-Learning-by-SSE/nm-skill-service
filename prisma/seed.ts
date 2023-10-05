import { PrismaClient } from "@prisma/client";

import { javaSeed } from "./java_example_seed";
import { digimediaSeed } from "./digimedia_example_seed";
import { miSeed } from "./mi_example_seed";
import { faker } from "@faker-js/faker";
import { createProfiles } from "./user_profiles_example_seed";

const prisma = new PrismaClient();

async function seed(): Promise<void> {
    console.log("Seeding... 😅");
    // Use the same seed for faker to get the same results
    faker.seed(1);

    console.log("\x1b[34m%s\x1b[0m", "Java Example");
    await javaSeed();
    console.log("\x1b[34m%s\x1b[32m ✔\x1b[0m", "Java Example");
    console.log("\x1b[34m%s\x1b[0m", "OpenDigiMedia Example");
    await digimediaSeed();
    console.log("\x1b[34m%s\x1b[32m ✔\x1b[0m", "OpenDigiMedia Example");
    console.log("\x1b[34m%s\x1b[0m", "Medieninformatik Example");
    await miSeed();
    console.log("\x1b[34m%s\x1b[32m ✔\x1b[0m", "Medieninformatik Example");

    await createProfiles();
    console.log("\x1b[34m%s\x1b[32m ✔\x1b[0m", "User Profiles Example");

    console.log("Seeding completed 😎");
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
