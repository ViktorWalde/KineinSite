const { console } = globalThis;
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const work = mkdtempSync(path.join(tmpdir(), "kinein-examples-"));
const cases = [
  {
    language: "c",
    fence: "c",
    file: "main.c",
    tool: "gcc",
    args: ["-std=c11", "-Wall", "-Wextra", "-Wpedantic", "-Werror"],
  },
  {
    language: "cpp",
    fence: "cpp",
    file: "main.cpp",
    tool: "g++",
    args: ["-std=c++20", "-Wall", "-Wextra", "-Wpedantic", "-Werror"],
  },
  {
    language: "rust",
    fence: "rust",
    file: "main.rs",
    tool: "rustc",
    args: ["--edition=2024", "-D", "warnings"],
  },
  {
    language: "python",
    fence: "python",
    file: "main.py",
    tool: "python3",
    args: [],
  },
];
try {
  for (const item of cases) {
    const source = readFileSync(
      `src/content/estudos/${item.language}/primeiros-passos.md`,
      "utf8",
    );
    const program = source.match(
      new RegExp("```" + item.fence + "\\n([\\s\\S]*?)\\n```"),
    )?.[1];
    assert.ok(program, `Exemplo ausente: ${item.language}`);
    for (const [value, expected] of [
      ["23.0", "22.00"],
      ["24.0", "22.50"],
      ["20.0", "20.50"],
      ["25.0", "23.00"],
    ]) {
      const file = path.join(work, item.file);
      writeFileSync(file, program.replace("23.0", value));
      const binary = path.join(work, "media");
      if (item.language !== "python")
        execFileSync(item.tool, [...item.args, file, "-o", binary]);
      const result =
        item.language === "python"
          ? execFileSync("python3", [file], { encoding: "utf8" })
          : execFileSync(binary, [], { encoding: "utf8" });
      assert.equal(
        result,
        `media: ${expected} C\n`,
        `${item.language}: entrada ${value}`,
      );
    }
    console.info(`${item.language}: exemplo e três exercícios conferidos.`);
  }
  const source = readFileSync(
    "src/content/estudos/cpp/telemetria-local.md",
    "utf8",
  );
  const program = source.match(/```cpp\n([\s\S]*?)\n```/)?.[1];
  assert.ok(program);
  const variants = [
    [program, "sala: 21.75 C\npatio: sem leituras\n"],
    [
      program.replace('"patio"', '"externo"'),
      "sala: 21.75 C\nexterno: 19.10 C\n",
    ],
    [
      program
        .replace("Leitura, 4", "Leitura, 5")
        .replace(
          '{"sala", 21750},',
          '{"sala", 21750},\n      {"sala", 22500},',
        ),
      "sala: 21.94 C\npatio: sem leituras\n",
    ],
    [
      program.replace(/\{"sala", (\d+)\}/g, '{"outro", $1}'),
      "sala: sem leituras\npatio: sem leituras\n",
    ],
  ];
  for (const [code, expected] of variants) {
    const file = path.join(work, "telemetria.cpp");
    const binary = path.join(work, "telemetria");
    writeFileSync(file, code);
    execFileSync("g++", [
      "-std=c++20",
      "-Wall",
      "-Wextra",
      "-Wpedantic",
      "-Werror",
      file,
      "-o",
      binary,
    ]);
    assert.equal(execFileSync(binary, [], { encoding: "utf8" }), expected);
  }
  console.info(
    "Telemetria: exemplo, ausência de dados e três exercícios conferidos.",
  );
} finally {
  rmSync(work, { recursive: true, force: true });
}
