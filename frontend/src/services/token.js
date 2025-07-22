let token = null;

const applyToken = (newToken) => {
    token = `Bearer ${newToken}`
}

const getToken = () => token

export {
    applyToken,
    getToken
}