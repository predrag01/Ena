import { useEffect, useState } from "react";
import * as signalR from '@microsoft/signalr';
import { useLocation } from 'react-router-dom';
import FrindsList from "../components/FriendsList";
import { User } from "../models/user.model";
import ChatMessages from "../components/ChatMessages";
import image from "./../assets/noProfilePicture.png"
import { Message } from "../models/message.model";
import Cookies from "js-cookie";
// const ChatComponent = (props: { username: string; friendUsername: string}) => {
const Chat = (props: {setShowNotifications:(value: boolean)=>void, setShowMessages:(value: boolean)=>void, showMessages:boolean}) => {
	
	const location = useLocation();
  	const searchParams = new URLSearchParams(location.search);
	const username = searchParams.get('username');
	const friendUsername = searchParams.get('friendUsername');
	const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState<string>('');
  	const [userId, setUserId] = useState(-1);
	const [chatUer, setChatUser] = useState<User>();
	const [user, setUser] = useState<User>();


	// useEffect(() => {
	// 	// Create a new SignalR connection
	// 	const newConnection = new signalR.HubConnectionBuilder()
	// 	.withUrl('https://localhost:44364/chatHub') 
	// 	.build();

	// 	// Set up event handlers for receiving messages
	// 	newConnection.on('ReceiveMessage', (username: string, message: string) => {
	// 		// console.log(messages);
	// 		// setMessages([...messages, `${username}: ${message}`]);
	// 		setMessages(prevMessages => [...prevMessages, `${username}: ${message}`]);
	// 		// console.log(messages);
	// 	});

	// 	// Start the connection
	// 	newConnection
	// 	.start()
	// 	.then(() => {
	// 		console.log('SignalR connection established');
	// 	})
	// 	.catch((error) => {
	// 		console.error('Error establishing SignalR connection:', error);
	// 	});

	// 	setConnection(newConnection);

	// 	return () => {
	// 	// Cleanup function to close the connection when the component unmounts
	// 	if (newConnection) {
	// 		newConnection.stop();
	// 	}
	// 	};
  	// }, []); // Only run this effect on component mount and unmount

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
			console.log(content.username + "chat");
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
					
				// const data = await response.json();
				// data.forEach((message: any) => {
				// // console.log(message.sender.name);
				// // console.log(message.content);
				// setMessages(prevMessages => [...prevMessages, `${message.sender.name}: ${message.content}`]);
				// });
				// console.log(data);

				const data: Message[] = await response.json();
      			setMessages((prevMessages) => [...prevMessages, ...data]);
			
			//   setFriendRequests(data);
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
		
		const newConnection = new signalR.HubConnectionBuilder()
			.withUrl('https://localhost:44364/chatHub') 
			.build();
	
		newConnection.on('ReceiveMessage', (username: string, message: Message) => {
			setMessages(prevMessages => [...prevMessages, message]);
		});
	
		newConnection.start()
			.then(() => {
				// Join a group using the usernames of the two users
				newConnection.invoke('JoinGroup', username);
				newConnection.invoke('JoinGroup', friendUsername);
				console.log('SignalR connection established');
			})
			.catch((error) => {
				console.error('Error establishing SignalR connection:', error);
			});
	
		setConnection(newConnection);
	
		return () => {
			if (newConnection) {
				// Leave the group when the component unmounts
				newConnection.invoke('LeaveGroup', username);
				newConnection.invoke('LeaveGroup', friendUsername);
				newConnection.stop();
			}
		};
	}, [username, friendUsername]);

	// const sendMessage = async () => {
	// 	if (connection && newMessage.trim() !== '') {
	// 	try {
	// 		// Invoke the 'SendMessage' method on the server
	// 		await connection.invoke('SendMessage', props.username, newMessage);
	// 		setNewMessage('');
	// 	} catch (error) {
	// 		console.error('Error sending message:', error);
	// 	}
	// 	}
	// };

	// const sendMessage = async () => {
	// 	if (connection && newMessage.trim() !== '') {
	// 		try {
	// 			// Invoke the 'SendMessageToGroup' method on the server
	// 			await connection.invoke('SendMessageToGroup', friendUsername, newMessage);
	// 			setNewMessage('');
	// 		} catch (error) {
	// 			console.error('Error sending message:', error);
	// 		}
	// 	}
	// };

	const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter" && newMessage.trim() !== "") {
		  sendMessage();
		}
	  };

	const sendMessage = async () => {
        if (connection && newMessage.trim() !== '') {
            try {
				const newMessageObj: Message = {
					sender: user,
					senderId:user?.id,
					recipient: chatUer,
					recipientId: chatUer?.id,
					content: newMessage.trim(),
					Timestamp: new Date()
				};
                // Invoke the 'SendMessageToUser' method on the server
                await connection.invoke('SendMessageToUser', friendUsername, username, newMessageObj);
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
						<ChatMessages user={user} friend={chatUer} messages={messages}/>
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