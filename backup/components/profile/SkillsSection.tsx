import React, { useState } from 'react';
import { PlusIcon, XIcon } from 'lucide-react';
const SkillsSection = ({
  skillsToOffer,
  skillsToReceive,
  isEditing,
  onSkillsChange
}) => {
  const [newOfferSkill, setNewOfferSkill] = useState('');
  const [newReceiveSkill, setNewReceiveSkill] = useState('');
  const handleAddSkill = (type, skill, setSkill) => {
    if (skill.trim() === '') return;
    const skillsArray = type === 'skillsToOffer' ? skillsToOffer : skillsToReceive;
    if (!skillsArray.includes(skill.trim())) {
      const updatedSkills = [...skillsArray, skill.trim()];
      onSkillsChange(type, updatedSkills);
      setSkill('');
    }
  };
  const handleRemoveSkill = (type, skillToRemove) => {
    const skillsArray = type === 'skillsToOffer' ? skillsToOffer : skillsToReceive;
    const updatedSkills = skillsArray.filter(skill => skill !== skillToRemove);
    onSkillsChange(type, updatedSkills);
  };
  const SkillPill = ({
    skill,
    type,
    onRemove
  }) => <div className="inline-flex items-center bg-[#E8F5E9] text-[#28a745] px-3 py-1 rounded-full mr-2 mb-2">
      <span>{skill}</span>
      {isEditing && <button onClick={() => onRemove(type, skill)} className="ml-2 text-[#28a745] hover:text-red-500 focus:outline-none">
          <XIcon size={14} />
        </button>}
    </div>;
  return <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-[#343a40] mb-6">Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills I Can Offer */}
        <div>
          <h3 className="text-lg font-semibold text-[#343a40] mb-3">
            Skills I Can Offer
          </h3>
          <div className="mb-4">
            {skillsToOffer.map((skill, index) => <SkillPill key={index} skill={skill} type="skillsToOffer" onRemove={handleRemoveSkill} />)}
          </div>
          {isEditing && <div className="flex">
              <input type="text" value={newOfferSkill} onChange={e => setNewOfferSkill(e.target.value)} placeholder="Add a skill..." className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#28a745]" onKeyPress={e => {
            if (e.key === 'Enter') {
              handleAddSkill('skillsToOffer', newOfferSkill, setNewOfferSkill);
            }
          }} />
              <button onClick={() => handleAddSkill('skillsToOffer', newOfferSkill, setNewOfferSkill)} className="bg-[#28a745] text-white p-2 rounded-r-md hover:bg-[#218838] focus:outline-none">
                <PlusIcon size={20} />
              </button>
            </div>}
        </div>
        {/* Skills I Need Help With */}
        <div>
          <h3 className="text-lg font-semibold text-[#343a40] mb-3">
            Skills I Need Help With
          </h3>
          <div className="mb-4">
            {skillsToReceive.map((skill, index) => <SkillPill key={index} skill={skill} type="skillsToReceive" onRemove={handleRemoveSkill} />)}
          </div>
          {isEditing && <div className="flex">
              <input type="text" value={newReceiveSkill} onChange={e => setNewReceiveSkill(e.target.value)} placeholder="Add a skill..." className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#28a745]" onKeyPress={e => {
            if (e.key === 'Enter') {
              handleAddSkill('skillsToReceive', newReceiveSkill, setNewReceiveSkill);
            }
          }} />
              <button onClick={() => handleAddSkill('skillsToReceive', newReceiveSkill, setNewReceiveSkill)} className="bg-[#28a745] text-white p-2 rounded-r-md hover:bg-[#218838] focus:outline-none">
                <PlusIcon size={20} />
              </button>
            </div>}
        </div>
      </div>
    </div>;
};
export default SkillsSection;