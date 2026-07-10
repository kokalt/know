import sys
sys.stdout.reconfigure(encoding="utf-8")
Q = chr(34); N = chr(10); BS = chr(92); BT = chr(96); DS = chr(36)
BT3 = BT + BT + BT

def mk_item(iid, title, tags, excerpt, content):
    tags_s = ", ".join(Q + t + Q for t in tags)
    esc = content.replace(BS, BS + BS).replace(BT, BS + BT).replace(DS + "{", BS + DS + "{")
    return "    {" + N + "      id: " + Q + iid + Q + "," + N + "      title: " + Q + title + Q + "," + N + "      tags: [" + tags_s + "]," + N + "      excerpt: " + Q + excerpt + Q + "," + N + "      content: " + BT + N + esc + N + BT + "," + N + "    }"

c1 = ""
c1 += "## Generics Deep Dive" + N + N
c1 += "Generics enable writing reusable, type-safe code that works with multiple types." + N + N
c1 += BT3 + "typescript" + N
c1 += "// Generic function" + N
c1 += "function identity<T>(arg: T): T { return arg; }" + N
c1 += "const num = identity<number>(42);  // type: number" + N
c1 += "const str = identity(" + Q + "hello" + Q + ");  // type: string (inferred)" + N + N
c1 += "// Generic interface" + N
c1 += "interface Repository<T> {" + N
c1 += "  getById(id: string): T;" + N
c1 += "  getAll(): T[];" + N
c1 += "  create(item: Omit<T, " + Q + "id" + Q + ">): T;" + N
c1 += "  update(id: string, item: Partial<T>): T;" + N
c1 += "  delete(id: string): void;" + N
c1 += "}" + N + N
c1 += "// Generic constraints" + N
c1 += "function getLength<T extends { length: number }>(arg: T): number {" + N
c1 += "  return arg.length; // OK, T has length property" + N
c1 += "}" + N + N
c1 += "// Generic class" + N
c1 += "class Stack<T> {" + N
c1 += "  private items: T[] = [];" + N
c1 += "  push(item: T): void { this.items.push(item); }" + N
c1 += "  pop(): T | undefined { return this.items.pop(); }" + N
c1 += "  peek(): T | undefined { return this.items[this.items.length - 1]; }" + N
c1 += "}" + N + N
c1 += "// Conditional types" + N
c1 += "type IsString<T> = T extends string ? true : false;" + N
c1 += "type A = IsString<" + Q + "hello" + Q + ">;  // true" + N
c1 += "type B = IsString<42>;       // false" + N + N
c1 += "// Mapped types" + N
c1 += "type Readonly<T> = { readonly [K in keyof T]: T[K] };" + N
c1 += "type Optional<T> = { [K in keyof T]?: T[K] };" + N
c1 += BT3 + N + N
c1 += "## Utility Types" + N + N
c1 += "TypeScript provides built-in utility types for common type transformations." + N + N
c1 += BT3 + "typescript" + N
c1 += "interface User {" + N
c1 += "  id: number;" + N
c1 += "  name: string;" + N
c1 += "  email: string;" + N
c1 += "  age: number;" + N
c1 += "  password: string;" + N
c1 += "}" + N + N
c1 += "// Partial<T> - make all properties optional" + N
c1 += "type UserUpdate = Partial<User>;  // { id?: number; name?: string; ... }" + N + N
c1 += "// Required<T> - make all properties required" + N
c1 += "type RequiredUser = Required<Partial<User>>;  // back to required" + N + N
c1 += "// Pick<T, K> - pick specific properties" + N
c1 += "type UserPreview = Pick<User, " + Q + "id" + Q + " | " + Q + "name" + Q + ">;  // { id: number; name: string }" + N + N
c1 += "// Omit<T, K> - omit specific properties" + N
c1 += "type UserWithoutPassword = Omit<User, " + Q + "password" + Q + ">;" + N + N
c1 += "// Record<K, V> - object type with known keys" + N
c1 += "type Roles = " + Q + "admin" + Q + " | " + Q + "user" + Q + " | " + Q + "guest" + Q + ";" + N
c1 += "type Permissions = Record<Roles, string[]>;" + N + N
c1 += "// ReturnType<T> - extract return type of function" + N
c1 += "function createUser() { return { id: 1, name: " + Q + "Alice" + Q + " }; }" + N
c1 += "type UserFromFn = ReturnType<typeof createUser>;" + N + N
c1 += "// Extract / Exclude" + N
c1 += "type Status = " + Q + "active" + Q + " | " + Q + "inactive" + Q + " | " + Q + "pending" + Q + ";" + N
c1 += "type ActiveStatus = Extract<Status, " + Q + "active" + Q + ">;   // " + Q + "active" + Q + N
c1 += "type NonPending = Exclude<Status, " + Q + "pending" + Q + ">;     // " + Q + "active" + Q + " | " + Q + "inactive" + Q + N + N
c1 += "// NonNullable<T>" + N
c1 += "type MaybeString = string | null | undefined;" + N
c1 += "type DefiniteString = NonNullable<MaybeString>;  // string" + N
c1 += BT3 + N + N
c1 += "## type vs interface" + N + N
c1 += "| Feature | interface | type |" + N
c1 += "|---------|-----------|------|" + N
c1 += "| Declaration merging | Yes | No |" + N
c1 += "| Extending | extends | & (intersection) |" + N
c1 += "| Primitives | No | Yes (type Age = number) |" + N
c1 += "| Unions | No | Yes |" + N
c1 += "| Tuples | No | Yes |" + N
c1 += "| Mapped types | No | Yes |" + N + N
c1 += "Rule of thumb: Use interface for object shapes (public API); use type for unions, tuples, and mapped types." + N + N
c1 += "## Type Guards" + N + N
c1 += BT3 + "typescript" + N
c1 += "// typeof guard" + N
c1 += "function padLeft(value: string | number, padding: number) {" + N
c1 += "  if (typeof value === " + Q + "number" + Q + ") {" + N
c1 += "    return Array(value + 1).join(" + Q + " " + Q + "); // value is number" + N
c1 += "  }" + N
c1 += "  return value; // value is string" + N
c1 += "}" + N + N
c1 += "// instanceof guard" + N
c1 += "if (error instanceof HttpError) { console.log(error.statusCode); }" + N + N
c1 += "// Custom type guard (is predicate)" + N
c1 += "interface Cat { meow(): void; }" + N
c1 += "interface Dog { bark(): void; }" + N
c1 += "function isCat(animal: Cat | Dog): animal is Cat {" + N
c1 += "  return (animal as Cat).meow !== undefined;" + N
c1 += "}" + N + N
c1 += "// Discriminated unions" + N
c1 += "type Shape =" + N
c1 += "  | { kind: " + Q + "circle" + Q + "; radius: number }" + N
c1 += "  | { kind: " + Q + "rectangle" + Q + "; width: number; height: number };" + N
c1 += "function area(s: Shape): number {" + N
c1 += "  switch (s.kind) {" + N
c1 += '    case "circle": return Math.PI * s.radius ** 2;' + N
c1 += '    case "rectangle": return s.width * s.height;' + N
c1 += "  }" + N
c1 += "}" + N
c1 += BT3

