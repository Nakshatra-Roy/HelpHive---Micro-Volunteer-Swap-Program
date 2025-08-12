import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
const VolunteerHistory = ({
  history
}) => {
  // Function to format date from ISO string to readable format
  const formatDate = dateString => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  return <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-[#343a40] mb-4">
        Volunteer History
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-600">
                Task Description
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">
                Date
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-600">
                Credits
              </th>
            </tr>
          </thead>
          <tbody>
            {history.map(task => <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-[#343a40]">{task.description}</td>
                <td className="py-3 px-4 text-gray-600">
                  {formatDate(task.date)}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end">
                    {task.type === 'earned' ? <ArrowUpIcon size={16} className="text-green-500 mr-1" /> : <ArrowDownIcon size={16} className="text-red-500 mr-1" />}
                    <span className={task.type === 'earned' ? 'text-green-500 font-medium' : 'text-red-500 font-medium'}>
                      {task.type === 'earned' ? '+' : '-'}
                      {task.credits}
                    </span>
                  </div>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
};
export default VolunteerHistory;