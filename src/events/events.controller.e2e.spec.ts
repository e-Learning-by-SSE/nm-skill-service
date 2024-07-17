import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { DbTestUtils } from "../DbTestUtils";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "../user/user.module";
import { PrismaModule } from "../prisma/prisma.module";
import { validate } from "class-validator";
import { EventsModule } from "./events.module";
import { LearningUnitModule } from "../learningUnit/learningUnit.module";
import { MlsActionEntity } from "./dtos/mls-actionEntity.dto";

describe("Event-System Controller Tests", () => {
    let app: INestApplication;
    const dbUtils = DbTestUtils.getInstance();
    /**
     * Initializes (relevant parts of) the application before the first test.
     */
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    validate,
                    validationOptions: { allowUnknown: false },
                }),
                PrismaModule,
                UserModule,
                LearningUnitModule,
                EventsModule,
            ],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    beforeEach(async () => {
        await dbUtils.wipeDb();
    });

    describe("Negative tests", () => {
        it("should call the event API with an invalid input (not JSON) -> 403", async () => {
            //Prepare an input that is not JSON
            const response = await request(app.getHttpServer())
                .post(`/events/`)
                .send("invalid event")
                .expect(403);
            //Expect a proper error message
            expect(response.body).toBeDefined();
            expect(response.body).toEqual({
                statusCode: 403,
                message: "MlsActionEntity unknown",
                error: "Forbidden",
            });
        });

        it("should call the event API with an invalid payload (not JSON) -> 403", async () => {
            //Prepare an input where the payload is not valid JSON
            const mlsEvent = {
                method: "PUT",
                entityType: MlsActionEntity.User,
                id: "2",
                payload: "invalid payload",
            };
            //Act: Call the API
            const response = await request(app.getHttpServer())
                .post(`/events/`)
                .send(mlsEvent)
                .expect(403);
            //Assert that the right error is thrown
            expect(response.body).toBeDefined();
            expect(response.body).toEqual({
                statusCode: 403,
                message: "Payload is not a valid JSON object",
                error: "Forbidden",
            });
        });

        it("should call the event API with an invalid taskTodoPayload (not JSON) -> 403", async () => {
            //Prepare an input where the payload is not valid JSON
            const mlsEvent = {
                method: "PUT",
                entityType: MlsActionEntity.TaskToDoInfo,
                id: "2",
                payload: { id: "1" },
                taskTodoPayload: "invalid taskTodoPayload",
            };
            //Act: Call the API
            const response = await request(app.getHttpServer())
                .post(`/events/`)
                .send(mlsEvent)
                .expect(403);
            //Assert that the right error is thrown
            expect(response.body).toBeDefined();
            expect(response.body).toEqual({
                statusCode: 403,
                message: "TaskTodoPayload is not a valid JSON object",
                error: "Forbidden",
            });
        });
    });

    describe("PATCH:User", () => {
        it("Existent user -> 201", async () => {
            const userId = "2";
            await dbUtils.createUserProfile(userId);

            const mlsEvent = {
                method: "PUT",
                entityType: MlsActionEntity.User,
                id: "2",
                payload: {
                    keycloakUuid: "11111111-2222-3333-4444-555555555555",
                    createdAt: "2022-05-17T19:19:16+02:00",
                    updatedAt: "2024-06-24T11:47:04+02:00",
                    id: 2,
                    username: "a_username",
                    groups: [],
                    roles: ["ROLE_INSTRUCTOR"],
                    password: null,
                    firstname: "UserX",
                    lastname: "UserY",
                    name: "UserX UserY",
                    email: "userx.usery@example.com",
                    state: true,
                    organizations: [
                        "\\/mls-api\\/organizations\\/1",
                        "\\/mls-api\\/organizations\\/2",
                        "\\/mls-api\\/organizations\\/3",
                    ],
                    createdForms: ["\\/mls-api\\/forms\\/1"],
                    userOptions: "\\/mls-api\\/user-options\\/2",
                    tasksTodo: [],
                    groupTaskTodoLinks: [],
                    userPrivacies: [],
                    userTermsOfUse: [],
                    createdTasks: [],
                    editedTasks: [],
                    assignedTaskTodos: ["\\/mls-api\\/task-todos\\/123456"],
                    assignedGroupTaskTodos: [],
                    editedForms: ["\\/mls-api\\/forms\\/1"],
                    invitedUsers: [
                        "\\/mls-api\\/user-invitations\\/1234",
                        "\\/mls-api\\/user-invitations\\/1235",
                        "\\/mls-api\\/user-invitations\\/1236",
                        "\\/mls-api\\/user-invitations\\/1237",
                    ],
                    guestRoleRequests: [],
                    directories: ["\\/mls-api\\/directories\\/1"],
                    documents: ["\\/mls-api\\/documents\\/1"],
                    ratedTaskTodos: [],
                    purchasedExternalContent: [],
                    projects: [],
                    assignedProjectTodos: [],
                    projectsTodo: [],
                    traineeNotices: [],
                    mls1Id: null,
                    updatedTasks: [],
                    inactiveOrganizations: [],
                    christianiId: null,
                    christianiToken: null,
                    equipment: [],
                    sharedDirectories: [],
                    sharedDocuments: [],
                    autofachmannId: null,
                    autokaufmannId: null,
                    localEuropathekBooks: [],
                    externalEuropathekBooks: [],
                    createdChats: [],
                    chats: [],
                    sendedChatMessages: [],
                    shownGroups: [],
                    tagFilters: [],
                    ratingBows: [],
                    updatedRatingBows: [],
                    userIdentifier: "a_username",
                    salt: null,
                },
            };

            const response = await request(app.getHttpServer())
                .post(`/events/`)
                .send(mlsEvent)
                .expect(201);

            expect(response.body).toBeDefined();
            expect(response.body).toEqual({});
        });
    });
});
