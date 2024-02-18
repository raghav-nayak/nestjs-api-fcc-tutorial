import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";

describe("App e2e", () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();

        prisma = app.get(PrismaService);
        await prisma.cleanDb(); // to clean the database
    });

    afterAll(() => {
        app.close();
    });

    describe("Auth", () => {
        describe("Signup", () => {
            it.todo("Should signup");
        });

        describe("Signin", () => {
            it.todo("Should signin");
        });
    });

    describe("User", () => {
        describe("Who am I", () => {});

        describe("Edit user", () => {});
    });

    describe("Bookmark", () => {
        describe("Create bookmark", () => {});

        describe("Get bookmark by id", () => {});

        describe("Edit bookmark", () => {});

        describe("Delete bookmark", () => {});
    });
});
