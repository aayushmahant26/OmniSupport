import { Plus, Trash2 } from 'lucide-react';

export const ChatSidebar = ({
  sessions,
  loadingSessions,
  sessionId,
  getCompanyName,
  onSelectSession,
  onDeleteSession,
  onOpenNewChatModal,
}) => {
  return (
    <aside className="w-[280px] bg-bgSurface border-r border-borderColor flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-borderColor">
        <button 
          onClick={onOpenNewChatModal} 
          className="w-full inline-flex items-center justify-center gap-2 font-semibold text-sm py-3 px-6 rounded-md cursor-pointer transition-all duration-150 text-center bg-gradient-to-r from-primary to-accentPurple text-white shadow-[0_4px_12px_rgba(59,130,246,0.2)] hover:opacity-95 hover:-translate-y-px"
        >
          <Plus size={16} />
          <span>New Support Chat</span>
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-3 flex flex-col gap-1">
        {loadingSessions ? (
          <div className="py-5 text-center">
            <div className="typing-indicator flex justify-center">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        ) : sessions.length === 0 ? (
          <div className="py-5 text-center text-textMuted text-xs">
            No active support chats
          </div>
        ) : (
          sessions.map((s) => {
            const active = sessionId === s.id;
            return (
              <div 
                key={s.id} 
                className={`flex items-center justify-between w-full p-3 rounded-md cursor-pointer text-left transition-all duration-150 text-sm group ${
                  active 
                    ? 'bg-primary/10 border border-primary/30 text-textPrimary' 
                    : 'text-textSecondary hover:bg-bgSurfaceElevated hover:text-textPrimary'
                }`}
                onClick={() => onSelectSession(s.id)}
              >
                <div className="flex flex-col gap-0.5 overflow-hidden">
                  <span className="font-semibold text-ellipsis overflow-hidden white-space-nowrap">
                    {getCompanyName(s.company)}
                  </span>
                  <span className="text-[11px] text-textMuted">
                    {new Date(s.updated_at).toLocaleDateString()}
                  </span>
                </div>
                <button 
                  onClick={(e) => onDeleteSession(e, s.id)}
                  className="p-1 rounded text-textMuted hover:text-error hover:bg-error/15 opacity-0 group-hover:opacity-100 transition-all duration-150"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default ChatSidebar;
