import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { execSync } from 'child_process';

export default defineConfig(() => {
  // Git 커밋 해시 가져오기
  const commitHash = execSync('git rev-parse HEAD').toString().trim();

  return {
    plugins: [sveltekit()],
    define: {
      __COMMIT_HASH__: JSON.stringify(commitHash), // 전역 변수로 주입
    },
  };
});