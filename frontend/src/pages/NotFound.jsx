const NotFound = () => {
  return (
    <div style={{
      color: 'white',
      backgroundColor: '#111',
      textAlign: 'center',
      padding: '4rem',
      minHeight: '80vh'
    }}>
      <h1 style={{ color: '#ff0000' }}>404 - Página no encontrada</h1>
      <p>La página que estás buscando no existe.</p>
      <img src="/notFoundLeon.png" alt="" />
    </div>
  )
}

export default NotFound
