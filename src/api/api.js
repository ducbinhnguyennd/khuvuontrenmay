const encryptedApis = {
  backend: process.env.REACT_APP_API_BACKEND
}

export const getApiUrl = key => {
  if (encryptedApis[key]) {
    return encryptedApis[key]
  }
  console.error(`API với key "${key}" không tồn tại`)
  return null
}
