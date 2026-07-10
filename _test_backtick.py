out = """
\`\`\`tsx
const x = 1;
\`\`\`
\`\`\`javascript
function test() { return \`hello\`; }
\`\`\`
""" * 200
with open("d:/桌面/inter/_test_bt_out.txt", "w") as f:
    f.write(out)
print("Backtick test OK, chars:", len(out))
