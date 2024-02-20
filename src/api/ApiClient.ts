import { InvestorProfile } from "../types/investors.interface";
import { CommonStorageKeys } from "../types/storage.interface";
import { LocalStorageClient } from "./LocalStorageClient";
import { SessionStorageClient } from "./SessionStorageClient";

/**
 * Moved responsabilities from another clients to here so we have centralized storage logic,
 * that will make easier the local/session storage manipulation to get and update data.
 *
 * I faced more complexity when i want to show a modified object instead of the original one, so
 * thats why I did the changes.
 */

export class ApiClient {
  localStorageClient = new LocalStorageClient();
  sessionStorageClient = new SessionStorageClient();
  isDataHasBeenModifiedKey: string = "isDataModifiedKey";

  constructor() {}

  getMatchedInvestorsStartupsData(): InvestorProfile[] {
    let data: string | null;

    this.isDataModified()
      ? (data = this.sessionStorageClient.getItem(
          CommonStorageKeys.MATCHED_INVESTORS_STARTUPS
        ))
      : (data = this.localStorageClient.getItem(
          CommonStorageKeys.MATCHED_INVESTORS_STARTUPS
        ));

    return data ? JSON.parse(data) : [];
  }

  setMatchedInvestorsStartupsData(data: InvestorProfile[]) {
    // We add the data in both stores cause we will use it in both depending the user behaviour
    this.localStorageClient.setItem(
      CommonStorageKeys.MATCHED_INVESTORS_STARTUPS,
      JSON.stringify(data)
    );

    this.sessionStorageClient.setItem(
      CommonStorageKeys.MATCHED_INVESTORS_STARTUPS,
      JSON.stringify(data)
    );
  }

  setData(key: string, body: string) {
    this.isDataModified()
      ? this.sessionStorageClient.setItem(key, body)
      : this.localStorageClient.setItem(key, body);
  }

  getInvestor(investorId?: string) {
    let currentData = this.getMatchedInvestorsStartupsData();
    const index = currentData.findIndex((item) => item.id === investorId);
    return index !== -1 ? currentData[index] : {};
  }

  getData(key: string): string | null {
    return this.isDataModified()
      ? this.sessionStorageClient.getItem(key)
      : this.localStorageClient.getItem(key);
  }

  delete(key: string) {
    this.isDataModified()
      ? this.sessionStorageClient.removeItem(key)
      : this.localStorageClient.removeItem(key);
  }

  update(key: string, body: string) {
    this.setIsDataModified(true);
    this.setData(key, body);
  }

  isDataModified = (): boolean => {
    return sessionStorage.getItem(this.isDataHasBeenModifiedKey) === "true";
  };

  setIsDataModified = (value: boolean) => {
    sessionStorage.setItem(
      this.isDataHasBeenModifiedKey,
      JSON.stringify(value)
    );
  };
}
