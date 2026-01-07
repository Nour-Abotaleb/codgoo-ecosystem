import { useState } from "react";
import type { DashboardTokens } from "../types";
import { CreateTicketModal } from "./modals/CreateTicketModal";
import { SendEmailModal } from "./modals/SendEmailModal";

// Icons
const TicketsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M1.94727 10.508C1.94727 7.65494 3.26184 6.10667 5.88123 5.88271C6.11494 5.8535 6.35837 5.84375 6.61155 5.84375H12.8436C15.9498 5.84375 17.5078 7.40176 17.5078 10.508V14.403C17.5078 14.6562 17.4981 14.8997 17.4689 15.1334C17.2449 17.7625 15.6967 19.0673 12.8436 19.0673H12.4541C12.2106 19.0673 11.9769 19.1842 11.8308 19.3789L10.6624 20.9369C10.1463 21.6283 9.30883 21.6283 8.79275 20.9369L7.62423 19.3789C7.49764 19.2134 7.21527 19.0673 7.00104 19.0673H6.61155C3.50528 19.0673 1.94727 18.2981 1.94727 14.403" stroke="currentColor" strokeWidth="1.46063" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21.4025 6.6135C21.4025 3.50723 19.8445 1.94922 16.7382 1.94922H10.5062C7.65309 1.94922 6.10482 3.26379 5.88086 5.88319C6.11456 5.85398 6.358 5.84423 6.61117 5.84423H12.8432C15.9495 5.84423 17.5075 7.40224 17.5075 10.5085V14.4035C17.5075 14.6567 17.4977 14.9001 17.4685 15.1338C20.0879 14.9099 21.4025 13.3713 21.4025 10.5085" stroke="currentColor" strokeWidth="1.46063" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.1407 12.9009H13.1495" stroke="currentColor" strokeWidth="1.94751" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.73249 12.9009H9.74126" stroke="currentColor" strokeWidth="1.94751" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.32429 12.9009H6.33306" stroke="currentColor" strokeWidth="1.94751" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M15.2971 14.7812L12.2785 12.9797C11.7527 12.6681 11.3242 11.9183 11.3242 11.3049V7.3125" stroke="currentColor" strokeWidth="1.46063" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.89477 5.84423C2.67758 7.4704 1.94727 9.4958 1.94727 11.6867C1.94727 17.0619 6.30968 21.4243 11.6848 21.4243C17.0599 21.4243 21.4223 17.0619 21.4223 11.6867C21.4223 6.31163 17.0599 1.94922 11.6848 1.94922C10.2923 1.94922 8.95828 2.24134 7.76057 2.77691" stroke="currentColor" strokeWidth="1.46063" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M10.7109 1.21875C5.46744 1.21875 1.2168 5.4694 1.2168 10.7128C1.2168 15.9563 5.46744 20.2069 10.7109 20.2069C13.0697 20.2069 15.2276 19.3467 16.888 17.9228L20.9058 21.9405C21.191 22.2257 21.6534 22.2257 21.9386 21.9405C22.2238 21.6553 22.2238 21.1929 21.9386 20.9077L17.9209 16.89C19.3447 15.2296 20.205 13.0717 20.205 10.7128C20.205 5.4694 15.9543 1.21875 10.7109 1.21875ZM2.67743 10.7128C2.67743 6.27608 6.27413 2.67938 10.7109 2.67938C15.1476 2.67938 18.7443 6.27608 18.7443 10.7128C18.7443 15.1496 15.1476 18.7463 10.7109 18.7463C6.27413 18.7463 2.67743 15.1496 2.67743 10.7128Z" fill="#B0B0B0"/>
  </svg>
);

const BackArrowIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AttachmentIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59723 21.9983 8.005 21.9983C6.41277 21.9983 4.88584 21.3658 3.76 20.24C2.63416 19.1142 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63416 12.8758 3.76 11.75L12.33 3.18C13.0806 2.42975 14.0991 2.00129 15.16 2.00129C16.2209 2.00129 17.2394 2.42975 17.99 3.18C18.7403 3.93063 19.1687 4.94905 19.1687 6.01C19.1687 7.07095 18.7403 8.08937 17.99 8.84L9.41 17.41C9.03472 17.7853 8.52573 17.9961 7.995 17.9961C7.46427 17.9961 6.95528 17.7853 6.58 17.41C6.20472 17.0347 5.99389 16.5257 5.99389 15.995C5.99389 15.4643 6.20472 14.9553 6.58 14.58L15.07 6.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EmojiIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="9" cy="9" r="1" fill="currentColor"/>
    <circle cx="15" cy="9" r="1" fill="currentColor"/>
  </svg>
);

const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EmptyTicketsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M7.97852 43.0462C7.97852 31.3576 13.3641 25.0146 24.0952 24.0971C25.0527 23.9774 26.05 23.9375 27.0872 23.9375H52.6185C65.3443 23.9375 71.7272 30.3204 71.7272 43.0462V59.0033C71.7272 60.0405 71.6873 61.0378 71.5676 61.9952C70.6501 72.7663 64.3071 78.1118 52.6185 78.1118H51.0229C50.0255 78.1118 49.068 78.5906 48.4697 79.3884L43.6826 85.7713C41.5683 88.6037 38.1374 88.6037 36.0231 85.7713L31.2359 79.3884C30.7173 78.7103 29.5605 78.1118 28.6829 78.1118H27.0872C14.3614 78.1118 7.97852 74.9604 7.97852 59.0033" stroke="currentColor" strokeWidth="4" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M87.6809 27.0891C87.6809 14.3633 81.298 7.98047 68.5722 7.98047H43.0409C31.3523 7.98047 25.0093 13.366 24.0918 24.0972C25.0492 23.9775 26.0465 23.9376 27.0838 23.9376H52.6151C65.3409 23.9376 71.7238 30.3205 71.7238 43.0462V59.0034C71.7238 60.0406 71.6838 61.0379 71.5642 61.9953C82.2953 61.0778 87.6809 54.7747 87.6809 43.0462" stroke="currentColor" strokeWidth="4" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M53.838 52.8579H53.8739" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M39.8751 52.8579H39.911" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M25.9122 52.8579H25.9481" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

type Message = {
  id: string;
  sender: "user" | "support";
  senderName?: string;
  content: string;
  timestamp: string;
  attachment?: string;
};

type Ticket = {
  id: string;
  title: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  priority: "High Priority" | "Medium" | "Low";
  category: "Billing" | "Technical" | "General" | "Account";
  description: string;
  messages: number;
  updatedAt: string;
  createdAt: string;
  conversation: Message[];
};

const mockTickets: Ticket[] = [
  {
    id: "1",
    title: "Bundle payment issue - transaction failed",
    status: "Open",
    priority: "High Priority",
    category: "Billing",
    description: "Good news! The payment has been processed successfully and your Professional bundle is now active.",
    messages: 2,
    updatedAt: "Yesterday",
    createdAt: "3 days ago",
    conversation: [
      {
        id: "m1",
        sender: "user",
        content: "Hi, I tried to purchase the Professional bundle but the payment failed. The amount was deducted from my account but I didn't receive the bundle. Transaction ID: TXN123456789",
        timestamp: "3 days ago",
        attachment: "screenshot-payment.png"
      },
      {
        id: "m2",
        sender: "support",
        senderName: "Ahmed (Support Team)",
        content: "Hello! Thank you for contacting us. I'm sorry to hear about the payment issue. I've checked your transaction and can see it's pending. Let me escalate this to our billing team right away",
        timestamp: "3 days ago"
      },
      {
        id: "m3",
        sender: "support",
        senderName: "Ahmed (Support Team)",
        content: "Hello! Thank you for contacting us. I'm sorry to hear about the payment issue. I've checked your transaction and can see it's pending. Let me escalate this to our billing team right away",
        timestamp: "3 days ago"
      }
    ]
  },
  {
    id: "2",
    title: "Unable to access cloud dashboard",
    status: "In Progress",
    priority: "Medium",
    category: "Technical",
    description: "I'm experiencing issues accessing my cloud dashboard. The page keeps loading indefinitely.",
    messages: 5,
    updatedAt: "2 days ago",
    createdAt: "5 days ago",
    conversation: []
  },
  {
    id: "3",
    title: "Request for account upgrade",
    status: "Resolved",
    priority: "Low",
    category: "Account",
    description: "I would like to upgrade my account to the enterprise plan.",
    messages: 3,
    updatedAt: "1 week ago",
    createdAt: "2 weeks ago",
    conversation: []
  },
  {
    id: "4",
    title: "API integration support needed",
    status: "Open",
    priority: "High Priority",
    category: "Technical",
    description: "Need help integrating the REST API with our existing system.",
    messages: 8,
    updatedAt: "3 hours ago",
    createdAt: "1 day ago",
    conversation: []
  }
];

