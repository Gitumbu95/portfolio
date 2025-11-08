import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { title } from 'process';
import React from 'react';

interface ContactItemData{
    title: string;
    subtitle: string;
    icon: React.ReactNode;
}

const data:ContactItemData[] = [
    {
        title: "Working Hours",
        subtitle: "Daily: 24/7",
        icon: (
           <Clock className='h-6 w-6 text-grey-600 group-hover:text-primary transition-colors'/>
        )
    },
    {
        title: "Visit Us",
        subtitle: "Nairobi, Kenya",
        icon: (
            <MapPin className='h-6 w-6 text-grey-600 group-hover:text-primary transition-colors'/>            
        )
    },
    {
        title: "Call Us",
        subtitle: "+86 137 1560 1956",
        icon: (
            <Phone className='h-6 w-6 text-grey-600 group-hover:text-primary transition-colors'/>
        )
    },
    {
        title: "Email Us",
        subtitle: "info@conceptdash254.co.ke",
        icon: (
            <Mail className='h-6 w-6 text-grey-600 group-hover:text-primary transition-colors'/>
        )
    }


]

const FooterTop = () => {
  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-8 border-b'>
        {data?.map((item, index) =>(
            <div key={index} className='flex items-center gap-3 group hover:bg-gray-50 p-4 transition-colors hoverEffect'>
                {item?.icon}
                <div>
                    <h3 className='font-semibold text-gray-900 group-hover:text-black hoverEffect'>{item?.title}</h3>
                    <p className='text-gray-800 text-sm mt-1 group-hover:text-gray-900 hoverEffect'>{item?.subtitle}</p>
                    
                </div>
            </div>
        ))}
    </div>
  );
};


export default FooterTop;