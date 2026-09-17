import { useState } from 'react'
import {
  Search,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  AtSign,
  ArrowLeft,
  Phone,
  Video,
  Mic,
  Image as ImageIcon,
  File,
  Play,
  Pause,
} from 'lucide-react'

const MOCK_CONVERSATIONS = [
  {
    id: 1,
    name: 'Kamal Okelola',
    avatar: 'https://picsum.photos/200?random=101',
    preview: 'Re: listing the broken parts for a Toyota Camry. Do you have #488-2001 in stock?',
    timestamp: '9:32',
    unread: true,
    participants: [
      'https://picsum.photos/200?random=102',
      'https://picsum.photos/200?random=103',
      'https://picsum.photos/200?random=104',
    ],
    messages: [
      {
        id: 1,
        sender: 'Kamal Okelola',
        avatar: 'https://picsum.photos/200?random=101',
        text: 'Hi! I\'m looking for some parts for a Toyota Camry. Do you have #488-2001 in stock?',
        timestamp: 'Mar 10, 2025',
        isOwn: false,
      },
      {
        id: 2,
        sender: 'You',
        avatar: 'https://picsum.photos/200?random=100',
        text: 'Hello Kamal! Yes, we have that part in stock. Let me check the availability and get back to you ASAP!',
        timestamp: 'Mar 10, 2025',
        isOwn: true,
      },
      {
        id: 3,
        sender: 'Kamal Okelola',
        avatar: 'https://picsum.photos/200?random=101',
        text: 'Perfect! I also need to know about the shipping options to Lagos. Can you send me details?',
        timestamp: 'Mar 10, 2025',
        isOwn: false,
      },
      {
        id: 4,
        sender: 'You',
        avatar: 'https://picsum.photos/200?random=100',
        text: 'Absolutely! We offer both express and standard shipping. Here\'s a quick audio note with details:',
        timestamp: 'Mar 10, 2025',
        isOwn: true,
      },
      {
        id: 5,
        sender: 'You',
        avatar: 'https://picsum.photos/200?random=100',
        type: 'audio',
        duration: '0:30',
        timestamp: 'Mar 10, 2025',
        isOwn: true,
      },
      {
        id: 6,
        sender: 'Kamal Okelola',
        avatar: 'https://picsum.photos/200?random=101',
        text: 'Thanks! Let me review this and get back to you shortly.',
        timestamp: 'Mar 10, 2025',
        isOwn: false,
      },
      {
        id: 7,
        sender: 'You',
        avatar: 'https://picsum.photos/200?random=100',
        text: 'Here are the parts you asked about!',
        timestamp: 'Mar 10, 2025',
        isOwn: true,
        type: 'products',
        products: [
          {
            name: 'Brake Pad Set',
            price: '₦ 8,500',
            image: 'https://picsum.photos/200?random=201',
          },
          {
            name: 'Oil Filter',
            price: '₦ 1,200',
            image: 'https://picsum.photos/200?random=202',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Amear Hussain',
    avatar: 'https://picsum.photos/200?random=111',
    preview: 'The timeline goals we discussed, the goals we have in line...',
    timestamp: 'Yesterday',
    unread: false,
    participants: [],
    messages: [
      {
        id: 1,
        sender: 'Amear Hussain',
        avatar: 'https://picsum.photos/200?random=111',
        text: 'Hey! I\'m reaching out about the bulk order we discussed last week.',
        timestamp: 'Mar 09, 2025',
        isOwn: false,
      },
      {
        id: 2,
        sender: 'You',
        avatar: 'https://picsum.photos/200?random=100',
        text: 'Hi Amear! Yes, I have the quote ready. Let me send it over now.',
        timestamp: 'Mar 09, 2025',
        isOwn: true,
      },
    ],
  },
  {
    id: 3,
    name: 'Ali Khan',
    avatar: 'https://picsum.photos/200?random=112',
    preview: '1 min',
    timestamp: '1 min',
    unread: true,
    participants: [],
    messages: [],
  },
  {
    id: 4,
    name: 'Jamian Khan',
    avatar: 'https://picsum.photos/200?random=113',
    preview: 'Can we reschedule the review meeting?',
    timestamp: '2 hours ago',
    unread: false,
    participants: [],
    messages: [],
  },
  {
    id: 5,
    name: 'Nahid Khan',
    avatar: 'https://picsum.photos/200?random=114',
    preview: 'Direct Message',
    timestamp: '5 days',
    unread: false,
    participants: [],
    messages: [],
  },
  {
    id: 6,
    name: 'Henry Kairo',
    avatar: 'https://picsum.photos/200?random=115',
    preview: 'will need a new system for the coming of many...',
    timestamp: 'Yesterday',
    unread: false,
    participants: [],
    messages: [],
  },
  {
    id: 7,
    name: 'James Wiley',
    avatar: 'https://picsum.photos/200?random=116',
    preview: 'The order for your ARN will be placed in the...',
    timestamp: '2 hours ago',
    unread: false,
    participants: [],
    messages: [],
  },
  {
    id: 8,
    name: 'Will Jack',
    avatar: 'https://picsum.photos/200?random=117',
    preview: 'Ive only a few with details. We should collate on their...',
    timestamp: 'Yesterday',
    unread: false,
    participants: [],
    messages: [],
  },
  {
    id: 9,
    name: 'Headtra Willson',
    avatar: 'https://picsum.photos/200?random=118',
    preview: 'Can you send me the invoice for last month?',
    timestamp: 'Wednesday',
    unread: false,
    participants: [],
    messages: [],
  },
  {
    id: 10,
    name: 'Matt Henry',
    avatar: 'https://picsum.photos/200?random=119',
    preview: 'Thanks for the update on the shipment!',
    timestamp: 'Mar 08',
    unread: true,
    participants: [],
    messages: [],
  },
]

function AudioMessage({ isOwn, duration }) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className={`message-bubble ${isOwn ? 'own' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px' }}>
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        style={{
          background: 'var(--brand)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
      </button>

      <div style={{ flex: 1, height: '4px', background: isOwn ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)', borderRadius: '2px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: '45%',
          background: isOwn ? 'white' : 'var(--brand)',
          borderRadius: '2px',
        }} />
      </div>

      <span style={{ fontSize: '11px', fontWeight: 500, color: isOwn ? 'white' : 'var(--text-muted)' }}>
        {duration}
      </span>
    </div>
  )
}

function ProductCard({ product }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}>
      <img
        src={product.image}
        alt={product.name}
        style={{
          width: '100%',
          height: '80px',
          objectFit: 'cover',
          display: 'block',
        }}
      />
      <div style={{ padding: '8px' }}>
        <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>
          {product.name}
        </div>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand)' }}>
          {product.price}
        </div>
      </div>
    </div>
  )
}

export default function Inbox() {
  const [selectedConversation, setSelectedConversation] = useState(MOCK_CONVERSATIONS[0])
  const [searchTerm, setSearchTerm] = useState('')
  const [messageText, setMessageText] = useState('')
  const [showMobileChat, setShowMobileChat] = useState(false)

  const filteredConversations = MOCK_CONVERSATIONS.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSendMessage = () => {
    if (messageText.trim()) {
      console.log('Sending message:', messageText)
      setMessageText('')
    }
  }

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv)
    setShowMobileChat(true)
  }

  const handleBackToList = () => {
    setShowMobileChat(false)
  }

  return (
    <div className="inbox-page">
      <div className="inbox-container">
        {/* Left Sidebar - Conversation List */}
        <div className={`inbox-list ${showMobileChat ? 'mobile-hidden' : ''}`}>
          <div className="inbox-header">
            <h2>Message</h2>
            <p className="inbox-greeting">Good Morning, Kamal Okelola</p>
          </div>

          {/* Search */}
          <div className="inbox-search-wrap">
            <div className="inbox-search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="inbox-conversations">
            {filteredConversations.map(conv => (
              <div
                key={conv.id}
                className={`inbox-item ${selectedConversation.id === conv.id ? 'active' : ''} ${conv.unread ? 'unread' : ''}`}
                onClick={() => handleSelectConversation(conv)}
              >
                <img src={conv.avatar} alt={conv.name} className="inbox-avatar" />
                <div className="inbox-item-content">
                  <div className="inbox-item-header">
                    <span className="inbox-item-name">{conv.name}</span>
                    <span className="inbox-item-time">{conv.timestamp}</span>
                  </div>
                  <p className="inbox-item-preview">{conv.preview}</p>
                </div>
                {conv.unread && <span className="inbox-unread-dot" />}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Chat View */}
        <div className={`inbox-chat ${showMobileChat ? 'mobile-visible' : ''}`}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="inbox-chat-header">
                <div className="inbox-chat-header-left">
                  <button className="inbox-back-btn" onClick={handleBackToList} aria-label="Back to conversations">
                    <ArrowLeft size={18} />
                  </button>
                  <img src={selectedConversation.avatar} alt={selectedConversation.name} />
                  <div>
                    <h3>{selectedConversation.name}</h3>
                    <p>13.2 Months, 01-20-25</p>
                  </div>
                </div>

                <div className="inbox-chat-participants">
                  {selectedConversation.participants.map((avatar, idx) => (
                    <img
                      key={idx}
                      src={avatar}
                      alt="Participant"
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: '2px solid white',
                        marginLeft: idx > 0 ? '-8px' : '0',
                        objectFit: 'cover',
                      }}
                    />
                  ))}
                </div>

                <div className="inbox-chat-header-right">
                  <button className="inbox-action-btn">
                    <Phone size={18} />
                  </button>
                  <button className="inbox-action-btn">
                    <Video size={18} />
                  </button>
                  <button className="inbox-action-btn">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="inbox-messages">
                {selectedConversation.messages.length > 0 ? (
                  selectedConversation.messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`inbox-message ${msg.isOwn ? 'own' : 'other'}`}
                    >
                      {!msg.isOwn && <img src={msg.avatar} alt={msg.sender} className="message-avatar" />}

                      <div className="message-content">
                        {msg.text && (
                          <div className={`message-bubble ${msg.isOwn ? 'own' : ''}`}>
                            <p>{msg.text}</p>
                            <span className="message-time">{msg.timestamp}</span>
                          </div>
                        )}

                        {msg.type === 'audio' && <AudioMessage isOwn={msg.isOwn} duration={msg.duration} />}

                        {msg.type === 'products' && (
                          <div className="message-products" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                            {msg.products.map((product, idx) => (
                              <ProductCard key={idx} product={product} />
                            ))}
                          </div>
                        )}

                        {msg.text && !msg.type && (
                          <div className={`message-bubble ${msg.isOwn ? 'own' : ''}`} style={{ display: 'none' }}>
                          </div>
                        )}
                      </div>

                      {msg.isOwn && <img src={msg.avatar} alt={msg.sender} className="message-avatar" />}
                    </div>
                  ))
                ) : (
                  <div className="inbox-empty">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="inbox-input-area">
                <div className="inbox-input-actions">
                  <button className="input-action-btn">
                    <Smile size={18} />
                  </button>
                  <button className="input-action-btn">
                    <Paperclip size={18} />
                  </button>
                  <button className="input-action-btn">
                    <ImageIcon size={18} />
                  </button>
                  <button className="input-action-btn">
                    <File size={18} />
                  </button>
                </div>

                <div className="inbox-input-field">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <div className="inbox-input-right">
                    <button className="input-action-btn mic-btn">
                      <Mic size={18} />
                    </button>
                    <button
                      className="send-btn"
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="inbox-empty">
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