c2 = ""
c2 += "## Flexbox Layout" + N + N
c2 += "Flexbox is a one-dimensional layout model for arranging items in rows or columns." + N + N
c2 += BT3 + "css" + N
c2 += "/* Container properties */" + N
c2 += ".container {" + N
c2 += "  display: flex;" + N
c2 += "  flex-direction: row | column | row-reverse | column-reverse;" + N
c2 += "  justify-content: center | space-between | space-around | space-evenly;" + N
c2 += "  align-items: center | flex-start | flex-end | stretch | baseline;" + N
c2 += "  flex-wrap: nowrap | wrap | wrap-reverse;" + N
c2 += "  gap: 16px;  /* modern alternative to margin */" + N
c2 += "}" + N + N
c2 += "/* Item properties */" + N
c2 += ".item {" + N
c2 += "  flex: 1 1 auto;  /* grow shrink basis */" + N
c2 += "  align-self: center;  /* override align-items for this item */" + N
c2 += "  order: 1;  /* reorder items (use sparingly for accessibility) */" + N
c2 += "}" + N + N
c2 += "/* Classic centering with flexbox */" + N
c2 += ".center {" + N
c2 += "  display: flex;" + N
c2 += "  justify-content: center;" + N
c2 += "  align-items: center;" + N
c2 += "}" + N
c2 += BT3 + N + N
c2 += "## Grid Layout" + N + N
c2 += "Grid is a two-dimensional layout system for rows and columns simultaneously." + N + N
c2 += BT3 + "css" + N
c2 += ".grid-container {" + N
c2 += "  display: grid;" + N
c2 += "  grid-template-columns: repeat(3, 1fr);  /* 3 equal columns */" + N
c2 += "  grid-template-rows: auto 1fr auto;  /* header, content, footer */" + N
c2 += "  grid-template-areas:" + N
c2 + '    "header  header  header"' + N
c2 + '    "sidebar content aside"' + N
c2 + '    "footer  footer  footer";' + N
c2 += "  gap: 20px;" + N
c2 += "}" + N + N
c2 += ".header  { grid-area: header; }" + N
c2 += ".sidebar { grid-area: sidebar; }" + N
c2 += ".content { grid-area: content; }" + N
c2 += "/* Span across columns */" + N
c2 += ".full-width { grid-column: 1 / -1;  /* span all columns */ }" + N
c2 += BT3 + N + N
c2 += "Flexbox vs Grid: Flexbox is best for one-dimensional layouts (nav bars, card rows). Grid is best for two-dimensional layouts (page layouts, complex grids). They complement each other and are often used together." + N + N
c2 += "## BFC (Block Formatting Context)" + N + N
c2 += "A BFC is an independent rendering area where the layout of internal boxes is isolated from outside." + N + N
c2 += BT3 + "css" + N
c2 += "/* Ways to create a BFC: */" + N
c2 += ".bfc {" + N
c2 += "  overflow: hidden | auto | scroll;  /* most common */" + N
c2 += "  display: flow-root;  /* modern, purpose-built for BFC */" + N
c2 += "  float: left | right;  /* also creates BFC */" + N
c2 += "  position: absolute | fixed;" + N
c2 += "}" + N
c2 += BT3 + N + N
c2 += "**BFC solves these problems:**" + N
c2 += "1. Margin collapse prevention (margins of BFC children don't collapse with outside)" + N
c2 += "2. Contain floats (parent BFC contains floated children, no clearfix needed)" + N
c2 += "3. Prevent text wrapping around floats (adjacent BFCs don't overlap)" + N + N
c2 += "## Box Model" + N + N
c2 += BT3 + "css" + N
c2 += "/* content-box (default): width/height = content only */" + N
c2 += ".default { box-sizing: content-box; }" + N
c2 += "/* Total width = width + padding + border */" + N + N
c2 += "/* border-box (recommended): width/height = content + padding + border */" + N
c2 += "*, *::before, *::after { box-sizing: border-box; }" + N
c2 += BT3 + N + N
c2 += "Using border-box universally makes sizing more intuitive: setting width: 200px means the total width is 200px, including padding and border."

