import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface Post {
  id: string;
  title: string;
  content: string;
  meta_description: string;
  focus_keyword: string;
  tags: string[];
  wordpress_status: string;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
}

export function usePosts(user: User | null) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        if (user) {
          const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;
          setPosts(data || []);
        }
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [user]);

  const savePost = async (post: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      if (!user) throw new Error('Must be logged in to save posts');

      const { data, error } = await supabase
        .from('posts')
        .insert([{ 
          user_id: user.id,
          ...post,
          meta_description: post.meta_description || extractMetaDescription(post.content),
          wordpress_status: 'draft',
          is_hidden: false
        }])
        .select()
        .single();

      if (error) throw error;
      setPosts(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error saving post:', error);
      throw error;
    }
  };

  const updatePost = async (id: string, updates: Partial<Post>) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setPosts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
      return data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  };

  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  };

  // Helper function to extract meta description from content
  const extractMetaDescription = (content: string): string => {
    // Remove HTML tags and get first 155 characters
    const plainText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return plainText.substring(0, 155);
  };

  return { posts, loading, savePost, updatePost, deletePost };
}