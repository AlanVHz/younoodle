import { ApiClient } from "../api/ApiClient";
import { Industry, InvestorProfile } from "../types/investors.interface";
import { SessionStorageKeys } from "../types/storage.interface";

export interface DeletedStartup {
  name?: string;
  industry?: Industry;
  investorsName?: string;
}

const apiClient = new ApiClient();

const deleteStartupFromStore = (parsedData: any, startupName: string) => {
  let elementIndex = parsedData.findIndex(
    (elem: DeletedStartup) => elem.name == startupName
  );
  elementIndex !== -1 && parsedData.splice(elementIndex, 1);
  apiClient.update(SessionStorageKeys.DELETED_STARTUPS, JSON.stringify(parsedData))
};

// Block of code that can be optimized to re-used code to get sessionStorage values and parse them.
export const getLatestInvestorDeletedStartups = (
  investorsName: string
): DeletedStartup => {
  let storageData: string | null = apiClient.getData(SessionStorageKeys.DELETED_STARTUPS)
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
  let storageData: string | null = apiClient.getData(SessionStorageKeys.MODIFIED_INVESTORS)
  let parsedData: InvestorProfile[] = storageData
    ? JSON.parse(storageData)
    : [];

  parsedData.push(investor);
  apiClient.update(SessionStorageKeys.MODIFIED_INVESTORS, JSON.stringify(parsedData))

  return parsedData;
};

export const addDeletedStartupToStore = (
  startup: DeletedStartup
): DeletedStartup[] => {
  let storageData: string | null = apiClient.getData(SessionStorageKeys.DELETED_STARTUPS)
  let parsedData: DeletedStartup[] = storageData ? JSON.parse(storageData) : [];

  parsedData.push(startup);
  apiClient.update(SessionStorageKeys.DELETED_STARTUPS, JSON.stringify(parsedData))

  return parsedData;
};