c3 = ""
c3 += "## Responsive Design" + N + N
c3 += "### Media Queries" + N + N
c3 += BT3 + "css" + N
c3 += "/* Mobile-first approach */" + N
c3 += ".card { width: 100%; }  /* mobile default */" + N
c3 += "@media (min-width: 768px) {" + N
c3 += "  .card { width: 50%; }  /* tablet */" + N
c3 += "}" + N
c3 += "@media (min-width: 1024px) {" + N
c3 += "  .card { width: 33.33%; }  /* desktop */" + N
c3 += "}" + N + N
c3 += "/* Container queries (modern approach) */" + N
c3 += "@container (min-width: 400px) {" + N
c3 += "  .card { flex-direction: row; }" + N
c3 += "}" + N
c3 += BT3 + N + N
c3 += "### CSS Animations" + N + N
c3 += BT3 + "css" + N
c3 += "/* Keyframe animation */" + N
c3 += "@keyframes fadeIn {" + N
c3 += "  from { opacity: 0; transform: translateY(20px); }" + N
c3 += "  to   { opacity: 1; transform: translateY(0); }" + N
c3 += "}" + N
c3 += ".animate-in {" + N
c3 += "  animation: fadeIn 0.3s ease-out forwards;" + N
c3 += "}" + N + N
c3 += "/* Transition */" + N
c3 += ".button {" + N
c3 += "  background: blue;" + N
c3 += "  transition: background 0.2s ease, transform 0.2s ease;" + N
c3 += "}" + N
c3 += ".button:hover { background: darkblue; transform: scale(1.05); }" + N + N
c3 += "/* Performance: animate only transform and opacity */" + N
c3 += "/* They run on the compositor thread, avoiding layout/paint */" + N
c3 += BT3 + N + N
c3 += "### CSS Preprocessors (SCSS)" + N + N
c3 += BT3 + "scss" + N
c3 += "// Variables" + N
c3 += "$primary: #1976d2;" + N
c3 += "$spacing: 8px;" + N + N
c3 += "// Nesting" + N
c3 += ".card {" + N
c3 += "  padding: $spacing * 2;" + N
c3 += "  &__title { font-size: 1.2rem; }  // BEM" + N
c3 += "  &--highlighted { border-color: $primary; }" + N
c3 += "  &:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }" + N
c3 += "}" + N + N
c3 += "// Mixins" + N
c3 += "@mixin flex-center {" + N
c3 += "  display: flex;" + N
c3 += "  justify-content: center;" + N
c3 += "  align-items: center;" + N
c3 += "}" + N + N
c3 += "// Functions" + N
c3 += "@function rem($px) { @return calc($px / 16) * 1rem; }" + N
c3 += BT3 + N + N
c3 += "**Layout Strategies Summary:**" + N
c3 += "- Use Flexbox for 1D layouts (navbars, card rows, centering)" + N
c3 += "- Use Grid for 2D layouts (page layouts, dashboards)" + N
c3 += "- Create BFCs to contain floats and prevent margin collapse" + N
c3 += "- Always use box-sizing: border-box" + N
c3 += "- Mobile-first with min-width media queries" + N
c3 += "- Animate only transform and opacity for 60fps performance"

