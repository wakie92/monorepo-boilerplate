const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. monorepo 루트의 node_modules를 watch
config.watchFolders = [workspaceRoot];

// 2. pnpm monorepo에서 패키지 해석
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// 3. workspace 패키지 심볼릭 링크 추적
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
