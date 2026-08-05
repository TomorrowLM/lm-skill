#!/usr/bin/env node

/**
 * Render graphviz diagrams from a skill's SKILL.md to SVG files.
 *
 * Usage:
 *   ./render-graphs.js <skill-directory>           # Render each diagram separately
 *   ./render-graphs.js <skill-directory> --combine # Combine all into one diagram
 *
 * Extracts all ```dot blocks from SKILL.md and renders to SVG.
 * Useful for helping your human partner visualize the process flows.
 *
 * Requires: graphviz (dot) installed on system
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function extractDotBlocks(markdown) {
  const blocks = [];
  const regex = /```dot\n([\s\S]*?)```/g;
  let match;

  while ((match = regex.exec(markdown)) !== null) {
    const content = match[1].trim();

    // Extract digraph name
    const nameMatch = content.match(/digraph\s+(\w+)/);
    const name = nameMatch ? nameMatch[1] : `graph_${blocks.length + 1}`;

    blocks.push({ name, content });
  }

  return blocks;
}

function extractGraphBody(dotContent) {
  // Extract just the body (nodes and edges) from a digraph
  const match = dotContent.match(/digraph\s+\w+\s*\{([\s\S]*)\}/);
  if (!match) return '';

  let body = match[1];

  // Remove rankdir (we'll set it once at the top level)
  body = body.replace(/^\s*rankdir\s*=\s*\w+\s*;?\s*$/gm, '');

  return body.trim();
}

function renderDotToSvg(dotContent, outputDir, name) {
  const dotFile = path.join(outputDir, `${name}.dot`);
  const svgFile = path.join(outputDir, `${name}.svg`);

  fs.writeFileSync(dotFile, dotContent);
  execSync(`dot -Tsvg "${dotFile}" -o "${svgFile}"`);

  return svgFile;
}

function renderAllDotToSvg(dotContent, outputDir) {
  return renderDotToSvg(dotContent, outputDir, 'diagram');
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Usage: render-graphs.js <skill-directory> [--combine]');
    process.exit(1);
  }

  const skillDir = args[0];
  const combine = args.includes('--combine');
  const skillMdPath = path.join(skillDir, 'SKILL.md');

  if (!fs.existsSync(skillMdPath)) {
    console.error(`SKILL.md not found in ${skillDir}`);
    process.exit(1);
  }

  const markdown = fs.readFileSync(skillMdPath, 'utf-8');
  const blocks = extractDotBlocks(markdown);

  if (blocks.length === 0) {
    console.log('No dot blocks found in SKILL.md');
    process.exit(0);
  }

  const outputDir = path.join(skillDir, 'diagrams');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (combine && blocks.length > 1) {
    // Combine all diagrams into one
    const combined = `digraph Combined {\n  rankdir=TB;\n\n${blocks
      .map((b) => extractGraphBody(b.content))
      .join('\n\n')}\n}`;
    renderAllDotToSvg(combined, outputDir);
  } else {
    // Render each diagram separately
    for (const block of blocks) {
      renderDotToSvg(block.content, outputDir, block.name);
    }
  }

  console.log(`Rendered ${blocks.length} diagram(s) to ${outputDir}`);
}

main();
