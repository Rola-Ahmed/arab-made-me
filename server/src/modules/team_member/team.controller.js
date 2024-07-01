
import { TeamMember } from "../../database/models/team_member.model.js";

import { crudOps } from "../../utils/crud_ops.js";
import { asyncHandler } from "../../utils/error_handling.js";


export const addTeamMember = asyncHandler(
    async(req,res,nxt)=>{
        const teamMember= await TeamMember.create({
            ...req.body,factoryId:req.factory.id
        })
        if(!teamMember) return res.status(400).json({message:"error"})
        return res.status(201).json({message:"done",teamMember})
    }
)

export const getTeamMembers = crudOps.getAll(TeamMember)

export const getTeamMember = crudOps.getOne(TeamMember)

export const getTeamMembersOfFactory=asyncHandler(
    async(req,res,nxt)=>{
        const{id}= req.params 
        const teamMembers= await TeamMember.findAll({where:{
            factoryId:id
        }});

        return res.status(200).json({message:"done",teamMembers})
    }
)

export const updateTeamMember = crudOps.updateModel(TeamMember)

export const deleteTeamMember = crudOps.deleteModel(TeamMember,{'image':'file'})

export const uploadMedia= crudOps.uploadMedia('teamMember',{'image':'file'})