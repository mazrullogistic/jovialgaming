import { getSubscribeInfo } from '@/utils/storage';
import React from 'react'

const AdElement = ({ adSlotId = '', adName = "" }) => {

    const isSubscribed = getSubscribeInfo();
    if (isSubscribed) return null;
    const isProduction = process.env.NODE_ENV === 'production';

    return (
        <div className={`${isProduction ? "" : "border-red border bg-[#1e1e1e]"}`}>
            {!isProduction && <p className='text-white'>{`${adName} Ads will here be...`}</p>}
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={isProduction ? "ca-pub-5381942317128703" : "ca-pub-0000000000000000"}
                data-ad-slot={isProduction ? adSlotId : "1234567890"}
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
    )
}

export default AdElement
