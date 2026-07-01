import React from 'react';
import logo from '../../assets/watermark.png';

export const Watermark: React.FC = () => {
    return (
        <a
            href="https://www.mindtrixmedia.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-12 pt-8 border-t border-line text-center flex flex-col items-center gap-3 block hover:opacity-80 transition-opacity"
        >
            <img src={logo} alt="Mindtrix Media" className="w-28 object-contain" />
            <p className="text-[10px] md:text-xs text-muted tracking-[0.2em] uppercase">
                Growing Together with <span className="text-primary">♥</span> Mindtrix Media
            </p>
        </a>
    );
};
