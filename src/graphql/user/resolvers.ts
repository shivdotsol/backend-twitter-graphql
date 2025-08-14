const queries = {};
const mutations = {
    createUser: async (
        _: string,
        {
            firstName,
            lastName,
            email,
            password,
        }: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
        }
    ) => {
        return "created";
    },
};

export const resolvers = { queries, mutations };
