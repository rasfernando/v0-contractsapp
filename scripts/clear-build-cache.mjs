import { rm } from 'fs/promises';
import { resolve } from 'path';

async function clearBuildCache() {
  try {
    await rm(resolve('.next'), { recursive: true, force: true });
    await rm(resolve('.turbo'), { recursive: true, force: true });
    console.log('[v0] Build cache cleared successfully');
  } catch (error) {
    console.error('[v0] Error clearing cache:', error);
  }
}

clearBuildCache();
