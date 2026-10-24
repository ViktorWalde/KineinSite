// Coordenadas em pixels de tela: a seta mantém seu tamanho no celular.
export function flowRoutes(width: number, height: number): string[] {
  const point = (x: number, y: number): string =>
    `${x.toFixed(2)} ${y.toFixed(2)}`;
  const join = height * 0.59;
  const finish = `${point(width * 0.82, join)} ${point(width + 30, join)}`;
  return [
    `M ${point(-30, height * 0.24)} C ${point(width * 0.22, height * 0.24)} ${point(width * 0.32, join)} ${point(width * 0.56, join)} S ${finish}`,
    `M ${point(-30, height * 0.84)} C ${point(width * 0.22, height * 0.84)} ${point(width * 0.32, join)} ${point(width * 0.56, join)} S ${finish}`,
    `M ${point(width * 0.26, height * 0.1)} C ${point(width * 0.38, height * 0.1)} ${point(width * 0.37, join)} ${point(width * 0.56, join)} S ${finish}`,
  ];
}
