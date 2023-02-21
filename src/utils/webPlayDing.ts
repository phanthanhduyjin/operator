import ding from '../assets/ding.mp3'
import { BackgroundTimer } from './BackgroundTimer'

export const webPlayDing = () => {
  const a = new Audio()
  a.volume = 0.05
  a.src = ding
  document.body.appendChild(a)
  a.play()
  BackgroundTimer.setTimeout(() => {
    document.body.removeChild(a)
  }, 3000)
}