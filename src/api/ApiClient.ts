import { InvestorProfile } from "../types/investors.interface";
import { LocalStorageClient } from "./LocalStorageClient";

export class ApiClient {
  localStorageClient = new LocalStorageClient();

  constructor() {}

  getAll(): InvestorProfile[] {
    const data = this.localStorageClient.getItem(
      this.localStorageClient.investorsKey
    );
    return data ? JSON.parse(data) : [];
  }

  create(data: InvestorProfile) {
    let currentData = this.getAll();
    currentData.push(data);
    this.localStorageClient.setItem(
      this.localStorageClient.investorsKey,
      JSON.stringify(data)
    );
  }

  get(id: string) {
    let currentData = this.getAll();
    const index = currentData.findIndex(item => item.id === id);
    return index !== -1 ? currentData[index] : {}
  }

  delete() {}

  update() {}
}
