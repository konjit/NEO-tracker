
//Converts  Date object to a string in ISO 8601 format (YYYY-MM-DDTHH:MM:SS.sssZ).
export const getTodayDate = () =>{
    const today = new Date();
    return today.toISOString().split('T')[0];
}