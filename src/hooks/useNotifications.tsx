import React, { useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';

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
        tag: 'kitchen-smart-reminder',
        requireInteraction: false,
        silent: false
      });

      notification.onclick = () => {
        window.focus();
        if (action) action();
        notification.close();
      };

      // Auto close after 6 seconds to be less intrusive
      setTimeout(() => notification.close(), 6000);
    }
  }, []);

  const sendInAppNotification = useCallback((title: string, message: string, actionLabel?: string, action?: () => void) => {
    toast({
      title,
      description: message,
      action: actionLabel && action ? (
        <Button
          variant="eco"
          size="sm"
          onClick={action}
        >
          {actionLabel}
        </Button>
      ) : undefined,
    });
  }, [toast]);

  const scheduleKitchenAlerts = useCallback(() => {
    // Just one smart notification after 10 seconds
    const alert = {
      title: "Kitchen Assistant",
      message: "Based on your usage, you might need Rice soon. Would you like to add it to your cart?",
      item: { id: 'rice-refill', name: 'Brown Rice (Organic)', price: 8.99, image: '/placeholder.svg' }
    };

    setTimeout(() => {
      const addToCartAction = () => {
        addToCart(alert.item);
        toast({ title: `${alert.item.name} added to your cart` });
      };

      sendBrowserNotification(alert.title, alert.message, addToCartAction);
      sendInAppNotification(alert.title, alert.message, "Add to Cart", addToCartAction);
    }, 10000); // Single notification after 10 seconds
  }, [sendBrowserNotification, sendInAppNotification, addToCart, toast]);

  const triggerInstantAlert = useCallback((item: string) => {
    const title = "Kitchen Assistant";
    const message = `Based on your consumption pattern, you might need ${item} soon. Would you like to add it to your cart?`;
    
    const mockItem = { 
      id: `${item.toLowerCase()}-refill`, 
      name: item, 
      price: 4.99, 
      image: '/placeholder.svg' 
    };

    const addToCartAction = () => {
      addToCart(mockItem);
      toast({ title: `${item} added to your cart` });
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