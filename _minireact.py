import sys
sys.stdout.reconfigure(encoding="utf-8")
Q = chr(34)
N = chr(10)
out = "export const test = {" + N + "  items: []" + N + "};" + N
with open("d:/桌面/inter/_miniout.ts", "w", encoding="utf-8") as f:
    f.write(out)
print("OK: " + str(len(out)))
