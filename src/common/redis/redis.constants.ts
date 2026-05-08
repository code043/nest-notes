export const REDIS_KEYS = {
  THROTTLE: 'throttle',
  THROTTLE_BLOCK: 'throttle:block',
  CACHE_NOTES: 'cache:notes',
  JWT_BLACKLIST: (token: string) => `blacklist:jwt:${token}`,
};
