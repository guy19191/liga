import {axiosInstance} from "./request";

async function userLigaApi(){
    const res = await axiosInstance.get('ligaUser/v1/getUser');
    return res.data;
}

export {userLigaApi}