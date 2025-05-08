/* eslint-disable @typescript-eslint/no-explicit-any */
// scripts/generate-openapi.ts
import fs from "fs";
import path from "path";
import {
  Project,
  SyntaxKind,
  Node,
  CallExpression,
  ArrowFunction,
  FunctionExpression,
} from "ts-morph";
import { zodToJsonSchema } from "zod-to-json-schema";
import { posix as p } from "path";
import { z } from "zod";

// ──────────── Helpers ────────────────────────────────────────────────────────

// Infer a simple JSON Schema from a JS literal expression
function inferLiteralSchema(code: string): any {
  try {
    const val = eval(`(${code})`);
    if (val === null) return { type: "null" };
    switch (typeof val) {
      case "string":
        return { type: "string" };
      case "number":
        return Number.isInteger(val) ? { type: "integer" } : { type: "number" };
      case "boolean":
        return { type: "boolean" };
      case "object":
        if (Array.isArray(val)) {
          return {
            type: "array",
            items: val.length ? inferLiteralSchema(JSON.stringify(val[0])) : {},
          };
        } else {
          const props: Record<string, any> = {};
          for (const [k, v] of Object.entries(val)) {
            props[k] = inferLiteralSchema(JSON.stringify(v));
          }
          return { type: "object", properties: props };
        }
    }
  } catch {
    return { type: "object" };
  }
}