o = N + "export const typescriptData = {" + N
o += "  name: " + Q + "TypeScript Core" + Q + "," + N
o += "  description: " + Q + "TypeScript type system, generics, utility types, type guards" + Q + "," + N
o += "  icon: " + Q + "TS" + Q + "," + N
o += "  items: [" + N
o += mk_item("ts-01", "TypeScript Generics, Utility Types & Type Guards", ["TypeScript", "Generics", "Types"], "Master TypeScript generics, built-in utility types, type vs interface, and type guards", c1)
o += N + "  ]," + N + "};" + N

o += N + "export const cssData = {" + N
o += "  name: " + Q + "CSS Knowledge" + Q + "," + N
o += "  description: " + Q + "CSS layout, animations, responsive design, preprocessors" + Q + "," + N
o += "  icon: " + Q + "C" + Q + "," + N
o += "  items: [" + N
o += mk_item("css-01", "Flexbox, Grid, BFC & Box Model", ["CSS", "Flexbox", "Grid"], "Modern CSS layout: Flexbox vs Grid, BFC creation and uses, box-sizing model", c2) + "," + N
o += mk_item("css-02", "Responsive Design, Animations & SCSS", ["CSS", "Responsive", "Animation"], "Responsive design patterns, CSS animations/transitions, and SCSS preprocessor features", c3)
o += N + "  ]," + N + "};" + N

with open("d:/桌面/inter/src/data/knowledge/inline-categories.ts", "a", encoding="utf-8") as f:
    f.write(o)
print("TS+CSS OK, chars: " + str(len(o)))
