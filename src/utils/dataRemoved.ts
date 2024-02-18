import { SessionStorageClient } from "../api/SessionStorageClient";
import { Industry } from "../types/investors.interface";

export interface DeletedStartup {
  name?: string;
  industry?: Industry;
  investorsName?: string;
}

const sessionStorageClient = new SessionStorageClient();

export const addDeletedStartupToStore = (
  startup: DeletedStartup
): DeletedStartup[] => {
  let storageData: string | null = sessionStorageClient.getItem(
    sessionStorageClient.deletedStartups
  );
  let parsedData: DeletedStartup[] = storageData ? JSON.parse(storageData) : [];

  parsedData.push(startup);
  sessionStorageClient.setItem(
    sessionStorageClient.deletedStartups,
    JSON.stringify(parsedData)
  );

  return parsedData;
};
