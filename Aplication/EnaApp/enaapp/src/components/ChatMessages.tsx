import { useEffect, useRef } from "react";
import { Message } from "../models/message.model";
import { User } from "../models/user.model";
import MessageComonent from "./Message";

const ChatMessages = (props: {user: User, friend: User, messages: Message[]}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };
  
    useEffect(() => {
      scrollToBottom();
    }, [props.messages]);
    return(
        <div className="chat-displaying-messages">
            {props.messages.map((msg, index) => (
				<MessageComonent key={index} message={msg} right={(props.user.id === msg.sender?.id)}/>
			))}
            <div ref={messagesEndRef}></div>
        </div>
    );
};

export default ChatMessages;