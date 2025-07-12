import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationService } from '@/services/NotificationService';
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  related_id?: string;
  action_url?: string;
  is_read: boolean;
  created_at: string;
  read_at?: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { notifications: fetchedNotifications, error: fetchError } = 
      await NotificationService.getUserNotifications(user.id);

    if (fetchError) {
      setError(fetchError);
    } else {
      setNotifications(fetchedNotifications || []);
    }

    setLoading(false);
  };

  const markAsRead = async (notificationId: string) => {
    const { error } = await NotificationService.markAsRead(notificationId);
    
    if (!error) {
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true, read_at: new Date().toISOString() }
            : notification
        )
      );
    }
    
    return { error };
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  // Set up real-time subscription for new notifications
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    refetch: fetchNotifications
  };
};