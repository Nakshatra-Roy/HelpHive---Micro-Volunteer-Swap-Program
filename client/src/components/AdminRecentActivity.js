import React from 'react';
import { format } from 'date-fns';

const AdminRecentActivity = ({ activity }) => {
    if (!activity?.length) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <p className="text-gray-500">No recent activity to display.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <ul className="space-y-4">
                {activity.map((item, index) => (
                    <li key={item.taskId || `activity-${index}`} className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <span className="h-8 w-8 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                                {/* Icon can be dynamic based on activity type */}
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                        </div>
                        <div className="flex-grow">
                            <p className="text-sm text-gray-700">{item.description}</p>
                            <p className="text-xs text-gray-400 mt-1">
                                {format(new Date(item.date), 'MMM d, yyyy, h:mm a')}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminRecentActivity;