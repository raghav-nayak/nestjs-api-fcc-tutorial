import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(
    Strategy,
    "jwt", // AuthGuard protection; to receive only JWT token
) {
    constructor(
        private config: ConfigService,
        private prisma: PrismaService,
    ) {
        console.log("JwtStrategy::constructor() is called");
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get("JWT_SECRET"),
        });
    }

    async validate(payload: { sub: number; email: string }) {
        console.log("JwtStrategy::validate():", payload);
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            },
        });
        console.log("JwtStrategy::validate():", user);
        delete user.hash;
        return user; // this will append payload the request
    }
}
