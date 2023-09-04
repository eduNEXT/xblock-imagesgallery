// All this code will be removed, it's for testing TypeScript
interface Log {
  id: string;
  date: Date;
  message: string;
}

export interface UserI {
  name: string;
  age: number;
  isActive: boolean;
  logs: Log[];
}
