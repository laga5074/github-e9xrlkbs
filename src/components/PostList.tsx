import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePosts } from '../hooks/usePosts';

interface Post {
  id: string;
  title: string;
  meta_description: string;
  wordpress_status: string;
  is_hidden: boolean;
}

export function PostList() {
  const { user } = useAuth();
  const { posts, deletePost, updatePost } = usePosts(user);

  const toggleVisibility = async (post: Post) => {
    await updatePost(post.id, { is_hidden: !post.is_hidden });
  };

  const handlePublish = async (post: Post) => {
    // TODO: Implement WordPress publishing
    await updatePost(post.id, { wordpress_status: 'published' });
  };

  return (
    <div className="post-list">
      {posts.map((post: Post) => (
        <div key={post.id} className={`post-item ${post.is_hidden ? 'hidden' : ''}`}>
          <h3>{post.title}</h3>
          <p>{post.meta_description}</p>
          <div className="post-actions">
            <button onClick={() => toggleVisibility(post)}>
              {post.is_hidden ? 'Show' : 'Hide'}
            </button>
            <button onClick={() => deletePost(post.id)}>Delete</button>
            <button 
              onClick={() => handlePublish(post)}
              disabled={post.wordpress_status === 'published'}
            >
              {post.wordpress_status === 'published' ? 'Published' : 'Publish to WordPress'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}