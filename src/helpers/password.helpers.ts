import { compare, genSalt, hash } from 'bcryptjs';

export const getHashedPassword = async (password: string) => {
  return hash(password, await genSalt(12));
};

export const comparePasswords = async (
  password: string,
  hashedPassword: string,
) => {
  return compare(password, hashedPassword);
};
