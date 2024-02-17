export interface InvestorProfile {
  id?: string;
  name?: string;
  industry?: Industry;
  startups?: string[][];
}

export enum Industry {
  Any = "any",
  BIO = "bio",
  INTERNET = "internet",
  ENVIRONMENT = "environment",
}
