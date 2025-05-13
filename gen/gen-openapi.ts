/* eslint-disable @typescript-eslint/no-explicit-any */
// Updated to merge duplicate route entries and handle both ImportTypeNode + TypeReferenceNode
import {
  Project,
  SyntaxKind,
  TypeLiteralNode,
  ImportTypeNode,
  TypeReferenceNode,
} from "ts-morph";
import * as fs from "fs";
import * as path from "path";

type OpenAPI = Record<string, any>;

async function main() {
  const [src, out = "openapi.json"] = process.argv.slice(2);
  if (!src) {
    console.error(
      "Usage: ts-node generate-openapi.ts <types-file> [output.json]",
    );
    process.exit(1);
  }

  const project = new Project({
    tsConfigFilePath: path.resolve("tsconfig.json"),
  });
  const sf = project.addSourceFileAtPath(src);
  const aliasDecl = sf.getTypeAliasOrThrow("AppType");

  // AppType can be either an import("...").HonoBase<Env,Routes> or direct HonoBase<Env,Routes>
  const topTypeNode = aliasDecl.getTypeNode();
  let typeArgs: readonly any[];
  if (topTypeNode?.isKind(SyntaxKind.TypeReference)) {
    typeArgs = (topTypeNode as TypeReferenceNode).getTypeArguments();
  } else if (topTypeNode?.isKind(SyntaxKind.ImportType)) {
    typeArgs = (topTypeNode as ImportTypeNode).getTypeArguments();
  } else {
    throw new Error("AppType must be an ImportType or a TypeReference");
  }

  if (typeArgs.length < 2) {
    throw new Error("Expected two type arguments on HonoBase");
  }
  const routesNode = typeArgs[1];

  // Gather all TypeLiteralNodes (handle intersections)
  const literals: TypeLiteralNode[] = [];
  if (routesNode.isKind(SyntaxKind.IntersectionType)) {
    for (const tn of routesNode
      .asKind(SyntaxKind.IntersectionType)!
      .getTypeNodes()) {
      if (tn.isKind(SyntaxKind.TypeLiteral))
        literals.push(tn as TypeLiteralNode);
    }
  } else if (routesNode.isKind(SyntaxKind.TypeLiteral)) {
    literals.push(routesNode as TypeLiteralNode);
  } else {
    throw new Error("Routes type is not a literal or intersection of literals");
  }

  const paths: OpenAPI = {};

  for (const lit of literals) {
    for (const member of lit.getMembers()) {
      if (!member.isKind(SyntaxKind.PropertySignature)) continue;
      const routeProp = member.asKindOrThrow(SyntaxKind.PropertySignature);

      // Extract route string and normalize to OpenAPI path syntax
      const raw = routeProp.getNameNode().getText().replace(/"/g, "");
      const route = raw.replace(/:([^/]+)/g, "{$1}");
      if (!paths[route]) paths[route] = {};

      // === NEW: get the RHS TypeLiteralNode properly ===
      const tn = routeProp.getTypeNode();
      if (!tn || !tn.isKind(SyntaxKind.TypeLiteral)) continue;
      const rhs = tn as TypeLiteralNode;

      for (const m of rhs.getMembers()) {
        if (!m.isKind(SyntaxKind.PropertySignature)) continue;
        const methodProp = m.asKindOrThrow(SyntaxKind.PropertySignature);
        const name = methodProp.getNameNode().getText(); // e.g. "$get"
        const http = name.slice(1).toLowerCase(); // "get", "post", etc.
        const variants = unwrapUnion(methodProp.getType());

        const op: any = {
          summary: `Auto-generated ${http.toUpperCase()} ${route}`,
        };

        // parameters
        const params = genParameters(variants[0]);
        if (params.length) op.parameters = params;

        // requestBody
        const rb = genRequestBody(variants[0]);
        if (rb) op.requestBody = rb;

        // responses
        op.responses = {};
        const byStatus = groupBy(variants, (v) => {
          const s = v
            .getProperty("status")!
            .getValueDeclarationOrThrow()
            .getType()
            .getText();
          return /^\d+$/.test(s) ? s : "default";
        });
        for (const [code, vs] of Object.entries(byStatus)) {
          const schemas = vs.map((v) =>
            buildSchema(
              v.getProperty("output")!.getValueDeclarationOrThrow().getType(),
            ),
          );
          const schema = schemas.length > 1 ? { oneOf: schemas } : schemas[0];
          op.responses[code] = {
            description:
              code === "default"
                ? `Generic status from ${vs[0]
                    .getProperty("status")!
                    .getValueDeclarationOrThrow()
                    .getType()
                    .getText()}`
                : `Status ${code}`,
            content: { "application/json": { schema } },
          };
        }

        paths[route][http] = op;
      }
    }
  }

  const spec = {
    openapi: "3.0.0",
    info: { title: "Auto-generated API", version: "1.0.0" },
    paths,
  };
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(spec, null, 2), "utf-8");
  console.log(`Written OpenAPI spec to ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

/** Helpers **/

function unwrapUnion(type: import("ts-morph").Type): import("ts-morph").Type[] {
  return type.isUnion() ? type.getUnionTypes() : [type];
}

function groupBy<T>(arr: T[], fn: (x: T) => string): Record<string, T[]> {
  return arr.reduce(
    (acc, x) => {
      (acc[fn(x)] ||= []).push(x);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}

function genParameters(type: import("ts-morph").Type): any[] {
  const input = type
    .getProperty("input")
    ?.getValueDeclarationOrThrow()
    .getType();
  if (!input) return [];
  const sources = ["query", "param", "header", "cookie"];
  const params: any[] = [];
  for (const src of sources) {
    const p = input.getProperty(src);
    if (!p) continue;
    const srcType = p.getValueDeclarationOrThrow().getType();
    for (const f of srcType.getProperties()) {
      const ft = f.getValueDeclarationOrThrow().getType();
      params.push({
        name: f.getName(),
        in: src === "param" ? "path" : src,
        required: !f.isOptional(),
        schema: buildSchema(ft),
      });
    }
  }
  return params;
}

function genRequestBody(type: import("ts-morph").Type): any | null {
  const inp = type.getProperty("input")?.getValueDeclarationOrThrow().getType();
  if (!inp) return null;
  const content: Record<string, any> = {};
  const j = inp.getProperty("json");
  if (j)
    content["application/json"] = {
      schema: buildSchema(j.getValueDeclarationOrThrow().getType()),
    };
  const f = inp.getProperty("form");
  if (f)
    content["application/x-www-form-urlencoded"] = {
      schema: buildSchema(f.getValueDeclarationOrThrow().getType()),
    };
  return Object.keys(content).length ? { required: true, content } : null;
}

function buildSchema(type: import("ts-morph").Type): any {
  if (type.isUnion()) {
    const members = type.getUnionTypes();
    const lits = members.filter((u) => u.isStringLiteral());
    const onlyNull = members.every(
      (u) => u.isStringLiteral() || u.isNull() || u.isUndefined(),
    );
    if (lits.length && onlyNull) {
      const schema: any = {
        type: "string",
        enum: lits.map((u) => u.getLiteralValue()),
      };
      if (members.some((u) => u.isNull() || u.isUndefined()))
        schema.nullable = true;
      return schema;
    }
    const nonNull = members.filter((u) => !u.isNull() && !u.isUndefined());
    return { oneOf: nonNull.map(buildSchema) };
  }
  if (type.isString()) return { type: "string" };
  if (type.isNumber()) return { type: "number" };
  if (type.isBoolean()) return { type: "boolean" };
  if (type.isArray())
    return {
      type: "array",
      items: buildSchema(type.getArrayElementTypeOrThrow()),
    };

  const decls = type.getSymbol()?.getDeclarations() || [];
  const isLit = decls.some(
    (d) =>
      d.getKind() === SyntaxKind.TypeLiteral ||
      d.getKind() === SyntaxKind.InterfaceDeclaration,
  );
  if (!isLit) return {};

  const props = type
    .getProperties()
    .filter(
      (p) =>
        p.getValueDeclaration()?.getKind() === SyntaxKind.PropertySignature,
    );
  const propsMap: Record<string, any> = {};
  const req: string[] = [];
  for (const p of props) {
    const decl = p.getValueDeclarationOrThrow();
    propsMap[p.getName()] = buildSchema(decl.getType());
    if (!p.isOptional()) req.push(p.getName());
  }
  const res: any = { type: "object", properties: propsMap };
  if (req.length) res.required = req;
  return res;
}
