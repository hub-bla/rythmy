import { createContext, useContext, useState } from "react";
import { getSongsFromPlaylist } from "../utils";


export const PlaylistContext = createContext(null)


export const usePlaylistContext  = () => {
    const context = useContext(PlaylistContext)

    if (!context){
        throw new Error("PlaylistContext must be used within PlaylistContext.Provider")
    }
    return context
}



export const usePlaylistContextValues  = () => {
    const [songs, setSongs] = useState({})
    const [matchingTempoArr, setMatchingTempoArr] = useState([])
    const [isPicked, setIsPicked] = useState(false)


    const handleSongsData = (href:string, token:string) =>{
        getSongsFromPlaylist(href, token)
        .then(({idTempoArr, songData}) => {
            setSongs(songData)
            setMatchingTempoArr(idTempoArr)
        })
        setIsPicked(true)
    }


    const findSuitableSong = (currentCadence:number) => {
        let min = matchingTempoArr[0];
        let left = 0
        let right = matchingTempoArr.length
        
        while (left<right){
            let middle = Math.floor((right+left)/2)
            const distance = Math.abs(currentCadence - matchingTempoArr[middle][1])
            if (distance < min[1]){
                
                min = matchingTempoArr[middle]
            }
            if (currentCadence>matchingTempoArr[middle][1]){
                right = middle
            }
            
            else{
                left = middle+1
            }
        }
        
        return songs[min[0]]
    }



    return {handleSongsData, findSuitableSong, isPicked, matchingTempoArr}
}