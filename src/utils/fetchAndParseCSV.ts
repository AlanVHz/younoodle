import Papa from "papaparse";

export async function fetchAndParseCSV(url: string): Promise<string[][]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV file: ${response.statusText}`);
    }
    const data = await response.text();
    const parsedData = Papa.parse(data).data

    // Type assertion added to avoid unknown[] issue
    return parsedData as string[][]
  } catch (error: any) {
    throw new Error(`Error fetching or parsing CSV: ${error.message}`);
  }
}
