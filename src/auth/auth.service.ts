import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
    signUp() {
        return { msg: "You are now signed up"}
    }

    signIn() {
        return { msg: "You are now signed in"}
    }
}