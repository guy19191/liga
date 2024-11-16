import React from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import './winning-icon.css';

const WinningIcon = ({ status, className = '' }) => {
    const getStatusIcon = () => {
        switch (status) {
            case 'winning':
                return (
                    <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        <Check size={16} className="stroke-2" />
                        <span className="text-sm font-medium">מנצח</span>
                    </div>
                );
            case 'losing':
                return (
                    <div className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full">
                        <X size={16} className="stroke-2" />
                        <span className="text-sm font-medium">מפסיד</span>
                    </div>
                );
            case 'pending':
                return (
                    <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        <Loader2 size={16} className="animate-spin stroke-2" />
                        <span className="text-sm font-medium">בתהליך</span>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`winning-status ${className}`}>
            {getStatusIcon()}
        </div>
    );
};

export default WinningIcon;