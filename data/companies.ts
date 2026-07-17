export interface Company {
  id: string;
  name: string;
  domain: string;
  color: string;
}

export const companies: Company[] = [
  { id: "google", name: "Google", domain: "google.com", color: "#4285F4" },
  { id: "bolt", name: "Bolt", domain: "bolt.eu", color: "#34D186" },
  { id: "wise", name: "Wise", domain: "wise.com", color: "#9FE870" },
  { id: "swedbank", name: "Swedbank", domain: "swedbank.ee", color: "#FF5A28" },
  { id: "lhv", name: "LHV", domain: "lhv.ee", color: "#0F1E82" },
];
