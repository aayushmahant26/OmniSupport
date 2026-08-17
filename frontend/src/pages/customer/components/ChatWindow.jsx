import { Bot, Sparkles, MessageSquare, Plus } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInputForm from './ChatInputForm';

export const ChatWindow = ({
  currentSession,
  currentCompany,
  activeCompanyName,
  loadingHistory,
  sendingMessage,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  messagesEndRef,
  onOpenNewChatModal,
  onFeedbackSubmitted,
}) => {
  const logoUrl = currentCompany?.logo
    ? (currentCompany.logo.startsWith('http') ? currentCompany.logo : `${window.location.origin}${currentCompany.logo}`)
    : null;

  const videoUrl = currentCompany?.video
    ? (currentCompany.video.startsWith('http') ? currentCompany.video : `${window.location.origin}${currentCompany.video}`)
    : null;

  return (
    <div className="flex-grow flex flex-col bg-bgBase relative">
      {currentSession ? (
        <>
          {/* Header info */}
          <div className="px-8 py-4 border-b border-borderColor bg-bgSurface/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-borderColor bg-bgSurfaceElevated flex items-center justify-center overflow-hidden flex-shrink-0">
                {logoUrl ? (
                  <img src={logoUrl} alt={activeCompanyName} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-sm font-extrabold text-textMuted">
                    {activeCompanyName ? activeCompanyName.substring(0, 1).toUpperCase() : '?'}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-textPrimary">{activeCompanyName} AI Agent</h3>
                <span className="text-[11px] text-textSecondary flex items-center gap-1">
                  <Sparkles size={11} className="text-primary" />
                  Context-Aware RAG active
                </span>
              </div>
            </div>
          </div>

          {/* Messages box */}
          <div className="flex-grow overflow-y-auto p-8 flex flex-col gap-6">
            {loadingHistory ? (
              <div className="flex flex-grow items-center justify-center">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            ) : currentSession.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-textSecondary text-center p-8 max-w-[480px] mx-auto">
                <div className="w-16 h-16 rounded-xl border border-borderColor bg-bgSurfaceElevated flex items-center justify-center overflow-hidden mb-4 shadow-sm">
                  {logoUrl ? (
                    <img src={logoUrl} alt={activeCompanyName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-3xl font-extrabold text-textMuted">
                      {activeCompanyName ? activeCompanyName.substring(0, 1).toUpperCase() : '?'}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold mb-2 text-textPrimary">Start Chatting with {activeCompanyName}</h3>
                <p className="text-xs leading-relaxed">
                  Ask anything about {activeCompanyName}'s policy, support hours, terms, or services. The AI reads documents provided by {activeCompanyName} to answer.
                </p>
              </div>
            ) : (
              currentSession.messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  msg={msg}
                  onFeedbackSubmitted={onFeedbackSubmitted}
                  companyLogo={logoUrl}
                  activeCompanyName={activeCompanyName}
                />
              ))
            )}

            {/* Typing loader */}
            {sendingMessage && (
              <div className="flex w-full justify-start">
                <div className="max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed flex gap-3.5 items-start bg-bgSurface border border-borderColor text-textPrimary rounded-bl-sm">
                  <div className="w-7 h-7 rounded-full border border-borderColor bg-bgSurfaceElevated flex items-center justify-center overflow-hidden flex-shrink-0">
                    {logoUrl ? (
                      <img src={logoUrl} alt={activeCompanyName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-[10px] font-extrabold text-textMuted">
                        {activeCompanyName ? activeCompanyName.substring(0, 1).toUpperCase() : '?'}
                      </div>
                    )}
                  </div>
                  <div className="typing-indicator flex items-center gap-1">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <ChatInputForm
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            onSubmit={handleSendMessage}
            sendingMessage={sendingMessage}
            activeCompanyName={activeCompanyName}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-textSecondary text-center p-8 max-w-[480px] mx-auto my-auto">
          <MessageSquare size={48} className="text-borderColor mb-5" />
          <h2 className="text-xl font-bold mb-2 text-textPrimary">No Active Chat Session</h2>
          <p className="text-sm leading-relaxed mb-6">
            Select an existing chat from history, or create a new chat by choosing a company from the directory.
          </p>
          <button
            onClick={onOpenNewChatModal}
            className="inline-flex items-center justify-center gap-2 font-semibold text-sm py-3 px-6 rounded-md cursor-pointer transition-all duration-150 text-center bg-gradient-to-r from-primary to-accentPurple text-white shadow-[0_4px_12px_rgba(59,130,246,0.2)] hover:opacity-95 hover:-translate-y-px"
          >
            <Plus size={16} />
            <span>Start New Support Chat</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
