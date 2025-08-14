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
};
const mutations = {
    createUser: async (_: string, payload: CreateUserPayload) => {
        return (await UserService.createUser(payload)).id;
    },
};

export const resolvers = { queries, mutations };
