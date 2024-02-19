import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { GetUser } from "../auth/decorator/getUser.decorator";
import { JwtGuard } from "../auth/guard";
import { EditUserDto } from "./dto";
import { UserService } from "./user.service";

// for route "/users"
@UseGuards(JwtGuard) // this "jwt" is passed to the jwt.strategy class
@Controller("users")
export class UserController {
    constructor(private userService: UserService) {}

    // "/users/whoami"
    @Get("whoami")
    getWhoAmI(@GetUser() user: User) {
        console.log("UserController::getWhoAmI(): ", user);
        return user;
    }

    @Patch()
    editUser(@GetUser("id") userId: number, @Body() dto: EditUserDto) {
        return this.userService.editUser(userId, dto);
    }
}
