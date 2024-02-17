import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import * as argon from "argon2";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
    ) {}

    async signUp(dto: AuthDto) {
        console.log("AuthService::signUp(): ", dto);
        // generate the password hash
        const hash = await argon.hash(dto.password);

        try {
            // save the new user in the db
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                },
            });
            // we can delete the hash from the returned object
            // delete user.hash;

            // return the saved user
            // return user;

            // return a JWT token
            return this.signToken(user.id, user.email);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    // prisma error code for unique key constraint
                    throw new ForbiddenException(
                        "User with same credentials exists",
                    );
                }
            }
            throw error;
        }
    }

    async signIn(dto: AuthDto) {
        // find the user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        console.log("AuthService::signIn(): ", user, dto);

        // if user does not exist, throw exception
        if (!user) throw new ForbiddenException("Credentials incorrect");

        // if exists, compare the password
        const passwordMatches = await argon.verify(user.hash, dto.password);

        // if password is incorrect, throw exception
        if (!passwordMatches)
            throw new ForbiddenException("Credentials incorrect");

        // send back the user
        // delete user.hash;

        // return a JWT token
        return this.signToken(user.id, user.email);
    }

    async signToken(
        userId: number,
        email: string,
    ): Promise<{ accessToken: string }> {
        const payload = {
            sub: userId, // sub - JWT standard for unique identifier
            email,
        };

        const token = await this.jwt.signAsync(payload, {
            expiresIn: "60m",
            secret: this.config.get("JWT_SECRET"),
        });

        console.log("AuthService::signToken(): ", payload, token);

        return {
            accessToken: token,
        };
    }
}
