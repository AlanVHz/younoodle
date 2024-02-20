import { Industry } from "../types/investors.interface";

export const generateRandomStartup = (industry?: Industry) => {
  const industryValues = Object.values(Industry);
  const name = `ynd_random_${new Date().getTime()}`;
  const randomIndustry =
    industry && industry !== Industry.Any
      ? industry
      : industryValues[Math.floor(Math.random() * industryValues.length)];

  return [name, randomIndustry];
};
