import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { AuthModal } from './components/AuthModal'
import { PostList } from './components/PostList'
import './App.css'

function App() {
  const { user } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [showEditor, setShowEditor] = useState(true)

  return (
    <div className="app">
      <div className="app-header">
        <h1>AI SEO Blog Generator</h1>
        {!user && (
          <button 
            className="auth-button"
            onClick={() => setAuthModalOpen(true)}
          >
            Login to Save Posts
          </button>
        )}
      </div>

      <div className="layout-container">
        <div className="main-content">
          <div className="input-section">
            {/* Your existing input section */}
          </div>

          {user && (
            <div className="post-management">
              <button 
                className="toggle-editor-button"
                onClick={() => setShowEditor(!showEditor)}
              >
                {showEditor ? 'Hide Editor' : 'Show Editor'}
              </button>
              {showEditor ? (
                <div className="editor-section">
                  {/* Your existing TipTap editor component */}
                </div>
              ) : (
                <PostList />
              )}
            </div>
          )}

          <div className="output-section">
            {/* Your existing output section */}
          </div>
        </div>

        <div className="sidebar">
          {/* Your existing sidebar content */}
        </div>
      </div>

      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  )
}

export default App