import { useEffect, useState } from "react";
import * as signalR from '@microsoft/signalr';
import { useLocation } from 'react-router-dom';
import FrindsList from "../components/FriendsList";
import { User } from "../models/user.model";
import ChatMessages from "../components/ChatMessages";
import image from "./../assets/noProfilePicture.png"
import { Message } from "../models/message.model";
import Cookies from "js-cookie";

const Chat = (props: {setShowNotifications:(value: boolean)=>void, setShowMessages:(value: boolean)=>void, connection: signalR.HubConnection | null}) => {
	const location = useLocation();
  	const searchParams = new URLSearchParams(location.search);
	const username = searchParams.get('username');
	const friendUsername = searchParams.get('friendUsername');
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState<string>('');
  	const [userId, setUserId] = useState(-1);
	const [chatUer, setChatUser] = useState<User>();
	const [user, setUser] = useState<User>();

	const loadUser = async (username: string) => {
		const respone = await fetch('https://localhost:44364' + `/User/GetUserByUsername/${encodeURIComponent(username)}`, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + Cookies.get('jwt')
				},
				credentials: 'include',
				mode: 'cors'
			});

			const content:User = await respone.json();         
			
			setChatUser(content);
	};

	const setChatUserAndFetchMessages = async (newChatUser: User) => {
		setChatUser(newChatUser);
		if (username && newChatUser.username) {
		  const response = await fetch('https://localhost:44364' + '/message/GetAllMessagesForChat?senderUsername=' + username + '&recipientUsername=' + newChatUser.username, {
			headers: { 
				'Content-Type': 'application/json',
            	'Authorization': 'Bearer ' + Cookies.get('jwt') 
			},
			credentials: 'include'
		  });
	
		  const data: Message[] = await response.json();
		  setMessages(data);
		}
	  };

	useEffect(() => {
		props.setShowNotifications(false);
		props.setShowMessages(false);
		const fetchUser = async () => {
			const respone = await fetch('https://localhost:44364' + '/User/GetUser', {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + Cookies.get('jwt')
				},
				credentials: 'include',
				mode: 'cors'
			});

			const content = await respone.json();         
			
			setUserId(content.id);
			setUser(content);
		}
		
		if(username && friendUsername && username !== friendUsername){
			const fetchMessages = async () => {
				const response = await fetch('https://localhost:44364' + '/message/GetAllMessagesForChat?senderUsername=' + username + '&recipientUsername=' + friendUsername, {
					headers: { 
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + Cookies.get('jwt')
					},
					credentials: 'include'
				});
				const data: Message[] = await response.json();
      			setMessages((prevMessages) => [...prevMessages, ...data]);
			};
			
			fetchMessages();
			loadUser(friendUsername);
		}
		
		fetchUser()

		return() => {
			props.setShowNotifications(true);
			props.setShowMessages(true);
		};
	},[]);

	useEffect(() => {
		props.connection?.on('ReceiveMessage', (senderName: string, message: Message) => {
			
			if(senderName==chatUer?.username)
				setMessages(prevMessages => [...prevMessages, message]);
		});
		return () => {
			props.connection?.off('ReceiveMessage');
		  };
	}, [chatUer]);

	const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter" && newMessage.trim() !== "") {
		  sendMessage();
		}
	  };

	const sendMessage = async () => {
        if (props.connection && newMessage.trim() !== '') {
            try {
				const newMessageObj: Message = {
					sender: user,
					senderId:user?.id,
					recipient: chatUer,
					recipientId: chatUer?.id,
					content: newMessage.trim(),
					Timestamp: new Date()
				};
                await props.connection.invoke('SendMessageToUser', chatUer?.username, username, newMessageObj);
				
				setMessages(prevMessages => [...prevMessages, newMessageObj]);
                setNewMessage('');
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

	const addInvitedPlayer = () => {

	}

	return (
		<div className="chat-main">
			<div className="friends">
				<label className="chat-title">Chat</label>
				<FrindsList userId={userId} chat={true} setUser={setChatUserAndFetchMessages} refetchFriends={false} connection={null} gameId={-1} addInvitedPlayer={addInvitedPlayer}/>
			</div>
			<div className="chat-messages">
				{(user && chatUer) && 
					<>
						<div className="chat-messages-user-info">
							<img className="friend-profile-image" src={chatUer?.profilePicture ? ('./../public/' + chatUer.profilePicture) : image } alt={chatUer?.username} />
							<label className="chat-message-username">{chatUer?.username}</label>
						</div>
						<ChatMessages user={user} messages={messages}/>
						<div className="chat-input-message">
							<input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message..." onKeyPress={handleKeyPress}/>
							<button onClick={sendMessage}>Send</button>
						</div>
					</>
				}
			</div>
		</div>
	);
};

export default Chat;