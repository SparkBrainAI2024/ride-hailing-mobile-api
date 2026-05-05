import { compare, hash } from 'bcryptjs'
export const comparePassword = async (password: string, hashedPassword: string): Promise<Boolean> => {
    return await compare(password, hashedPassword);
}

export const hashPassword = async (password: string, salt: number): Promise<string> => {
    return await hash(password, salt);
}