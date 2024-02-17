import { Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { GetUser } from "src/auth/decorator/getUser.decorator";
import { JwtGuard } from "src/auth/guard";

// for route "/users"
@UseGuards(JwtGuard) // this "jwt" is passed to the jwt.strategy class
@Controller("users")
export class UserController {
    // "/users/whoami"
    @Get("whoami")
    getWhoAmI(@GetUser() user: User) {
        return user;
    }

    @Patch()
    editUser() {}
}