type SupportViewProps = {
  readonly tokens: DashboardTokens;
  readonly primaryColor?: string;
};

export const SupportView = ({ 
  tokens,
  primaryColor = "#0F6773"
}: SupportViewProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tickets] = useState<Ticket[]>(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [isSendEmailModalOpen, setIsSendEmailModalOpen] = useState(false);

  const filteredTickets = tickets.filter(ticket => 
    ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusStyle = (status: Ticket["status"]) => {
    switch (status) {
      case "Open":
        return { backgroundColor: "#E9ECFF", color: "#4318FF" };
      case "In Progress":
        return { backgroundColor: "#FFF4D7", color: "#D4A017" };
      case "Resolved":
        return { backgroundColor: "#E2FFE9", color: "#34C759" };
      case "Closed":
        return { backgroundColor: "#F0F0F0", color: "#666666" };
      default:
        return { backgroundColor: "#E9ECFF", color: "#4318FF" };
    }
  };

  const getPriorityStyle = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "High Priority":
        return { backgroundColor: "#FFF4D7", color: "#D4A017" };
      case "Medium":
        return { backgroundColor: "#E9ECFF", color: "#4318FF" };
      case "Low":
        return { backgroundColor: "#E2FFE9", color: "#34C759" };
      default:
        return { backgroundColor: "#E9ECFF", color: "#4318FF" };
    }
  };

  const getCategoryStyle = (category: Ticket["category"]) => {
    switch (category) {
      case "Billing":
        return { backgroundColor: primaryColor, color: "#FFFFFF" };
      case "Technical":
        return { backgroundColor: "#E7F0F1", color: primaryColor };
      case "General":
        return { backgroundColor: "#F0F0F0", color: "#666666" };
      case "Account":
        return { backgroundColor: "#E9ECFF", color: "#4318FF" };
      default:
        return { backgroundColor: "#E7F0F1", color: primaryColor };
    }
  };

  const cardClass = `${tokens.cardBase} rounded-[20px] p-6`;

  // Ticket Detail View
  if (selectedTicket) {
    return (
      <div className="flex flex-col gap-6 h-full">
        {/* Header */}
        <div className={cardClass}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors"
                style={{ backgroundColor: "#E7F0F1", color: primaryColor }}
              >
                <BackArrowIcon className="h-5 w-5" />
              </button>
              <div>
                <h1 className={`text-xl font-bold ${tokens.isDark ? "text-white" : "text-black"}`}>
                  {selectedTicket.title}
                </h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span 
                    className="px-3 py-1 text-xs font-medium rounded-full"
                    style={getStatusStyle(selectedTicket.status)}
                  >
                    {selectedTicket.status}
                  </span>
                  <span 
                    className="px-3 py-1 text-xs font-medium rounded-full"
                    style={getPriorityStyle(selectedTicket.priority)}
                  >
                    {selectedTicket.priority}
                  </span>
                  <span 
                    className="px-3 py-1 text-xs font-medium rounded-full"
                    style={getCategoryStyle(selectedTicket.category)}
                  >
                    {selectedTicket.category}
                  </span>
                </div>
              </div>
            </div>
            <div className={`text-sm ${tokens.subtleText}`}>
              Created {selectedTicket.createdAt}
            </div>
          </div>
        </div>

        {/* Conversation */}
        <div className={`${cardClass} flex-1 flex flex-col min-h-[400px]`}>
          <div className="flex-1 overflow-y-auto space-y-6 pb-4">
            {selectedTicket.conversation.map((message) => (
              <div key={message.id} className={`flex flex-col ${message.sender === "user" ? "items-end" : "items-start"}`}>
                {/* Sender info for support messages */}
                {message.sender === "support" && (
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-sm font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>
                      {message.senderName}
                    </span>
                    <span className={`text-xs ${tokens.subtleText}`}>{message.timestamp}</span>
                  </div>
                )}
                
                {/* User timestamp */}
                {message.sender === "user" && (
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-xs ${tokens.subtleText}`}>YOU</span>
                    <span className={`text-xs ${tokens.subtleText}`}>{message.timestamp}</span>
                  </div>
                )}

                <div className="flex items-start gap-3 max-w-[80%]">
                  {/* Support avatar */}
                  {message.sender === "support" && (
                    <div 
                      className="flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0"
                      style={{ backgroundColor: "#E7F0F1", color: primaryColor }}
                    >
                      <TicketsIcon className="h-5 w-5" />
                    </div>
                  )}

                  {/* Message bubble */}
                  <div 
                    className={`rounded-2xl p-4 ${message.sender === "user" ? "rounded-tr-sm" : "rounded-tl-sm"}`}
                    style={{ 
                      backgroundColor: message.sender === "user" ? primaryColor : "#E7F0F1",
                      color: message.sender === "user" ? "#FFFFFF" : tokens.isDark ? "#333" : "#333"
                    }}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    
                    {/* Attachment */}
                    {message.attachment && (
                      <div 
                        className={`flex flex-wrap items-center gap-2 mt-3 pt-3 border-t ${
                          message.sender === "user" ? "border-white/20" : "border-gray-200"
                        }`}
                      >
                        <AttachmentIcon className="h-4 w-4" />
                        <span className="text-sm">{message.attachment}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {selectedTicket.conversation.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className={`text-sm ${tokens.subtleText}`}>No messages yet</p>
              </div>
            )}
          </div>

          {/* Reply Input */}
          <div className={`border-t pt-4 mt-auto ${tokens.isDark ? "border-white/10" : "border-gray-200"}`}>
            <div className={`rounded-2xl border ${tokens.isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-white"}`}>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Reply to ticket"
                rows={2}
                className={`w-full px-4 py-3 bg-transparent outline-none resize-none text-sm ${
                  tokens.isDark ? "text-white placeholder:text-white/50" : "text-black placeholder:text-gray-400"
                }`}
              />
              <div className="flex flex-wrap items-center justify-between px-4 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className="p-2 rounded-full transition-colors hover:bg-gray-100"
                    style={{ color: primaryColor }}
                  >
                    <AttachmentIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-full transition-colors hover:bg-gray-100"
                    style={{ color: primaryColor }}
                  >
                    <EmojiIcon className="h-5 w-5" />
                  </button>
                </div>
                <button
                  type="button"
                  className="flex flex-wrap items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-colors"
                  style={{ backgroundColor: primaryColor }}
                >
                  <span>Send Reply</span>
                  <SendIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tickets List View
  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className={cardClass}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className={`text-2xl font-bold ${tokens.isDark ? "text-white" : "text-black"}`}>
              Support Center
            </h1>
            <p className={`text-sm mt-1 ${tokens.subtleText}`}>
              Get help from our support team
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setIsSendEmailModalOpen(true)}
              className="px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
              style={{ 
                color: primaryColor,
                backgroundColor: "#E7F0F1"
              }}
            >
              Send Email
            </button>
            <button
              type="button"
              onClick={() => window.open("https://wa.me/201030036008", "_blank")}
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: "#25D366" }}
            >
              WhatsApp Support
            </button>
            <button
              type="button"
              onClick={() => setIsCreateTicketModalOpen(true)}
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              Open New Ticket
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6">
          <div 
            className={`flex flex-wrap items-center gap-3 px-4 py-3 rounded-full border ${
              tokens.isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
            }`}
          >
            <SearchIcon className="h-5 w-5 flex-shrink-0" style={{ color: primaryColor }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets..."
              className={`flex-1 bg-transparent outline-none text-sm ${
                tokens.isDark ? "text-white placeholder:text-white/50" : "text-black placeholder:text-gray-400"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Tickets Count */}
      <div className={`text-sm ${tokens.subtleText}`}>
        {filteredTickets.length} tickets found
      </div>

      {/* Tickets List */}
      <div className="flex flex-col gap-4">
        {filteredTickets.map((ticket) => (
          <div key={ticket.id} className={cardClass}>
            <div className="flex flex-col md:flex-row flex-wrap items-start gap-4">
              {/* Icon */}
              <div 
                className="flex h-12 w-12 items-center justify-center rounded-full flex-shrink-0"
                style={{ backgroundColor: "#E7F0F1", color: primaryColor }}
              >
                <TicketsIcon className="h-6 w-6" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className={`text-base font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                      {ticket.title}
                    </h3>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span 
                        className="px-3 py-1 text-xs font-medium rounded-full"
                        style={getStatusStyle(ticket.status)}
                      >
                        {ticket.status}
                      </span>
                      <span 
                        className="px-3 py-1 text-xs font-medium rounded-full"
                        style={getPriorityStyle(ticket.priority)}
                      >
                        {ticket.priority}
                      </span>
                      <span 
                        className="px-3 py-1 text-xs font-medium rounded-full"
                        style={getCategoryStyle(ticket.category)}
                      >
                        {ticket.category}
                      </span>
                    </div>

                    {/* Description */}
                    <p className={`text-sm mt-3 line-clamp-2 ${tokens.subtleText}`}>
                      {ticket.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5" style={{ color: primaryColor }}>
                        <TicketsIcon className="h-4 w-4" />
                        <span className="text-xs font-medium">{ticket.messages} messages</span>
                      </div>
                      <div className="flex items-center gap-1.5" style={{ color: primaryColor }}>
                        <ClockIcon className="h-4 w-4" />
                        <span className="text-xs font-medium">Updated {ticket.updatedAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right side - notification badge and button */}
                  <div className="flex flex-col items-end gap-3">
                    {ticket.messages > 0 && (
                      <div 
                        className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: "#FF6B6B" }}
                      >
                        {ticket.messages}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedTicket(ticket)}
                      className="px-4 py-2 rounded-full text-sm font-semibold text-white transition-colors whitespace-nowrap"
                      style={{ backgroundColor: primaryColor }}
                    >
                      View details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredTickets.length === 0 && (
          <div className={`${cardClass} text-center py-16`}>
            <EmptyTicketsIcon className="mx-auto mb-6" style={{ color: tokens.isDark ? "#666" : "#ccc" }} />
            <h3 className={`text-lg font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
              No tickets found
            </h3>
            <p className={`text-sm mt-2 mb-6 ${tokens.subtleText}`}>
              {searchQuery ? "Try adjusting your search or filters" : "You haven't created any support tickets yet"}
            </p>
            <button
              type="button"
              onClick={() => setIsCreateTicketModalOpen(true)}
              className="px-6 py-3 rounded-full text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              Open New Ticket
            </button>
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        tokens={tokens}
        isOpen={isCreateTicketModalOpen}
        onClose={() => setIsCreateTicketModalOpen(false)}
        primaryColor={primaryColor}
        onSubmit={(data) => {
          console.log("New ticket created:", data);
          // Handle ticket creation
        }}
      />

      {/* Send Email Modal */}
      <SendEmailModal
        tokens={tokens}
        isOpen={isSendEmailModalOpen}
        onClose={() => setIsSendEmailModalOpen(false)}
        primaryColor={primaryColor}
        supportEmail="support@codgoo.com"
        onSubmit={(data) => {
          console.log("Email sent:", data);
          // Handle email sending
        }}
      />
    </div>
  );
};
