import { SessionStorageClient } from "../api/SessionStorageClient";
import { Industry, InvestorProfile } from "../types/investors.interface";

export interface DeletedStartup {
  name?: string;
  industry?: Industry;
  investorsName?: string;
}

const sessionStorageClient = new SessionStorageClient();

const deleteStartupFromStore = (parsedData: any, startupName: string) => {
  let elementIndex = parsedData.findIndex(
    (elem: DeletedStartup) => elem.name == startupName
  );
  elementIndex !== -1 && parsedData.splice(elementIndex, 1);

  sessionStorageClient.setItem(
    sessionStorageClient.deletedStartups,
    JSON.stringify(parsedData)
  );
};

// Block of code that can be optimized to re-used code to get sessionStorage values and parse them.
export const getLatestInvestorDeletedStartups = (
  investorsName: string
): DeletedStartup => {
  let storageData: string | null = sessionStorageClient.getItem(
    sessionStorageClient.deletedStartups
  );
  let parsedData: DeletedStartup[] = storageData ? JSON.parse(storageData) : [];
  let investorStartups: DeletedStartup[] = [];

  for (const startup of parsedData) {
    if (startup.investorsName == investorsName) {
      investorStartups.push(startup);
    }
  }
  const latestDeletedStartup =
    investorStartups.length >= 1
      ? investorStartups[investorStartups.length - 1]
      : ([] as DeletedStartup);
  deleteStartupFromStore(parsedData, latestDeletedStartup.name!);
  return latestDeletedStartup;
};

export const addModifiedInvestorToStore = (investor: InvestorProfile) => {
  let storageData: string | null = sessionStorageClient.getItem(
    sessionStorageClient.modifiedInvestors
  );
  let parsedData: InvestorProfile[] = storageData
    ? JSON.parse(storageData)
    : [];

  parsedData.push(investor);
  sessionStorageClient.setItem(
    sessionStorageClient.modifiedInvestors,
    JSON.stringify(parsedData)
  );

  return parsedData;
};

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
