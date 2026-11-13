// Snapshot conferido da release; atualizar com a versão pública após verificar
// os assets e o tutorial da tag. O build recusa misturar versões.
export const downloadRelease = {
  tag: "v0.3.5",
  version: "0.3.5",
  reviewedAt: "2026-11-13",
  platform: "Linux x86_64",
  minimumGlibc: "2.36",
  archive: {
    name: "KV0.3.zip",
    bytes: 39744416,
    sha256: "d6f6a84bfdac6ca03c1317a93c3a875ef8d3088178ce41ddc0d2855fab0c2675",
  },
  appImage: {
    name: "Kinein-Vectis-0.3.5-x86_64.AppImage",
    bytes: 40352248,
    sha256: "c2710023928767f39b583c1e56fc946ee46f977985fbd08930229d991a33ecf7",
  },
  checksum: {
    name: "Kinein-Vectis-0.3.5-x86_64.AppImage.sha256",
    bytes: 102,
    sha256: "a7264f941fbf3ea453317e392a9428c1d21ddfe54987083a5812fe00f6ec2a48",
  },
} as const;
