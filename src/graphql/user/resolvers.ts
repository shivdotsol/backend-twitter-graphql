import type {
    CreateUserPayload,
    GetAuthTokenPayload,
} from "../../services/user.js";
import UserService from "../../services/user.js";

const queries = {
    getAuthToken: async (_: string, payload: GetAuthTokenPayload) => {
        const token = await UserService.getAuthToken(payload);
        return token;
    },
    getCurrentLoggedInUser: async (_: any, __: any, context: any) => {
        if (context && context.user) {
            const user = await UserService.getUserById(context.user.id);
            return user;
        }
    },
};
const mutations = {
    createUser: async (_: string, payload: CreateUserPayload) => {
        return (await UserService.createUser(payload)).id;
    },
};

export const resolvers = { queries, mutations };