// Move any ##/definitions/X → #/components/schemas/X
function normalizeComponents(openapi: any): any {
  if (openapi.components?.schemas) {
    let text = JSON.stringify(openapi);
    text = text.replace(/#\/definitions\//g, "#/components/schemas/");
    openapi = JSON.parse(text);
    // Also pull in the definition body under components.schemas
    for (const [name, schema] of Object.entries(openapi.components.schemas)) {
      if ((schema as any).definitions?.[name]) {
        openapi.components.schemas[name] = (schema as any).definitions[name];
      }
    }
  }
  return openapi;
}

// ──────────── Stage 2: Extract raw routes ──────────────────────────────────

type RawRoute = {
  file: string;
  type: "http" | "nested";
  method?: string;
  path?: string;
  prefix?: string;
  nestedVar?: string;
};

function extractRawRoutes(project: Project, glob = "src/**/*.ts"): RawRoute[] {
  const sourceFiles = project.addSourceFilesAtPaths(glob);
  const raw: RawRoute[] = [];

  sourceFiles.forEach((sf) => {
    const rel = path.relative(process.cwd(), sf.getFilePath());
    sf.getDescendantsOfKind(SyntaxKind.CallExpression).forEach((call) => {
      const expr = call.getExpression().getText();

      // HTTP methods
      const m = expr.match(/\.(get|post|put|delete|patch)$/);
      if (m) {
        const method = m[1].toUpperCase();
        const arg0 = call.getArguments()[0];
        if (Node.isStringLiteral(arg0)) {
          raw.push({
            file: rel,
            type: "http",
            method,
            path: arg0.getLiteralText(),
          });
        }
      }

      // Nested routers .route(prefix, someRouter)
      if (expr.endsWith(".route")) {
        const [prefixArg, nestedArg] = call.getArguments();
        if (Node.isStringLiteral(prefixArg) && Node.isIdentifier(nestedArg)) {
          raw.push({
            file: rel,
            type: "nested",
            prefix: prefixArg.getLiteralText(),
            nestedVar: nestedArg.getText(),
          });
        }
      }
    });
  });

  return raw;
}

// ──────────── Stage 3: Flatten nested routers ─────────────────────────────

// type FullRoute = { file: string; method: string; path: string };
type FullRoute = {
  file: string;
  method: string;
  fullPath: string;
  innerPath: string;
};

// function flattenRoutes(project: Project, raw: RawRoute[]): FullRoute[] {
//   const sourceFiles = project.getSourceFiles();
//   // map routerVar → declarations
//   const routerDefs = new Map<
//     string,
//     { file: string; decl: VariableDeclaration }[]
//   >();

//   sourceFiles.forEach((sf) => {
//     const rel = path.relative(process.cwd(), sf.getFilePath());
//     sf.getDescendantsOfKind(SyntaxKind.VariableDeclaration).forEach((vd) => {
//       const init = vd.getInitializer();
//       if (init?.getText().startsWith("new Hono")) {
//         const name = vd.getName();
//         if (!routerDefs.has(name)) routerDefs.set(name, []);
//         routerDefs.get(name)!.push({ file: rel, decl: vd });
//       }
//     });
//   });

//   const full: FullRoute[] = [];

//   // direct HTTP
//   raw
//     .filter((r) => r.type === "http")
//     .forEach((r) => {
//       full.push({ file: r.file, method: r.method!, path: r.path! });
//     });

//   // nested
//   raw
//     .filter((r) => r.type === "nested")
//     .forEach((r) => {
//       const defs = routerDefs.get(r.nestedVar!);
//       // console.log(JSON.stringify(defs, null, 2));
//       if (!defs) return;
//       defs.forEach(({ file: routerFile, decl }) => {
//         const sf = project.getSourceFile(routerFile)!;
//         const routerName = decl.getName();
//         sf.getDescendantsOfKind(SyntaxKind.CallExpression).forEach((call) => {
//           const expr = call.getExpression().getText();
//           const prefix = `${routerName}.`;
//           console.log({ routerName });
//           if (!expr.startsWith(prefix)) return;
//           const m = expr
//             .slice(prefix.length)
//             .match(/^(get|post|put|delete|patch)$/);
//           if (!m) return;

//           const method = m[1].toUpperCase();
//           const arg0 = call.getArguments()[0];
//           if (Node.isStringLiteral(arg0)) {
//             const inner = arg0.getLiteralText(); // "/" or "/:id"
//             let fullPath = p.join(r.prefix!, inner);
//             // Normalize: strip trailing slash except root
//             if (fullPath.endsWith("/") && fullPath !== "/") {
//               fullPath = fullPath.slice(0, -1);
//             }
//             full.push({ file: routerFile, method, path: fullPath });
//           }
//         });
//       });
//     });

//   return full;
// }

// ──────────── Stage 4: Extract details ────────────────────────────────────

function flattenRoutes(project: Project, raw: RawRoute[]): FullRoute[] {
  const routerDefs = new Map<string, string[]>();
  project.getSourceFiles().forEach((sf) => {
    const rel = path.relative(process.cwd(), sf.getFilePath());
    sf.getDescendantsOfKind(SyntaxKind.VariableDeclaration).forEach((vd) => {
      const init = vd.getInitializer()?.getText() || "";
      if (init.startsWith("new Hono")) {
        const name = vd.getName();
        routerDefs.set(name, (routerDefs.get(name) || []).concat(rel));
      }
    });
  });

  const full: FullRoute[] = [];

  // 1) Top‑level HTTP
  raw
    .filter((r) => r.type === "http")
    .forEach((r) => {
      full.push({
        file: r.file,
        method: r.method!,
        fullPath: r.path!,
        innerPath: r.path!,
      });
    });

  // 2) Nested
  raw
    .filter((r) => r.type === "nested")
    .forEach((n) => {
      const declFiles = routerDefs.get(n.nestedVar!);
      if (!declFiles) return;

      declFiles.forEach((routerFile) => {
        raw
          .filter((hr) => hr.type === "http" && hr.file === routerFile)
          .forEach((hr) => {
            // compute
            let fp = p.join(n.prefix!, hr.path!);
            if (fp.endsWith("/") && fp !== "/") fp = fp.slice(0, -1);
            full.push({
              file: routerFile,
              method: hr.method!,
              fullPath: fp,
              innerPath: hr.path!, // the literal in code
            });
          });
      });
    });

  return full;
}

let inlineCounter = 0; // put this near the top of your file

function extractDetails(project: Project, full: FullRoute[]) {
  const components: Record<string, any> = {};
  const paths: Record<string, any> = {};

  full.forEach(({ file, method, fullPath, innerPath }) => {
    const sf = project.getSourceFile(file);
    if (!sf) return;

    // locate on innerPath instead of fullPath
    const call = sf
      .getDescendantsOfKind(SyntaxKind.CallExpression)
      .find((n): n is CallExpression => {
        const expr = n.getExpression().getText();
        if (!expr.endsWith(`.${method.toLowerCase()}`)) return false;
        const first = n.getArguments()[0];
        return (
          Node.isStringLiteral(first) && first.getLiteralText() === innerPath
        );
      });
    if (!call) return;

    const op: any = { parameters: [], responses: {} };

    // // requestBody via zValidator
    // call.getArguments().forEach((arg) => {
    //   if (!Node.isCallExpression(arg)) return;
    //   if (arg.getExpression().getText() !== "zValidator") return;
    //   const [typeArg, schemaArg] = arg.getArguments();
    //   if (!Node.isStringLiteral(typeArg) || !Node.isIdentifier(schemaArg))
    //     return;
    //   const media = typeArg.getLiteralText();
    //   const name = schemaArg.getText();
    //   const decl = sf.getVariableDeclaration(name);
    //   if (!decl) return;
    //   const init = decl.getInitializer()!;
    //   // runtime instantiate
    //   const fn = new Function("z", `return (${init.getText()});`);
    //   // @ts-ignore
    //   const z = require("zod").z;
    //   const schema = fn(z);
    //   components[name] = zodToJsonSchema(schema, name);
    //   const contentType =
    //     media === "json"
    //       ? "application/json"
    //       : media === "form"
    //       ? "multipart/form-data"
    //       : media;
    //   op.requestBody = {
    //     required: true,
    //     content: {
    //       [contentType]: {
    //         schema: { $ref: `#/components/schemas/${name}` },
    //       },
    //     },
    //   };
    // });

    // requestBody via zValidator (handles both Identifier and inline schemas)

    call.getArguments().forEach((arg) => {
      if (!Node.isCallExpression(arg)) return;
      if (arg.getExpression().getText() !== "zValidator") return;

      const [typeArg, schemaArg] = arg.getArguments();
      if (!Node.isStringLiteral(typeArg)) return;

      const media = typeArg.getLiteralText();
      const contentType =
        media === "json"
          ? "application/json"
          : media === "form"
          ? "multipart/form-data"
          : media;

      // 1) Determine the schema name
      let name: string;
      let schemaText: string;
      if (Node.isIdentifier(schemaArg)) {
        // existing named‐schema path
        name = schemaArg.getText();
        const decl = sf.getVariableDeclaration(name);
        if (!decl) return;
        schemaText = decl.getInitializer()!.getText();
      } else {
        // new inline‐schema path
        inlineCounter += 1;
        name = `InlineSchema${inlineCounter}`;
        schemaText = schemaArg.getText();
      }

      // 2) Instantiate Zod and convert to JSON Schema
      const fn = new Function("z", `return (${schemaText});`);
      ////d @ts-ignore
      // const z = require("zod").z;
      const schema = fn(z);
      components[name] = zodToJsonSchema(schema, name);

      // 3) Attach requestBody
      op.requestBody = {
        required: true,
        content: {
          [contentType]: {
            schema: { $ref: `#/components/schemas/${name}` },
          },
        },
      };
    });

    // handler
    const handler = call
      .getArguments()
      .find((a) => Node.isArrowFunction(a) || Node.isFunctionExpression(a)) as
      | ArrowFunction
      | FunctionExpression
      | undefined;

    if (handler) {
      // parameters
      handler.forEachDescendant((node) => {
        if (!Node.isCallExpression(node)) return;
        const expr = node.getExpression().getText();
        let where: any;
        if (expr === "c.req.param") where = "path";
        else if (expr === "c.req.query") where = "query";
        else if (expr === "c.req.header") where = "header";
        else if (expr.includes("cookie")) where = "cookie";
        if (!where) return;
        const key = node.getArguments()[0];
        if (Node.isStringLiteral(key)) {
          op.parameters.push({
            name: key.getLiteralText(),
            in: where,
            required: where === "path",
            schema: { type: "string" },
          });
        }
      });
      op.parameters = Array.from(
        new Map(
          op.parameters.map((p: any) => [`${p.in}|${p.name}`, p])
        ).values()
      );

      // // responses;
      // handler.forEachDescendant((node) => {
      //   if (!Node.isCallExpression(node)) return;
      //   if (!node.getExpression().getText().endsWith("c.json")) return;
      //   const [bodyArg, statusArg] = node.getArguments();
      //   const status =
      //     statusArg && Node.isLiteralExpression(statusArg)
      //       ? parseInt(statusArg.getText(), 10)
      //       : 200;
      //   const schema = inferLiteralSchema(bodyArg.getText());
      //   op.responses[status] = {
      //     description: `HTTP ${status}`,
      //     content: { "application/json": { schema } },
      //   };
      // });
      // handler.forEachDescendant((node) => {
      //   if (!Node.isCallExpression(node)) return;
      //   const expr = node.getExpression().getText();
      //   if (!expr.endsWith("c.text")) return;
      //   const [bodyArg, statusArg] = node.getArguments();
      //   const status =
      //     statusArg && Node.isLiteralExpression(statusArg)
      //       ? parseInt(statusArg.getText(), 10)
      //       : 200;
      //   const schema = inferLiteralSchema(bodyArg.getText());
      //   op.responses[status] = {
      //     description: `HTTP ${status}`,
      //     content: { "text/plain": { schema } },
      //   };
      // });
      // responses (merged JSON + text handlers)
      handler.forEachDescendant((node) => {
        if (!Node.isCallExpression(node)) return;
        const expr = node.getExpression().getText();

        // Only care about c.json(...) or c.text(...)
        let mediaType: string | null = null;
        if (expr.endsWith("c.json")) {
          mediaType = "application/json";
        } else if (expr.endsWith("c.text")) {
          mediaType = "text/plain";
        }
        if (!mediaType) return;

        const [bodyArg, statusArg] = node.getArguments();
        const status =
          statusArg && Node.isLiteralExpression(statusArg)
            ? parseInt(statusArg.getText(), 10)
            : 200;

        // Infer a simple schema for the response body
        const schema = inferLiteralSchema(bodyArg.getText());

        op.responses[status] = {
          description: `HTTP ${status}`,
          content: {
            [mediaType]: { schema },
          },
        };
      });
    }

    paths[fullPath] ||= {};
    paths[fullPath][method.toLowerCase()] = op;
  });

  return { paths, components };
}

// ──────────── Main ───────────────────────────────────────────────────────────

async function main() {
  const project = new Project({ tsConfigFilePath: "tsconfig.json" });

  const raw = extractRawRoutes(project);
  const flat = flattenRoutes(project, raw);
  const { paths, components } = extractDetails(project, flat);

  let openapi = {
    openapi: "3.0.0",
    info: { title: "Auto‑Generated API", version: "1.0.0" },
    paths,
    components: { schemas: components },
  };

  openapi = normalizeComponents(openapi);

  fs.writeFileSync("openapi.json", JSON.stringify(openapi, null, 2), "utf-8");
  console.log("✅ openapi.json generated");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
