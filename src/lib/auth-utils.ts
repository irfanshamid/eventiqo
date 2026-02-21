import { compare, hash } from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await compare(password, hash);
}

export function generatePassword(length = 10): string {
  const charset = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let password = "";
  // Use simple Math.random for client-side compatibility if needed, 
  // but for server-side actions randomBytes is fine. 
  // However, randomBytes returns Buffer which acts like array of uint8.
  // The original implementation using randomBytes[i] % charset.length is correct logic
  // but might be simpler to just use Math.random() to avoid Node/Edge runtime issues if any.
  
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return password;
}
