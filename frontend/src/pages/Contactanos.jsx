import './Contactanos.css'
import { FaTiktok, FaTwitch, FaYoutube } from 'react-icons/fa'

const Contactanos = () => {
  return (
    <div className="contactanos-container">
      <div className="contactanos-card">
        <h1>¡Contactanos y disfrutá de más contenido!</h1>

        <p><strong>Email del Sitio:</strong> umbrellasa092@gmail.com</p>
        <p><strong>Email del desarrolador:</strong> brunocerutti88@gmail.com</p>

        <p><strong>Plataformas de Streaming:</strong></p>
        <ul>
          <li>
            <a href="https://www.tiktok.com/@umbrella.s.a" target="_blank" rel="noopener noreferrer">
              <FaTiktok className="icon" /> TikTok
            </a>
          </li>
          <li>
            <a href="https://www.twitch.tv/el_pelon_de_umbrella" target="_blank" rel="noopener noreferrer">
              <FaTwitch className="icon" /> Twitch
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/@UmbrellaS.A." target="_blank" rel="noopener noreferrer">
              <FaYoutube className="icon" /> YouTube
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Contactanos
