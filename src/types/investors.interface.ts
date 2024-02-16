export interface InvestorProfile {
  id: string;
  name: string;
  industry: Industry;
  startup: string;
  startupIndustry: Industry;
}

export enum Industry {
  Any = "any",
  BIO = "bio",
  INTERNET = "internet",
  ENVIRONMENT = "environment",
}

export interface CsvData {
  name: string;
  industry: Industry;
}
