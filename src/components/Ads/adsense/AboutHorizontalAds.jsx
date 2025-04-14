import React, { useEffect } from 'react';
import AdElement from './AdElement';

const AboutHorizontalAds = () => {
    useEffect(() => {
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
        <AdElement adSlotId='9842020362' adName='About Horizontal Ads' />
    );
};

export default AboutHorizontalAds;