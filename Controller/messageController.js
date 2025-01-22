import Message from "../Model/message.js";
import User from "../Model/userSchema.js";

export const sendMessage = async (req, res) => {
    try {
        const { text, receiverId } = req.body;

        if(!text || !receiverId){
            return res.status(400).json({ message: "Missing required fields" });
        }

        const sender = await User.findById(req.user._id);
        const receiver = await User.findById(receiverId);
        if(!sender || !receiver){
            return res.status(404).json({ message: "User not found" });
        }
        const message = new Message({ text, sender: sender._id, receiver: receiver._id, timestamp: new Date() });
        await message.save();
        res.status(201).json({ message: "Message sent successfully",user: { name: sender.name, _id: sender._id  },
            message:{text:message.text,timestamp:message.timestamp,receiver:receiver.name,sender:sender.name} });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { receiverId } = req.params;
        if(!receiverId){
            return res.status(400).json({ message: "Missing required fields" });
        }
        const messages = await Message.find({
            $or: [
                { sender: req.user._id, receiver: receiverId },
                { sender: receiverId, receiver: req.user._id },
            ],
        }).sort({ timestamp: 1 }).populate("sender","name _id email").populate("receiver","name _id email");
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}