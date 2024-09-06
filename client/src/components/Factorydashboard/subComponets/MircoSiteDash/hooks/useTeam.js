import { useState } from 'react';
import { getFactoryTeam, addTeamMedia, deleteTeam as deleteMember } from 'Services/factory';

export const useTeam = (factoryId, isLogin) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);


  const addTeamMember = async (values) => {
    const result = await addTeam({ authorization: isLogin }, values);
    if (result?.success) {
    }
  };

  const deleteTeamMember = async (id, index) => {
    const result = await deleteMember(id, { authorization: isLogin });
    if (result?.success) {
      setTeamMembers((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const submitTeamDocs = async (teamMemberId) => {
    const data = new FormData();
    selectedDocs.forEach((item) => data.append('image', item.pdfFile));
    const result = await addTeamMedia(teamMemberId, { Authorization: isLogin }, data);
    if (result?.success) {
      setSelectedDocs([]);
    }
  };

  return {
    teamMembers,
    addTeamMember,
    deleteTeamMember,
    submitTeamDocs,
  };
};
