import { useEffect, useState } from "react";
import * as signalR from '@microsoft/signalr';
import { useLocation } from 'react-router-dom';
// const ChatComponent = (props: { username: string; friendUsername: string}) => {
const Chat = () => {
	const location = useLocation();
  	const searchParams = new URLSearchParams(location.search);
	const username = searchParams.get('username');
	const friendUsername = searchParams.get('friendUsername');
	const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
	const [messages, setMessages] = useState<string[]>([]);
	const [newMessage, setNewMessage] = useState<string>('');

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

	  useEffect(() => {
		
		const fetchMessages = async () => {
		  	const response = await fetch('https://localhost:44364' + '/message/GetAllMessagesForChat?senderUsername=' + username + '&recipientUsername=' + friendUsername, {
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include'
			});
				
		  	const data = await response.json();
		  	data.forEach((message: any) => {
			// console.log(message.sender.name);
			// console.log(message.content);
			setMessages(prevMessages => [...prevMessages, `${message.sender.name}: ${message.content}`]);
		  	});
		  	console.log(data);
		  
		//   setFriendRequests(data);
		};
	
		fetchMessages();
	  },[]);


	useEffect(() => {
		const newConnection = new signalR.HubConnectionBuilder()
			.withUrl('https://localhost:44364/chatHub') 
			.build();
	
		newConnection.on('ReceiveMessage', (username: string, message: string) => {
			setMessages(prevMessages => [...prevMessages, `${username}: ${message}`]);
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

	const sendMessage = async () => {
        if (connection && newMessage.trim() !== '') {
            try {
                // Invoke the 'SendMessageToUser' method on the server
                await connection.invoke('SendMessageToUser', friendUsername, username, newMessage);
                setNewMessage('');
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

	return (
		<div>
		  <div>
			<h2>Chat Messages</h2>
			<ul>
			  {messages.map((msg, index) => (
				<li key={index}>{msg}</li>
			  ))}
			</ul>
		  </div>
		  <div>
			<input
			  type="text"
			  value={newMessage}
			  onChange={(e) => setNewMessage(e.target.value)}
			  placeholder="Type your message..."
			/>
			<button onClick={sendMessage}>Send</button>
		  </div>
		</div>
	);
};

export default Chat;