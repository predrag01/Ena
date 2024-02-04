import { Message } from "../models/message.model";
import image from "./../assets/noProfilePicture.png"

const MessageComonent = (props: {message: Message, right: boolean}) => {
    const messageClasses = props.right ? "message-row-right" : "message-row-left";

    return (
        <div  className="message">
            <div className={messageClasses}>
                <img className="message-profile-img" src={props.message.sender?.profilePicture ? ('./../public/' + props.message.sender?.profilePicture) : image } alt={props.message.sender?.profilePicture} />
                <label className="message-content">{props.message.content}</label>
            </div>
        </div>
    )
}

export default MessageComonent;