export type User = {
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt: Date;
};

const users: User[] = [];

export const userRepo = {
    async findByEmail(email: string) {
        return users.find(u => u.email === email) ?? null;
    },
    async create(user: Omit<User, 'createdAt'>){
        const newUser: User = { ...user, createdAt: new Date() };
        users.push(newUser);
        return newUser;
    },
    async findById(id: string) {
        return users.find(u => u.id === id) ?? null;
    }
};