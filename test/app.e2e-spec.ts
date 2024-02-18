import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as pactum from "pactum";
import { AppModule } from "../src/app.module";
import { AuthDto } from "../src/auth/dto";
import { PrismaService } from "../src/prisma/prisma.service";

describe("App e2e", () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const PORT: number = 3339;
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();
        await app.listen(PORT);

        prisma = app.get(PrismaService);
        await prisma.cleanDb(); // to clean the database

        // base url
        pactum.request.setBaseUrl(`http://localhost:${PORT}`);
    });

    afterAll(() => {
        app.close();
    });

    describe("Auth", () => {
        const dto: AuthDto = {
            email: "test@example.com",
            password: "test123",
        };

        describe("Signup", () => {
            it("Should throw if email empty", () => {
                return pactum
                    .spec()
                    .post("/auth/signup")
                    .withBody({ password: dto.password })
                    .expectStatus(HttpStatus.BAD_REQUEST);
            });

            it("Should throw if password empty", () => {
                return pactum
                    .spec()
                    .post("/auth/signup")
                    .withBody({ email: dto.email })
                    .expectStatus(HttpStatus.BAD_REQUEST);
            });

            it("Should throw if body is empty", () => {
                return pactum
                    .spec()
                    .post("/auth/signup")
                    .withBody({})
                    .expectStatus(HttpStatus.BAD_REQUEST);
            });

            it("Should signup", () => {
                return pactum
                    .spec()
                    .post("/auth/signup")
                    .withBody(dto)
                    .expectStatus(HttpStatus.CREATED);
            });
        });

        describe("Signin", () => {
            it("Should throw if email empty", () => {
                return pactum
                    .spec()
                    .post("/auth/signin")
                    .withBody({ password: dto.password })
                    .expectStatus(HttpStatus.BAD_REQUEST);
            });

            it("Should throw if password empty", () => {
                return pactum
                    .spec()
                    .post("/auth/signin")
                    .withBody({ email: dto.email })
                    .expectStatus(HttpStatus.BAD_REQUEST);
            });

            it("Should throw if body is empty", () => {
                return pactum
                    .spec()
                    .post("/auth/signin")
                    .withBody({})
                    .expectStatus(HttpStatus.BAD_REQUEST);
            });

            it("Should signin", () => {
                return pactum
                    .spec()
                    .post("/auth/signin")
                    .withBody(dto)
                    .expectStatus(HttpStatus.OK);
            });
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
