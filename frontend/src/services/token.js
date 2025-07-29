let token = null;

const applyToken = (newToken) => {
    token = `Bearer ${newToken}`
}

const getToken = () => token

const clearToken = () => {
    token = null
}

export {
    applyToken,
    getToken,
    clearToken 
}
