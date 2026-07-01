import React from 'react';
import logo from '../../assets/watermark.png';

interface WatermarkProps {
    variant?: 'default' | 'sidebar';
}

export const Watermark: React.FC<WatermarkProps> = ({ variant = 'default' }) => {
    const isSidebar = variant === 'sidebar';

    return (
        <a
            href="https://www.mindtrixmedia.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={`${isSidebar
                ? 'mt-4 pt-3 border-t border-line'
                : 'mt-12 pt-8 border-t border-line'
                } text-center flex flex-col items-center gap-2 block hover:opacity-80 transition-opacity`}
        >
            <img
                src={logo}
                alt="Mindtrix Media"
                className={`object-contain ${isSidebar ? 'w-20' : 'w-28'}`}
            />
            <p className="text-[10px] text-muted tracking-[0.2em] uppercase leading-tight">
                Growing Together with <span className="text-primary">♥</span> Mindtrix Media
            </p>
        </a>
    );
};
