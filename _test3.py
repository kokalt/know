out = """export const testData = {
  items: [{
    id: "t-01",
    content: \`## Test

\`\`\`tsx
const x = \`hello \${name}\`;
\`\`\`
\`,
  }],
};
"""
print("OK, len:", len(out))
