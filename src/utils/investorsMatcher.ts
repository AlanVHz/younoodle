import { Industry, InvestorProfile } from "../types/investors.interface";
import { generateUUIDFromName } from "./uuidGenerator";

export const matchInvestorsWithStartups = (
  investors: string[][],
  startups: string[][]
): InvestorProfile[] => {
    const matches: InvestorProfile[] = [];
    const usedStartupIds: Set<string> = new Set();

    for (const investor of investors) {
        const [investorName, investorIndustry] = investor;
        const matchedStartups: string[][] = [];

        // Filter available startups based on investor's industry or 'any'
        const availableStartups: string[][] = startups.filter(([startupId, industry]) => {
            return (industry === investorIndustry || investorIndustry === 'any') && !usedStartupIds.has(startupId);
        });

        // Generate UUID for the investor's id
        const investorId: string = generateUUIDFromName(investorName);

        // Iterate through available startups and match them to the investor
        for (const startup of availableStartups) {
            const [startupId, _] = startup
            if (matchedStartups.length >= 10) break; // Stop if investor has 10 matches

            // Modification to add the entire startup and not just the name
            matchedStartups.push(startup);
            usedStartupIds.add(startupId); // Add the startup to used startups
        }

        // Add match object to matches array
        matches.push({
            id: investorId,
            name: investorName,
            industry: investorIndustry as Industry,
            startups: matchedStartups
        });
    }

    return matches;
};
