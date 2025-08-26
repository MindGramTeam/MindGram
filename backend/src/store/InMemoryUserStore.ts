import { randomUUID } from 'crypto';

export type StoredUser = {
    id: string;
    email: string;
    username: string;
    passwordHash: string;
};

export class InMemoryUserStore {
    private byId = new Map<string, StoredUser>();
    private byEmail = new Map<string, StoredUser>();

    async findByEmail(email: string){
        return this.byEmail.get(email) || null ;
    }

    async findById(id: string){
        return this.byId.get(id) || null ;
    }

    async create(input: Omit<StoredUser, 'id'>) {
        const id = randomUUID();
        const user : StoredUser = { id, ...input};
        this.byId.set(id, user);
        this.byEmail.set(user.email, user);
        return user;
    }
}

/**
 * [DB 교체 포인트 - 모델/레포지토리]
 * - 실제 DB 사용 시 이 파일 대신 Prisma/TypeORM/Drizzle/Mongoose 등을 사용
 * - 예: prisma.user.findUnique({ where: { email } })
 * - 예: prisma.user.create({ data: {...} })
 */




