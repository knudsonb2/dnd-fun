export interface Session {
  id: string;
  date: Date;
  time: string;
  summary: string;
  outcomes: string[];
  participants: string[]; // Array of character IDs
}