import { createHash } from 'crypto'

export const hash = (data: string): string => {
  return createHash('sha256').update(data).digest('hex')
}

export const compare = (data: string, hashedData: string): boolean => {
  return hash(data) === hashedData
}
