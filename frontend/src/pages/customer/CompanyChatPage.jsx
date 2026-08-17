/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chatApi } from '../../api/chatApi';
import { companyApi } from '../../api/companyApi';
import ChatSidebar from './components/ChatSidebar';
import ChatWindow from './components/ChatWindow';
import NewChatModal from './components/NewChatModal';

export const CompanyChatPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // Data storage
  const [sessions, setSessions] = useState([]);
  const [companies, setCompanies] = useState({});
  const [currentSession, setCurrentSession] = useState(null);
  
  // Input & loading states
  const [inputMessage, setInputMessage] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // Create new session modal
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [availableCompanies, setAvailableCompanies] = useState([]);

  // Auto-scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Fetch all sessions and create a lookup map for company names
  const loadSessionsData = useCallback(async () => {
    try {
      const companyList = await companyApi.listCompanies();
      const companyMap = {};
      companyList.forEach((c) => {
        companyMap[c.id] = c;
      });
      setCompanies(companyMap);
      setAvailableCompanies(companyList);

      const sessionList = await chatApi.listSessions();
      setSessions(sessionList);
    } catch (err) {
      console.error('Failed to load session assets', err);
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  useEffect(() => {
    loadSessionsData();
  }, [loadSessionsData]);

  // Handle session switching / loading history
  const loadSessionHistory = useCallback(async (id) => {
    setLoadingHistory(true);
    try {
      const data = await chatApi.getSessionDetail(id);
      setCurrentSession(data);
    } catch (err) {
      console.error('Failed to load messages', err);
      setCurrentSession(null);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    if (sessionId) {
      loadSessionHistory(sessionId);
    } else {
      setCurrentSession(null);
    }
  }, [sessionId, loadSessionHistory]);

  // Scroll on new messages
  useEffect(() => {
    if (currentSession?.messages) {
      scrollToBottom();
    }
  }, [currentSession?.messages, scrollToBottom]);

  // Sending message handler
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !currentSession || sendingMessage) return;

    const messageText = inputMessage.trim();
    setInputMessage('');
    setSendingMessage(true);

    // Optimistically update the UI with the user's message
    const tempUserMsg = {
      id: Math.random().toString(),
      role: 'USER',
      content: messageText,
      created_at: new Date().toISOString()
    };

    setCurrentSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [...prev.messages, tempUserMsg]
      };
    });

    try {
      // Call Company Chat RAG API
      const result = await chatApi.sendChatMessage(
        currentSession.company,
        currentSession.id,
        messageText
      );

      // Append assistant message from api reply
      const assistantMsg = {
        id: result.assistant_message_id || Math.random().toString(),
        role: 'ASSISTANT',
        content: result.answer,
        feedback: null,
        feedback_missing_data: false,
        created_at: new Date().toISOString()
      };

      setCurrentSession((prev) => {
        if (!prev) return null;
        // Replace matching temp message flow to prevent duplication and append reply
        return {
          ...prev,
          messages: [...prev.messages.filter(m => m.id !== tempUserMsg.id), tempUserMsg, assistantMsg]
        };
      });

      // Refresh list to update updated_at timestamp order
      const updatedSessionsList = await chatApi.listSessions();
      setSessions(updatedSessionsList);
    } catch (err) {
      console.error('Failed to fetch AI reply', err);
      alert('AI response error. Please ensure your Ollama instance is active.');
    } finally {
      setSendingMessage(false);
    }
  };

  // Feedback handler
  const handleFeedbackSubmitted = async (messageId, feedback, feedbackMissingData) => {
    try {
      await chatApi.submitFeedback(messageId, feedback, feedbackMissingData);
      setCurrentSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          messages: prev.messages.map((m) => {
            if (m.id === messageId) {
              return {
                ...m,
                feedback,
                feedback_missing_data: feedbackMissingData
              };
            }
            return m;
          })
        };
      });
    } catch (err) {
      console.error('Failed to submit feedback', err);
    }
  };

  // Delete session handler
  const handleDeleteSession = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this support chat logs?')) return;

    try {
      await chatApi.deleteSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (sessionId === id) {
        navigate('/customer/chat');
      }
    } catch (err) {
      console.error('Error deleting session', err);
    }
  };

  // Create new session via Modal selection
  const handleCreateNewSession = async (companyId) => {
    setShowNewChatModal(false);
    try {
      const session = await chatApi.createSession(companyId);
      setSessions((prev) => [session, ...prev]);
      navigate(`/customer/chat/${session.id}`);
    } catch (err) {
      console.error('Error creating new session', err);
    }
  };

  // Helpers to get company info
  const getCompanyName = (companyId) => {
    return companies[companyId]?.name || 'Loading AI Assistant...';
  };

  const activeCompanyName = currentSession ? getCompanyName(currentSession.company) : '';

  return (
    <div className="flex flex-grow h-[calc(100vh-64px)] overflow-hidden -m-8">
      {/* Session History Sidebar */}
      <ChatSidebar
        sessions={sessions}
        loadingSessions={loadingSessions}
        sessionId={sessionId}
        getCompanyName={getCompanyName}
        onSelectSession={(id) => navigate(`/customer/chat/${id}`)}
        onDeleteSession={handleDeleteSession}
        onOpenNewChatModal={() => setShowNewChatModal(true)}
      />

      {/* Main Workspace */}
      <ChatWindow
        currentSession={currentSession}
        currentCompany={currentSession ? companies[currentSession.company] : null}
        activeCompanyName={activeCompanyName}
        loadingHistory={loadingHistory}
        sendingMessage={sendingMessage}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        handleSendMessage={handleSendMessage}
        messagesEndRef={messagesEndRef}
        onOpenNewChatModal={() => setShowNewChatModal(true)}
        onFeedbackSubmitted={handleFeedbackSubmitted}
      />

      {/* Select Company Modal for New Chat */}
      <NewChatModal
        show={showNewChatModal}
        availableCompanies={availableCompanies}
        onCreateSession={handleCreateNewSession}
        onClose={() => setShowNewChatModal(false)}
      />
    </div>
  );
};

export default CompanyChatPage;
