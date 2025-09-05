import { useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';

export const useNotifications = () => {
  const { toast } = useToast();
  const { addToCart } = useCart();

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const sendBrowserNotification = useCallback((title: string, message: string, action?: () => void) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'kitchen-alert',
        requireInteraction: true
      });

      notification.onclick = () => {
        window.focus();
        if (action) action();
        notification.close();
      };

      // Auto close after 10 seconds
      setTimeout(() => notification.close(), 10000);
    }
  }, []);

  const sendInAppNotification = useCallback((title: string, message: string, actionLabel?: string, action?: () => void) => {
    toast({
      title,
      description: message,
    });
  }, [toast]);

  const scheduleKitchenAlerts = useCallback(() => {
    const alerts = [
      {
        title: "⚠️ Kitchen Alert",
        message: "You'll run out of Rice in 2 days. Add to cart?",
        delay: 3000,
        item: { id: 'rice-refill', name: 'Brown Rice (Organic)', price: 8.99, image: '/placeholder.svg' }
      },
      {
        title: "🔔 Restock Reminder",
        message: "Your Oil will finish in 1 week. Time to reorder!",
        delay: 8000,
        item: { id: 'oil-refill', name: 'Cooking Oil', price: 6.99, image: '/placeholder.svg' }
      },
      {
        title: "📝 Shopping List",
        message: "Based on usage, you'll need Atta in 5 days.",
        delay: 15000,
        item: { id: 'atta-refill', name: 'Wheat Flour (Atta)', price: 4.99, image: '/placeholder.svg' }
      }
    ];

    alerts.forEach(alert => {
      setTimeout(() => {
        const addToCartAction = () => {
          addToCart(alert.item);
          toast({ title: `${alert.item.name} added to cart! ✅` });
        };

        sendBrowserNotification(alert.title, alert.message, addToCartAction);
        sendInAppNotification(alert.title, alert.message, "Add to Cart", addToCartAction);
      }, alert.delay);
    });
  }, [sendBrowserNotification, sendInAppNotification, addToCart, toast]);

  const triggerInstantAlert = useCallback((item: string) => {
    const title = "⚠️ Kitchen Alert";
    const message = `You'll run out of ${item} in 2 days. Add to cart?`;
    
    const mockItem = { 
      id: `${item.toLowerCase()}-refill`, 
      name: item, 
      price: 4.99, 
      image: '/placeholder.svg' 
    };

    const addToCartAction = () => {
      addToCart(mockItem);
      toast({ title: `${item} added to cart! ✅` });
    };

    sendBrowserNotification(title, message, addToCartAction);
    sendInAppNotification(title, message, "Add to Cart", addToCartAction);
  }, [sendBrowserNotification, sendInAppNotification, addToCart, toast]);

  return {
    scheduleKitchenAlerts,
    triggerInstantAlert,
    sendBrowserNotification,
    sendInAppNotification
  };
};