import sys
sys.stdout.reconfigure(encoding="utf-8")
Q = chr(34)
N = chr(10)
BS = chr(92)
BT = chr(96)

def item(iid, title, tags, excerpt, content):
    tags_str = ", ".join(Q + t + Q for t in tags)
    esc = content.replace(BS, BS + BS).replace(BT, BS + BT)
    return "    {" + N + "      id: " + Q + iid + Q + "," + N + "      title: " + Q + title + Q + "," + N + "      tags: [" + tags_str + "]," + N + "      excerpt: " + Q + excerpt + Q + "," + N + "      content: " + BT + N + esc + N + BT + "," + N + "    }"

out = "export const reactData = {" + N
out += "  name: " + Q + "React" + Q + "," + N
out += "  items: [" + N

test_content = "## Test Section" + N + N + BT + BT + BT + "tsx" + N + "const x = 1;" + N + BT + BT + BT + N + N + "Some text."

out += item("r-01", "Test Title", ["React", "Test"], "Test excerpt", test_content)

out += N + "  ]," + N + "};" + N

with open("d:/桌面/inter/_midout.ts", "w", encoding="utf-8") as f:
    f.write(out)
print("OK: " + str(len(out)))
