import { AuthGuard } from "@nestjs/passport";

export class JwtGuard extends AuthGuard("jwt") {
    constructor() {
        console.log("JwtGuard::constructor() is called");
        super();
    }
}
