import { ConfigService } from "@nestjs/config";

import { PrismaService } from "./prisma/prisma.service";
import { Prisma, Skill, SkillMap, USERSTATUS } from "@prisma/client";

/**
 * Not a test suite, but functionality that supports writing test cases.
 * Simplifies operations on the database during tests.
 */
export class DbTestUtils {
    public readonly LU_URL = "a-url-to-a-resource";

    private static _instance: DbTestUtils;
    private db: PrismaService;

    private constructor() {
        const config = new ConfigService();
        this.db = new PrismaService(config);
    }

    public static getInstance(): DbTestUtils {
        if (!DbTestUtils._instance) {
            DbTestUtils._instance = new DbTestUtils();
        }
        return DbTestUtils._instance;
    }

    public async wipeDb() {
        // User Profiles
        await this.db.learningProgress.deleteMany();
        await this.db.personalizedLearningPath.deleteMany();
        await this.db.consumedUnitData.deleteMany();
        await this.db.learningHistory.deleteMany();
        await this.db.learningBehaviorData.deleteMany();
        await this.db.careerProfile.deleteMany();
        await this.db.learningProfile.deleteMany();
        await this.db.userProfile.deleteMany();

        // Learning Paths
        await this.db.learningPath.deleteMany();

        // Learning Units
        await this.db.preferredOrdering.deleteMany();
        await this.db.learningUnit.deleteMany();
        await this.db.nugget.deleteMany();

        // Skills
        await this.db.skill.deleteMany();
        await this.db.skillMap.deleteMany();

        // Feedback
        await this.db.feedback.deleteMany();
    }

    public getDb() {
        return this.db;
    }

    async createSkill(
        skillMap: SkillMap,
        name: string,
        parentSkills?: string[],
        description?: string,
        level?: number,
    ) {
        return this.db.skill.create({
            data: {
                repositoryId: skillMap.id,
                name: name,
                level: level ?? 1,
                description: description,
                parentSkills: {
                    connect: parentSkills?.map((id) => ({ id: id })),
                },
            },
            include: { nestedSkills: true },
        });
    }

    async createSkillMap(ownerId: string, name: string, description?: string) {
        return this.db.skillMap.create({
            data: {
                ownerId: ownerId,
                name: name,
                description: description,
            },
        });
    }

    async createLearningUnit(
        title: string,
        goals: Skill[],
        requirements: Skill[],
        description?: string,
    ) {
        const createInput: Prisma.LearningUnitCreateArgs = {
            data: {
                title: title,
                description: description ?? "",
                language: "en",
                teachingGoals: {
                    connect: goals.map((goal) => ({ id: goal.id })),
                },
                requirements: {
                    connect: requirements.map((req) => ({ id: req.id })),
                },
            },
        };

        return this.db.learningUnit.create(createInput);
    }

    async createLearningPath(owner: string) {
        return this.db.learningPath.create({
            data: {
                owner: owner,
            },
            include: {
                requirements: true,
                pathTeachingGoals: true,
            },
        });
    }

    async createLearningProgress(userId: string, learningUnitIds: string[]) {
        return this.db.userProfile.create({
            data: {
                id: userId,
                status: USERSTATUS.ACTIVE,
                learningProgress: {
                    createMany: {
                        data: learningUnitIds.map((skill) => ({ skillId: skill })),
                    },
                },
            },
        });
    }

    private objToJson(obj: any) {
        // Order properties to make comparison more reliable
        return (
            JSON.stringify(obj, Object.keys(obj).sort())
                // Try to improve readability
                .replaceAll('{"', "{")
                .replaceAll('":', ":")
                .replaceAll(',"', ",")
                .replaceAll('"', "'")
        );
    }

    /**
     * Auxillary function that compares an actual returned DTO object with an expected DTO object based on their JSON representations.
     * @param actual The received/returned DTO response object.
     * @param expected The expected DTO response object.
     */
    assert(actual: any, expected: any) {
        const actualJson = this.objToJson(actual);
        const expectedJson = this.objToJson(expected);
        expect(actualJson).toEqual(expectedJson);
    }

    assertObjects(actual: object, expected: object) {
        expect(actual).toMatchObject(expected);
    }
}
