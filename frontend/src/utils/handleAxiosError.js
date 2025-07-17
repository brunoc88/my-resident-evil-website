
export const handleAxiosError = (error) => {
  const data = error.response?.data

  if (data?.error) throw new Error(
    Array.isArray(data.error)
      ? data.error.join('\n')
      : data.error
  )

  if (data?.message) throw new Error(data.message)

  throw new Error('Error desconocido')
}

export default handleAxiosError