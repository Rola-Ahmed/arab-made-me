
import { deleteRequest,postRequest,patchRequest} from "./authServices";


export const deleteTeam = async (id,header) => {
    return await deleteRequest(`/teams/${id}`, header, {});
  };

  export const addTeam = async (header, data) => {
    return await postRequest(`/teams/add`, header, data);
  };

  export const addTeamMedia = async (id,header, data) => {
    return await patchRequest(`/teams/uploadMedia/${id}`, header, data);
  };