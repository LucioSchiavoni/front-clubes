import instance from "@/config/axios";
import {  CreateClub, ClubResponse } from "@/interface/create-club";
import { UpdateClub } from "@/interface/update-club";

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
        console.log('Enviando actualización de club:', { userId, clubId })
        const res = await instance.patch(`/user/${userId}/club`, { clubId })
        console.log('Respuesta de actualización:', res.data)
        if (res.data.status === 200) {
            return res.data.data
        } else {
            throw new Error(res.data.message || 'Error al actualizar el club del usuario')
        }
    } catch (error) {
        console.error('Error en updateUserClub:', error)
        throw error
    }
}

export const createGramsClub = async (clubId: string, data: { minGrams?: number; maxGrams?: number }) => {
    try {
        const res = await instance.patch(
            `/club/${clubId}/grams`,
            data,
            { headers: { 'Content-Type': 'application/json' } }
        )
        return res.data;
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const getClubById = async(clubId: string) => {
    try {
        const res = await instance.get(`/club/${clubId}`)
        return res.data;
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const updateClub = async(clubId: string, data: FormData | UpdateClub) => {
    try {
        const headers = data instanceof FormData 
            ? { 'Content-Type': 'multipart/form-data' }
            : { 'Content-Type': 'application/json' }

        console.log('Enviando actualización:', {
            isFormData: data instanceof FormData,
            headers,
            data: data instanceof FormData ? 'FormData' : data
        })

        const res = await instance.put(`/club/${clubId}`, data, { headers })
        return res.data;
    } catch (error) {
        console.log('Error en updateClub:', error)
        throw error
    }
}