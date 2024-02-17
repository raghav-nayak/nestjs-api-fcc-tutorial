import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { JwtGuard } from "src/auth/guard";

// for route "/users"
@Controller("users")
export class UserController {
    @UseGuards(JwtGuard) // this "jwt" is passed to the jwt.strategy class
    // "/users/whoami"
    @Get("whoami")
    getWhoAmI(@Req() req: Request) {
        console.log("UserController::getWhoAmI(): ", {
            user: req.user, // you can access user details from request and it is passed by guard
        });

        return req.user;
    }
}
