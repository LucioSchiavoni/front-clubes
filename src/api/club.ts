import instance from "@/config/axios";
import {  CreateClub, ClubResponse } from "@/interface/create-club";

export const registerClub = async(data: CreateClub): Promise<ClubResponse> => {
    try {
        const res = await instance.post("/club", data)
        return res.data;
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const updateUserClub = async(userId: number, clubId: number) => {
    try {
        const res = await instance.patch(`/users/${userId}/club`, { clubId })
        return res.data;
    } catch (error) {
        console.log(error)
        throw error
    }
}


