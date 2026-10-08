import { cppPath } from "./cpp-path";

export interface ProjectStep {
  path: `/${string}`;
  title: string;
  description: string;
}
export interface ProjectPath {
  language: string;
  steps: readonly ProjectStep[];
}

export const projectPaths: readonly ProjectPath[] = [
  { language: "C++", steps: cppPath },
  {
    language: "Rust",
    steps: [
      cppPath[0],
      {
        path: "/aprender/ide/primeiro-projeto-rust/",
        title: "Crie seu projeto com Cargo",
        description:
          "Prepare o Rust, crie ola-rust e execute sua primeira mensagem.",
      },
      {
        path: "/estudos/rust/primeiros-passos/",
        title: "Calcule a média em Rust",
        description:
          "Continue no mesmo src/main.rs e veja o resultado mudar com as temperaturas.",
      },
    ],
  },
  {
    language: "Python",
    steps: [
      cppPath[0],
      {
        path: "/aprender/ide/primeiro-projeto-python/",
        title: "Prepare seu projeto Python",
        description:
          "Crie ola-python, prepare o ambiente virtual e rode o programa e os testes.",
      },
      {
        path: "/estudos/python/primeiros-passos/",
        title: "Calcule a média em Python",
        description:
          "Continue no mesmo main.py e confira o cálculo de duas temperaturas.",
      },
    ],
  },
];

export function projectPathFor(path: string): ProjectPath | undefined {
  return projectPaths.find((project) =>
    project.steps.some((step) => step.path === path),
  );
}
