interface CollaboratorAcknowledgement {
  login: string;
  contribution: string;
  evidenceUrl: `https://github.com/${string}`;
}

// Agradecimentos revisados pelo mantenedor para contribuições sem commit,
// como testes, triagem e revisões. Cada entrada exige evidência pública e
// usa apenas o perfil público indicado pela pessoa. Sem nomes de exemplo.
export const collaboratorAcknowledgements: readonly CollaboratorAcknowledgement[] =
  [];
