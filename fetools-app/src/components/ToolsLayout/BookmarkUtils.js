export function createBookmark(
    pageName, 
    object, 
    compareProperty, 
    compareSubProperties,
    bookmarkLength, 
    setBookmarkLength
){

    checkForLocalStorage(pageName)
    saveInLocal()
    setBookmarkLength(bookmarkLength+1)

    function saveInLocal(){
        const favoriteItemsJSON = localStorage.getItem(`${pageName}-favorites`)
        const favoriteItems = JSON.parse(favoriteItemsJSON)

        if(favoriteItems.find((item)=>object[compareProperty]===item[compareProperty])){
            return
        } else if(compareSubProperties){
            for(let i=0; i<compareSubProperties.length;i++){
                if(favoriteItems.find((item)=>(
                    object[compareProperty][compareSubProperties[i]]
                    ===
                    item[compareProperty][compareSubProperties[i]]
                ))){
                return
                } else{
                    favoriteItems.push(object)
                }
            }
            localStorage.setItem(`${pageName}-favorites`, JSON.stringify(favoriteItems))
            return
        }
      
        favoriteItems.push(object)
        localStorage.setItem(`${pageName}-favorites`, JSON.stringify(favoriteItems))
    }

}

export function checkForLocalStorage(pageName){
    if(!localStorage.getItem(`${pageName}-favorites`)){
        localStorage.setItem(`${pageName}-favorites`, JSON.stringify([]))
    }

    return JSON.parse(localStorage.getItem(`${pageName}-bookmarks`))
}

export function saveNewArray(pageName, newArr){
    localStorage.setItem(`${pageName}-favorites`, JSON.stringify(newArr))
}

export function compareItems(comparisonObj, pageName, bookmarkProp, checkObjectsKeys=false) {
    // First try simple comparison for strings and numbers
    
    const isBookmarked = checkForLocalStorage(pageName).find(bookmark=>{
        if(!bookmark) return false
        return bookmark[bookmarkProp]===comparisonObj[bookmarkProp]?true:false
    });
    
    if(typeof(isBookmarked)!=='object') {return false}

    if(isBookmarked[bookmarkProp]===comparisonObj[bookmarkProp] ) return true;
    // Check if all properties are the same

    if(checkObjectsKeys){
        for (let key in comparisonObj) {
            const checks = checkForLocalStorage(pageName).map(bookmark=>{
                if (comparisonObj[key] !== bookmark[key]) return false;
                return true
            })
            return checks.reduce((a,b)=>a&&b)
        }   
    }    

    return false
}
