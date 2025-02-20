import jwt from 'jsonwebtoken';
import type { SignOptions, Secret } from 'jsonwebtoken';

const SECRET: Secret = import.meta.env.VITE_JWT_SECRET ?? '';
const EXPIRES_IN: string = import.meta.env.VITE_JWT_EXPIRES_IN || '2h';

if (!SECRET) {
  throw new Error('VITE_JWT_SECRET no está definido. Verifica tu configuración de entorno.');
}

/**
 * Genera un token JWT.
 * @param {string | object} payload - Datos a incluir en el token.
 * @returns {string} Token generado.
 */
export function generateToken(payload: string | object): string {
  const options: SignOptions = { expiresIn: EXPIRES_IN as SignOptions['expiresIn'] };
  return jwt.sign(payload, SECRET, options);
}

export interface JwtPayload {
  [key: string]: any;
}

/**
 * Verifica un token JWT y devuelve su contenido si es válido.
 * @param {string} token - Token JWT a verificar.
 * @returns {JwtPayload | null} Decodificación del token o `null` si es inválido.
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, SECRET) as JwtPayload;
  } catch {
    return null;
  }
}