import React, { useEffect } from 'react';
import AdElement from '../AdElement';
import { getSubscribeInfo } from '@/utils/storage';

const MyTournamentsAdsHorizontal = () => {
  useEffect(() => {

    const isSubscribed = getSubscribeInfo();
    if (isSubscribed) return null;

    // Load the AdSense script
    const loadAdSense = () => {
      try {
        // Check if window.adsbygoogle is already defined
        if (window.adsbygoogle === undefined) {
          window.adsbygoogle = [];
        }
        window.adsbygoogle.push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    };

    // Load the script only on client side
    if (typeof window !== 'undefined') {
      // Check if the script is already loaded
      if (!document.querySelector('script[src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5381942317128703';
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
        
        script.onload = loadAdSense;
      } else {
        loadAdSense();
      }
    }
  }, []);



  return (
    <AdElement adSlotId='3304468539' adName='My tournaments Home' />
  );
};

export default MyTournamentsAdsHorizontal;