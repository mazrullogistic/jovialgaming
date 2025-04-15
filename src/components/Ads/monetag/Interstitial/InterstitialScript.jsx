// components/AdScript.js
import { getSubscribeInfo } from '@/utils/storage';
import { useEffect } from 'react';

const InterstitialScript = () => {
    
  useEffect(() => {

    const isSubscribed = getSubscribeInfo();
    if (isSubscribed) return null;

    // Create script element
    const script = document.createElement('script');
    script.id = 'propellerads-script';
    script.innerHTML = `(function(d,z,s){s.src='https://'+d+'/401/'+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})('groleegni.net',9201656,document.createElement('script'))`;
    
    // Append script to body
    try {
      (document.body || document.documentElement).appendChild(script);
    } catch (e) {
      console.error('Error appending PropellerAds script:', e);
    }

    // Cleanup function to remove script when component unmounts
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null; // This component doesn't render anything visually
};

export default InterstitialScript;
