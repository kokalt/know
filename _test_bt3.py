BT = chr(96)
c = """
hello with `backtick` here
""" + BT + BT + BT + """tsx
const x = """ + BT + """hello""" + BT + """;
""" + BT + BT + BT + """
more text
"""
print("OK, len=" + str(len(c)))
