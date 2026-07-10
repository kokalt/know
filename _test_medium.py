# Test medium-size script
import sys
sys.stdout.reconfigure(encoding="utf-8")

out = """export const test = """
# Add some content - generate repeated lines to test size
for i in range(1, 151):
    out += """
    { id: "t-""" + str(i) + """", title: "Test """ + str(i) + """", content: "test `backtick` " + str(i) + """ " },"""

out += """
};
"""
with open("d:/桌面/inter/_test_out.ts", "w", encoding="utf-8") as f:
    f.write(out)
print("Medium test OK, chars:", len(out))
