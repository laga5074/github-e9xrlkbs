import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { AuthModal } from './components/AuthModal'
import { PostList } from './components/PostList'
import './App.css'

function App() {
  const { user } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)

  return (
    <div className="app">
      <header className="app-header">
        <h1>AI SEO Blog Generator</h1>
        {!user && (
          <button onClick={() => setAuthModalOpen(true)}>
            Login to Save Posts
          </button>
        )}
      </header>

      <main className="main-content">
        {user ? (
          <>
            <div className="editor-section">
              {/* Your existing TipTap editor component */}
            </div>
            <PostList />
          </>
        ) : (
          <div className="login-prompt">
            <p>Please log in to save and manage your blog posts.</p>
            <button onClick={() => setAuthModalOpen(true)}>
              Login Now
            </button>
          </div>
        )}
      </main>

      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  )
}

export default App