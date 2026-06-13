// Dictionary of valid tech terms for Word Duel (validation + local opponent).
// Lowercase, alphabetic only. Spread across many starting letters for good chains.
export const TECH_WORDS: string[] = [
  "api", "ajax", "array", "async", "await", "agent", "azure", "angular", "atom",
  "bash", "binary", "branch", "bug", "byte", "buffer", "build", "boolean", "backend",
  "cache", "class", "cloud", "cli", "commit", "compiler", "container", "cookie", "css", "cursor",
  "data", "debug", "deploy", "docker", "dom", "django", "dart", "daemon", "database",
  "edge", "elixir", "endpoint", "enum", "event", "express", "exception", "embedding",
  "function", "framework", "frontend", "fetch", "firebase", "flask", "flag", "fragment",
  "git", "golang", "graphql", "grid", "grpc", "gateway", "gpu",
  "html", "http", "hook", "heap", "hash", "host", "haskell",
  "import", "index", "integer", "interface", "instance", "inngest", "input",
  "java", "json", "jwt", "jenkins", "jquery", "jupyter",
  "kernel", "kotlin", "kafka", "key", "kubernetes",
  "lambda", "linux", "loop", "logic", "library", "linter", "latency",
  "macro", "merge", "method", "module", "mongo", "mutex", "mysql", "model",
  "node", "nginx", "null", "nest", "network", "neural", "namespace",
  "object", "oauth", "object", "opcode", "origin", "output", "overflow",
  "python", "pixel", "proxy", "prompt", "pointer", "promise", "package", "parser", "postgres",
  "query", "queue", "quine",
  "react", "redis", "regex", "render", "redux", "route", "runtime", "rust", "request",
  "stack", "schema", "script", "server", "socket", "string", "struct", "swift", "syntax",
  "token", "thread", "typescript", "tuple", "terminal", "template", "tensor", "test",
  "ubuntu", "udp", "unicode", "uri", "union", "update", "upload",
  "vue", "vector", "variable", "vercel", "vim", "vm", "view",
  "webpack", "websocket", "widget", "worker", "wasm", "webhook",
  "xml", "xss",
  "yaml", "yarn",
  "zustand", "zip", "zod",
];

export const TECH_SET = new Set(TECH_WORDS);
