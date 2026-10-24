import { repositoryUrl, siteRepositoryUrl } from "../../site";
import type { Repository } from "./model";

export const repositories: readonly Repository[] = [
  {
    id: "ide",
    name: "Kinein Vectis",
    slug: "ViktorWalde/KineinVectis",
    url: repositoryUrl,
  },
  {
    id: "site",
    name: "Site e conteúdo",
    slug: "ViktorWalde/KineinSite",
    url: siteRepositoryUrl,
  },
];
