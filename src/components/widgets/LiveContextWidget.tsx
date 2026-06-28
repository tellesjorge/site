import { useEffect, useState } from 'react'
import { Calendar, Clock, CloudSun, Cpu, MapPin, RefreshCw, Server } from 'lucide-react'

export default function LiveContextWidget({ className = 'my-6' }: { className?: string }) {
  const [time, setTime] = useState(new Date())
  const [temperature, setTemperature] = useState('18°C')
  const [weatherStatus, setWeatherStatus] = useState('Clima local')
  const [updatedAt, setUpdatedAt] = useState('')

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setTime(now)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Weather fetch (Open-Meteo, keyless, silent failure)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=-25.4284&longitude=-49.2733&current_weather=true'
        )
        const data = await response.json()
        if (data?.current_weather) {
          setTemperature(`${Math.round(data.current_weather.temperature)}°C`)
          const code = data.current_weather.weathercode
          let status = 'Parcialmente Nublado'
          if (code === 0) status = 'Céu Limpo'
          else if (code >= 1 && code <= 3) status = 'Ensolarado/Nublado'
          else if (code >= 45 && code <= 48) status = 'Nevoeiro'
          else if (code >= 51 && code <= 67) status = 'Chuva Leve'
          else if (code >= 71 && code <= 86) status = 'Chuva/Neve'
          else if (code >= 95) status = 'Tempestade'
          setWeatherStatus(status)
        }
      } catch (error) {
        // Fallback default is 18°C / Clima local
      }
    }
    fetchWeather()
    
    // Set formatted updated time
    const now = new Date()
    setUpdatedAt(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
  }, [])

  const formatDate = (date: Date) => {
    const capitalized = date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    return capitalized.charAt(0).toUpperCase() + capitalized.slice(1)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  return (
    <div className={`mx-auto max-w-5xl ${className}`}>
      <div className="rounded-[32px] border border-white/30 bg-white/20 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_16px_48px_rgba(0,0,0,0.02)] grid gap-4 grid-cols-2 md:grid-cols-4">
        {/* Card 1: Local & Clima */}
        <div className="flex items-center gap-3 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 p-3.5 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300">
          <div className="rounded-xl bg-[#0071e3]/10 p-2 text-[#0071e3] flex-shrink-0">
            <MapPin className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#8e8e93]">Localização</p>
            <p className="text-xs font-bold text-[#1d1d1f] truncate">Curitiba, PR</p>
            <div className="flex items-center gap-1 mt-0.5 text-[10px] text-[#6e6e73] min-w-0">
              <CloudSun className="h-3 w-3 text-amber-500 flex-shrink-0" />
              <span className="truncate">{temperature} • {weatherStatus}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Data & Hora */}
        <div className="flex items-center gap-3 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 p-3.5 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300">
          <div className="rounded-xl bg-[#34c759]/10 p-2 text-[#34c759] flex-shrink-0">
            <Clock className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#34c759]">{formatTime(time)}</p>
            <p className="text-xs font-bold text-[#1d1d1f] truncate">Horário de Brasília</p>
            <p className="text-[10px] text-[#6e6e73] truncate mt-0.5">{formatDate(time)}</p>
          </div>
        </div>

        {/* Card 3: Dashboard Status */}
        <div className="flex items-center gap-3 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 p-3.5 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300">
          <div className="rounded-xl bg-purple-500/10 p-2 text-purple-600 flex-shrink-0">
            <Server className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#8e8e93]">Painel Executivo</p>
            <p className="text-xs font-bold text-[#1d1d1f] truncate">Status Operacional</p>
            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-emerald-600 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Dashboard Ativo</span>
            </div>
          </div>
        </div>

        {/* Card 4: IA Status */}
        <div className="flex items-center gap-3 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 p-3.5 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300">
          <div className="rounded-xl bg-cyan-500/10 p-2 text-cyan-600 flex-shrink-0">
            <Cpu className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#8e8e93]">Automação IA</p>
            <p className="text-xs font-bold text-[#1d1d1f] truncate">Modo de Simulação</p>
            <div className="flex items-center gap-1 mt-0.5 text-[10px] text-[#8e8e93]">
              <RefreshCw className="h-2.5 w-2.5 animate-spin" />
              <span>Atualizado às {updatedAt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
