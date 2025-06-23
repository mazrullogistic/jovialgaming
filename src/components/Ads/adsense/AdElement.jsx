// import { getSubscribeInfo } from '@/utils/storage';
// import React from 'react'

// const AdElement = ({ adSlotId = '', adName = "" }) => {

//     const isSubscribed = getSubscribeInfo();
//     if (isSubscribed) return null;
//     const isProduction = process.env.NODE_ENV === 'production';

//     return (
//         <div className={`${isProduction ? "" : "border-red border bg-[#1e1e1e]"}`}>
//             {!isProduction && <p className='text-white'>{`${adName} Ads will here be...`}</p>}
//             <ins
//                 className="adsbygoogle"
//                 style={{ display: 'block' }}
//                 data-ad-client={isProduction ? "ca-pub-5381942317128703" : "ca-pub-0000000000000000"}
//                 data-ad-slot={isProduction ? adSlotId : "1234567890"}
//                 data-ad-format="auto"
//                 data-full-width-responsive="true"
//             />
//         </div>
//     )
// }

// export default AdElement



import React, { useEffect, useRef, useState } from 'react';
import { getSubscribeInfo } from '@/utils/storage';

const AdElement = ({ adSlotId = '', adName = '' }) => {
    const isSubscribed = getSubscribeInfo();
    const isProduction = process.env.NODE_ENV === 'production';

    const adRef = useRef(null);
    const [shouldShowAd, setShouldShowAd] = useState(false);

    useEffect(() => {
        if (isSubscribed) return;

        // Load AdSense script (only once)
        if (isProduction && typeof window !== 'undefined') {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                setShouldShowAd(true);
            } catch (e) {
                console.warn('Adsbygoogle push error', e);
            }
        } else {
            setShouldShowAd(true); // show test box in dev
        }
    }, [isSubscribed, isProduction]);

    if (isSubscribed || !shouldShowAd) return null;

    return (
        <div
            ref={adRef}
            className={`${isProduction ? '' : 'border border-red-500 bg-[#1e1e1e]'}`}
        >
            {!isProduction && (
                <p className="text-white px-2 py-1">{`${adName} Ads will be shown here...`}</p>
            )}
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={isProduction ? 'ca-pub-5381942317128703' : 'ca-pub-0000000000000000'}
                data-ad-slot={isProduction ? adSlotId : '1234567890'}
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
    );
};

export default AdElement;

