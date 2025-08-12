import React from 'react';
import { TrendingUpIcon, TrendingDownIcon, StarIcon } from 'lucide-react';
const StatsSummary = ({
  stats
}) => {
  return <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
      <h2 className="text-xl font-bold text-[#343a40] mb-4">Summary</h2>
      <div className="space-y-6">
        {/* Credits Earned */}
        <div className="flex items-center">
          <div className="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center mr-4">
            <TrendingUpIcon size={24} className="text-[#28a745]" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Credits Earned</p>
            <p className="text-2xl font-bold text-[#28a745]">{stats.creditsEarned}</p>
          </div>
        </div>
        {/* Credits Spent */}
        <div className="flex items-center">
          <div className="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center mr-4">
            <TrendingDownIcon size={24} className="text-[#28a745]" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Credits Spent</p>
            <p className="text-2xl font-bold text-[#28a745]">{stats.creditsSpent}</p>
          </div>
        </div>
        {/* Rating */}
        <div className="flex items-center">
          <div className="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center mr-4">
            <StarIcon size={24} className="text-[#28a745]" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Average Rating</p>
            <div className="flex items-center">
              <p className="text-2xl font-bold text-[#28a745] mr-2">{stats.rating}</p>
              <div className="flex">
                {[...Array(5)].map((_, i) => <StarIcon key={i} size={16} className={i < Math.floor(stats.rating) ? "text-[#28a745] fill-[#28a745]" : "text-gray-300"} />)}
              </div>
            </div>
          </div>
        </div>
        {/* Credits Balance */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-gray-600 text-sm">Credits Balance</p>
          <p className="text-3xl font-bold text-[#343a40]">{stats.creditsEarned - stats.creditsSpent}</p>
        </div>
      </div>
    </div>;
};
export default StatsSummary;