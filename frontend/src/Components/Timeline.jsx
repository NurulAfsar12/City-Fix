import React from 'react';

const Timeline = ({ timeline }) => {
    // Sort timeline by date descending
    const sortedTimeline = [...timeline].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="mt-8">
             <h3 className="text-xl font-bold mb-4 text-base-content">Issue Timeline</h3>
             <ul className="steps steps-vertical w-full">
                {sortedTimeline.map((item, index) => (
                    <li key={index} className={`step ${item.status === 'closed' ? 'step-error' : 'step-primary'}`}>
                         <div className="text-left ml-4 w-full bg-base-100 p-4 rounded-lg shadow-sm mb-4 border-l-4 border-primary">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-lg capitalize">{item.status}</h4>
                                <span className="text-xs text-base-content/60 bg-base-200 px-2 py-1 rounded">
                                    {new Date(item.date).toLocaleString()}
                                </span>
                            </div>
                            <p className="text-base-content/70 mt-1">{item.message}</p>
                            <p className="text-xs text-base-content/40 mt-2">Update by: <span className="font-medium text-base-content/60">{item.updatedBy}</span></p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Timeline;
