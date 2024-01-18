import { User } from "./user.model";

export interface Message {
  id?: number;
  senderId?: number;
  sender?: User;
  recipientId?: number;
  recipient?: User;
  content: String;
  Timestamp: Date;
  // public int Id { get; set; }
  // public int SenderId { get; set; }
  // public virtual User Sender { get; set; }
  // public int RecipientId { get; set; }
  // public virtual User Recipient { get; set; }
  // public string Content { get; set; }
  // public DateTime Timestamp { get; set; }
  }