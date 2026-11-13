import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skills = [];

function collectSkills(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === ".venv") continue;

    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      collectSkills(entryPath);
    } else if (entry.name === "SKILL.md") {
      skills.push(entryPath);
    }
  }
}

collectSkills(root);

const failures = [];
for (const filePath of skills) {
  const content = readFileSync(filePath, "utf8");
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  const relativePath = relative(root, filePath);

  if (!frontmatter) {
    failures.push(`${relativePath}: missing YAML frontmatter`);
    continue;
  }

  const metadata = frontmatter[1];
  for (const field of [
    "user-invocable: true",
    "disable-model-invocation: true",
  ]) {
    if (!metadata.split(/\r?\n/).some((line) => line.trim() === field)) {
      failures.push(`${relativePath}: missing ${field}`);
    }
  }
}

if (failures.length) {
  console.error(
    `${failures.length} invocation metadata issues across ${skills.length} skills:`
  );
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Invocation metadata valid in all ${skills.length} skills.`);
}
