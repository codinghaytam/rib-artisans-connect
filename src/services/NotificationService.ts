import { supabase } from '@/integrations/supabase/client';

export interface CreateNotificationRequest {
  user_id: string;
  title: string;
  message: string;
  type: string;
  related_id?: string;
  action_url?: string;
}

export class NotificationService {
  static async createNotification(notification: CreateNotificationRequest): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.functions.invoke('create-notification', {
        body: notification
      });

      if (error) {
        console.error('Error creating notification:', error);
        return { error: error.message };
      }

      return {};
    } catch (error: any) {
      console.error('Error calling notification service:', error);
      return { error: error.message || 'Failed to create notification' };
    }
  }

  static async markAsRead(notificationId: string): Promise<{ error?: string }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return { error: error.message };
      }

      return {};
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      return { error: error.message || 'Failed to mark notification as read' };
    }
  }

  static async getUserNotifications(userId: string, limit: number = 50): Promise<{ 
    notifications?: any[], 
    error?: string 
  }> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching notifications:', error);
        return { error: error.message };
      }

      return { notifications: data || [] };
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      return { error: error.message || 'Failed to fetch notifications' };
    }
  }
}