import { createHmac, randomBytes } from "node:crypto";
import { prismaClient } from "../lib/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not defined");
const JWT_SECRET = process.env.JWT_SECRET;

export interface CreateUserPayload {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
}
export interface GetAuthTokenPayload {
    email: string;
    password: string;
}

class UserService {
    public static createUser(payload: CreateUserPayload) {
        const { firstName, lastName, email, password } = payload;
        const salt = randomBytes(32).toString("hex");
        const hashedPassword = createHmac("sha256", salt)
            .update(password)
            .digest("hex");
        return prismaClient.user.create({
            data: {
                firstName,
                lastName: lastName || null,
                email,
                password: hashedPassword,
                salt,
            },
        });
    }

    public static async getAuthToken(payload: GetAuthTokenPayload) {
        const { email, password } = payload;
        const user = await this.getUserByEmail(email);

        if (!user) throw new Error("User not found.");

        const hashedPassword = createHmac("sha256", user.salt)
            .update(password)
            .digest("hex");

        if (user.password !== hashedPassword)
            throw new Error("Incorrect login credentials");

        // generate JWT token

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
        return token;
    }

    private static getUserByEmail(email: string) {
        return prismaClient.user.findUnique({ where: { email } });
    }
}

export default UserService;
