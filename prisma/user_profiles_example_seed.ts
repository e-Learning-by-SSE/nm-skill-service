import { PrismaClient, USERSTATUS } from "@prisma/client";

const prisma = new PrismaClient();

const learningProgressProfiles = [
    // Java Profile: Knows Hello World <-> LU 1
    {
        id: "1001",
        skills: ["15", "1001"],
    },
    // DigiMedia Profile: Knows Basics about Industry 4.0 <-> LU 2003, 2004
    {
        id: "2001",
        skills: ["2006", "2007", "2008", "2009"],
    },
];

export async function createProfiles() {
    await Promise.all(
        learningProgressProfiles.map(async (profile) => {
            await prisma.userProfile.create({
                data: {
                    id: profile.id,
                    learningProgress: {
                        createMany: {
                            data: profile.skills.map((skill) => ({ skillId: skill })),
                        },
                    },
                    status: USERSTATUS.ACTIVE,
                },
            });
        }),
    );
}
