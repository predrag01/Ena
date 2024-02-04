import { User } from "./user.model";

export interface Message {
  id?: number;
  senderId?: number;
  sender?: User;
  recipientId?: number;
  recipient?: User;
  content: string;
  Timestamp: Date;
}