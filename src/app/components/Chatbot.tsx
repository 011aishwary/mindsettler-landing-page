"use client"
import React, { useState, useEffect, useRef } from 'react'

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm the MindSettler assistant. How can I help you today?", sender: 'bot' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { id: Date.now(), text: input, sender: 'user' }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    console.log("User input:", input);

    try {

      const res = await fetch("/api/Chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      // const res = await fetch('/api/Chatbot', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ message: input }), // Adjust key as needed
      // })
      //   const data = await res.json();
      //   console.log("Fetch response:", data);
      //   console.log("Fetch response:", res.ok);

      if (res.ok) {
        const data = await res.json()
        console.log("Response data:", data);
        const botMessage = { id: Date.now() + 1, text: data.answer, sender: 'bot' }
        setMessages(prev => [...prev, botMessage])
      } else {
        const errorMessage = { id: Date.now() + 1, text: 'Sorry, something went wrong. Please try again.', sender: 'bot' }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error: any) {
      const errorMessage = { id: Date.now() + 1, text: 'Error: ' + error.message, sender: 'bot' }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }





  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-4 cursor-pointer right-4 bg-Primary-purple text-white p-4 rounded-full shadow-lg hover:bg-Primary-purple/80 hover:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-purple3 focus:ring-offset-1 z-50"
        aria-label="Toggle Chatbot"
      >
        {isOpen ? (
          <div className='flex'>
            <svg className="w-fit h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-center">Assistant</span>
          </div>

        ) : (
          <div className='flex'>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-center">Assistant</span>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 w-80 h-96 bg-[#f1f1f1] border border-gray-200 rounded-lg shadow-xl z-40 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-400  to-purple-700 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
            <h1 className="text-lg font-semibold">MindSettler Assistant</h1>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-400 hover:scale-95 cursor-pointer focus:outline-none"
              aria-label="Close Chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] px-3 py-2 hover:purple3/90 hover:scale-97 rounded-lg text-sm ${message.sender === 'user'
                      ? 'bg-purple3 text-white'
                      : 'bg-gray-100 text-gray-800'
                    }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 px-4 py-3">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border text-Primary-purple border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple3/30 focus:border-transparent text-sm"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-4 py-2 bg-purple3 cursor-pointer text-white rounded-lg hover:bg-pruple3 hover:scale-97 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Chatbot
