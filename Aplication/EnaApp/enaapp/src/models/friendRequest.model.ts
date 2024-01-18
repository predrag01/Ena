import { User } from "./user.model";

export interface FriendRequest {
  id?: number;
  senderId?: number;
  sender?: User;
  recipientId?: number;
  recipient?: User;
  isAccepted: Boolean;
  Timestamp: Date;
  }