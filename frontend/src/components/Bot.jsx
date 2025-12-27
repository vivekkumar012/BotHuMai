import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

const Bot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) {
      return;
    }

    const userInput = input;
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:3001/v1/bot/message",
        {
          text: userInput,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: res.data.userMessage, sender: "user" },
          { text: res.data.botMessage, sender: "bot" },
        ]);
      }
    } catch (error) {
      console.log("Error while Sending message", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: userInput, sender: "user" },
        { text: "Sorry, there was an error. Please try again.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <div className="flex flex-col min-h-screen text-white bg-[#0d0d0d]">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full border-b z-10 border-gray-800 bg-[#0d0d0d]">
        <div className="flex justify-between items-center px-6 py-4 container mx-auto">
          <h1 className="text-lg font-bold text-white">BotHuMai</h1>
          <FaUserCircle size={30} className="cursor-pointer" />
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto pt-20 pb-24 flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 flex flex-col space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 text-lg">
              👋 Hi, I'm{" "}
              <span className="text-green-500 font-semibold">Bot</span>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`px-4 py-2 rounded-xl max-w-[70%] ${
                    msg.sender === "user"
                      ? "bg-green-600 text-white self-end ml-auto"
                      : "bg-gray-700 text-gray-200 self-start"
                  }`}
                >
                  {msg.text}
                </div>
              ))}

              {loading && (
                <div className="bg-gray-700 text-gray-300 px-4 py-2 rounded-xl max-w-[60%] self-start">
                  Bot is typing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </main>

      {/* Input And Footer */}
      <footer className="fixed bottom-0 left-0 w-full border-t border-gray-800 bg-[#0d0d0d] z-10">
        <div className="max-w-4xl mx-auto flex justify-center px-4 py-3">
          <div className="w-full flex bg-gray-900 rounded-full px-4 py-2 shadow-lg">
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 px-2"
              placeholder="Ask BotSpoof..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded-full text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Bot;
