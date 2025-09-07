"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler,
  ChartData, ScriptableContext,ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Variants } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Gauge, 
  Power, 
  ShieldCheck, 
  Activity,
  TrendingUp,
  Battery,
  Cpu,
  Wifi,
  Sun,
  Moon,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
);

// ThingSpeak API Configuration
const THINGSPEAK_URL = 'https://api.thingspeak.com/channels/3064301/feeds.json?results=30';
const UPDATE_INTERVAL = 15000; // 15 seconds

// Types for ThingSpeak data
interface ThingSpeakFeed {
  created_at: string;
  entry_id: number;
  field1: string; // Voltage
  field2: string; // Current (mA)
  field3: string; // Power (mW)
}

interface ThingSpeakResponse {
  channel: unknown;
  feeds: ThingSpeakFeed[];
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8,
      staggerChildren: 0.1
    }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      type: "spring",
      bounce: 0.3
    }
  },
  hover: { 
    scale: 1.02,
    y: -5,
    transition: { duration: 0.2 }
  }
};

const iconVariants: Variants = {
  idle: { rotate: 0, scale: 1 },
  hover: { 
    rotate: 10, 
    scale: 1.1,
    transition: { duration: 0.3 }
  },
  pulse: {
    scale: [1, 1.2, 1],
    transition: { 
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const pulseVariants : Variants= {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// --- Helper function to convert CSS variable to a usable RGBA color string ---
const getCssVarRgba = (variableName: string): string => {
  if (typeof window === 'undefined') return 'rgba(59, 130, 246, 1)';
  
  try {
    const tempDiv = document.createElement('div');
    tempDiv.style.color = `hsl(var(${variableName}))`;
    document.body.appendChild(tempDiv);
    const computedColor = window.getComputedStyle(tempDiv).color;
    document.body.removeChild(tempDiv);
    
    if (computedColor.startsWith('rgb')) {
      return computedColor;
    }
    
    if (variableName === '--primary') {
      return 'rgb(59, 130, 246)';
    } else {
      return 'rgb(100, 116, 139)';
    }
  } catch (error) {
    console.log(error);
    if (variableName === '--primary') {
      return 'rgb(59, 130, 246)';
    } else {
      return 'rgb(100, 116, 139)';
    }
  }
};

const addAlpha = (rgb: string, alpha: number): string => {
  if (rgb.startsWith('rgba')) {
    return rgb.replace(/,\s*[\d.]+\)$/, `, ${alpha})`);
  } else if (rgb.startsWith('rgb')) {
    return rgb.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
  } else {
    return `rgba(59, 130, 246, ${alpha})`;
  }
};

// --- Enhanced Data Card Component ---
interface DataCardProps {
  title: string; 
  value: string; 
  unit: string; 
  icon: React.ElementType; 
  gradient: string;
  description?: string;
  trend?: number;
  delay?: number;
  isLoading?: boolean;
}

const DataCard: React.FC<DataCardProps> = ({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  gradient,
  description, 
  trend,
  delay = 0,
  isLoading = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ animationDelay: `${delay}s` }}
      className="h-full"
    >
      <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`}></div>
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`}
          animate={isHovered ? { opacity: 0.2 } : { opacity: 0.05 }}
          transition={{ duration: 0.3 }}
        ></motion.div>
        
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            {title}
            {trend !== undefined && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <TrendingUp className={`h-3 w-3 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`} />
              </motion.div>
            )}
          </CardTitle>
          <motion.div 
            className={`rounded-xl p-3 bg-gradient-to-br ${gradient} shadow-lg`}
            variants={iconVariants}
            animate={isHovered ? "hover" : (isLoading ? "pulse" : "idle")}
          >
            <Icon className="h-5 w-5 text-white drop-shadow-sm" />
          </motion.div>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <motion.div 
            className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {isLoading ? (
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                --.-
              </motion.span>
            ) : (
              value
            )}
            <motion.span 
              className="text-2xl font-normal text-muted-foreground ml-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {unit}
            </motion.span>
          </motion.div>
          {description && (
            <motion.p 
              className="text-xs text-muted-foreground pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {description}
            </motion.p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function DashboardPage() {
  // State for sensor data
  const [voltage, setVoltage] = useState("--.-");
  const [current, setCurrent] = useState("--.-");
  const [power, setPower] = useState("--.-");
  const [systemStatus, setSystemStatus] = useState("CONNECTING");
  const [lastUpdated, setLastUpdated] = useState("--:--:--");
  
  // State for connection status
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const chartRef = useRef<ChartJS<'line', number[], string>>(null);

  const [chartColors, setChartColors] = useState({
    primary: 'rgba(59, 130, 246, 0.4)',
    primaryTransparent: 'rgba(59, 130, 246, 0.05)',
    muted: 'rgba(100, 116, 139, 0.4)',
    mutedTransparent: 'rgba(100, 116, 139, 0.05)',
  });
  
  useEffect(() => {
    const primaryRgb = getCssVarRgba('--primary');
    const mutedRgb = getCssVarRgba('--muted-foreground');
    
    setChartColors({
      primary: addAlpha(primaryRgb, 0.6),
      primaryTransparent: addAlpha(primaryRgb, 0.1),
      muted: addAlpha(mutedRgb, 0.6),
      mutedTransparent: addAlpha(mutedRgb, 0.1),
    });
  }, []);

  const [chartData, setChartData] = useState<ChartData<'line'>>({ labels: [], datasets: [] });

  // Initialize chart
  useEffect(() => {
    const createGradient = (ctx: CanvasRenderingContext2D, color1: string, color2: string) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      try {
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        return gradient;
      } catch (error) {
        console.log(error);
        console.warn('Failed to create gradient with colors:', color1, color2);
        return color1;
      }
    };
    
    setChartData({
        labels: [],
        datasets: [
          {
            label: 'Power (mW)', 
            data: [], 
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 3, 
            tension: 0.4, 
            fill: true, 
            pointBackgroundColor: 'rgb(34, 197, 94)', 
            pointBorderColor: 'rgb(255, 255, 255)',
            pointBorderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 8,
            yAxisID: 'yPower',
            backgroundColor: (context: ScriptableContext<'line'>) => {
              const ctx = context.chart.ctx;
              if (!ctx) return 'rgba(34, 197, 94, 0.1)';
              return createGradient(ctx, 'rgba(34, 197, 94, 0.6)', 'rgba(34, 197, 94, 0.05)');
            },
          },
          {
            label: 'Current (mA)', 
            data: [], 
            borderColor: 'rgb(168, 85, 247)',
            borderWidth: 3, 
            tension: 0.4, 
            fill: true, 
            pointBackgroundColor: 'rgb(168, 85, 247)', 
            pointBorderColor: 'rgb(255, 255, 255)',
            pointBorderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 8,
            yAxisID: 'yCurrent',
            backgroundColor: (context: ScriptableContext<'line'>) => {
              const ctx = context.chart.ctx;
              if (!ctx) return 'rgba(168, 85, 247, 0.1)';
              return createGradient(ctx, 'rgba(168, 85, 247, 0.6)', 'rgba(168, 85, 247, 0.05)');
            },
          },
        ],
    });
  }, [chartColors]);

    // Replace your entire chartOptions object with this corrected version
    const chartOptions: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            font: { weight: 600 },
            color: 'hsl(var(--foreground))',
            padding: 20
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          cornerRadius: 12,
          displayColors: true,
          usePointStyle: true,
        }
      },
      scales: {
          yPower: {
            type: 'linear' as const,
            position: 'left' as const,
            ticks: {
              color: 'hsl(var(--muted-foreground))',
              font: { weight: 500 }
            },
            // --- CORRECT FIX FOR v4 ---
            border: {
              display: false
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
            },
            title: {
              display: true,
              text: 'Power (mW)',
              color: 'rgb(34, 197, 94)',
              font: { weight: 600, size: 12 }
            }
          },
          yCurrent: {
            type: 'linear' as const,
            position: 'right' as const,
            ticks: {
              color: 'hsl(var(--muted-foreground))',
              font: { weight: 500 }
            },
            // --- CORRECT FIX FOR v4 ---
            border: {
              display: false
            },
            grid: {
              drawOnChartArea: false,
            },
            title: {
              display: true,
              text: 'Current (mA)',
              color: 'rgb(168, 85, 247)',
              font: { weight: 600, size: 12 }
            }
          },
          x: {
            ticks: {
              color: 'hsl(var(--muted-foreground))',
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 8,
              font: { weight: 500 }
            },
            // --- CORRECT FIX FOR v4 ---
            border: {
              display: false
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
            }
          },
      },
      interaction: { mode: 'index' as const, intersect: false },
      elements: {
        point: {
          radius: 0,
          hoverRadius: 8,
          borderWidth: 2
        },
        line: {
          borderJoinStyle: 'round' as const,
          borderCapStyle: 'round' as const,
        }
      }
    };

  // Fetch data from ThingSpeak API
  const fetchThingSpeakData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(THINGSPEAK_URL);
      
      if (!response.ok) {
        throw new Error(`Network Error: ${response.status}`);
      }
      
      const data: ThingSpeakResponse = await response.json();
      
      if (!data.feeds || data.feeds.length === 0) {
        setConnectionStatus('Waiting for data...');
        setIsConnected(false);
        return;
      }
      
      const feeds = data.feeds;
      const latestFeed = feeds[feeds.length - 1];
      
      // Parse the sensor data
      const voltageValue = parseFloat(latestFeed.field1 || '0');
      const currentValue = parseFloat(latestFeed.field2 || '0');
      const powerValue = parseFloat(latestFeed.field3 || '0');
      
      // Update state with new values
      setVoltage(voltageValue.toFixed(2));
      setCurrent(currentValue.toFixed(0));
      setPower(powerValue.toFixed(0));
      
      // Determine system status based on current direction
      if (currentValue < 0) {
        setSystemStatus('GENERATING');
      } else {
        setSystemStatus('CONSUMING');
      }
      
      // Update connection status
      setLastUpdated(new Date(latestFeed.created_at).toLocaleTimeString());
      setConnectionStatus('Connected');
      setIsConnected(true);
      setIsLoading(false);
      
      // Update chart data
      setChartData(prevData => {
        const labels = feeds.map(feed => new Date(feed.created_at).toLocaleTimeString());
        const powerData = feeds.map(feed => parseFloat(feed.field3 || '0'));
        const currentData = feeds.map(feed => parseFloat(feed.field2 || '0'));
        
        return {
          labels: labels,
          datasets: [
            { ...prevData.datasets[0], data: powerData },
            { ...prevData.datasets[1], data: currentData }
          ]
        };
      });
      
    } catch (error) {
      console.error('Error fetching ThingSpeak data:', error);
      setConnectionStatus(error instanceof Error ? error.message : 'Connection failed');
      setIsConnected(false);
      setIsLoading(false);
    }
  };

  // Set up data fetching
  useEffect(() => {
    // Initial fetch
    fetchThingSpeakData();
    
    // Set up interval for periodic updates
    const intervalId = setInterval(fetchThingSpeakData, UPDATE_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-foreground relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-10"
          animate={{ 
            scale: [1, 1.5, 1],
            rotate: [0, 360, 0]
          }}
          transition={{ 
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <motion.header 
        className="sticky top-0 z-20 border-b border-white/10 bg-black/20 backdrop-blur-xl"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
      >
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <motion.div
              className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg"
              variants={iconVariants}
              animate="pulse"
            >
              <Activity className="h-8 w-8 text-white drop-shadow-sm" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                RenuGrid Monitor
              </h1>
              <p className="text-sm text-muted-foreground">Live Data from INA219 Sensor</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.button
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-blue-400" />}
            </motion.button>
            
            <div className="flex items-center space-x-3">
              <motion.div 
                className={`relative flex h-4 w-4 ${isConnected ? '' : 'opacity-50'}`}
                variants={pulseVariants}
                animate={isConnected ? "pulse" : ""}
              >
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-4 w-4 ${isConnected ? 'bg-green-500' : 'bg-red-500'} shadow-lg`}></span>
              </motion.div>
              <div className="flex items-center gap-2">
                {isConnected ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <AlertCircle className="h-4 w-4 text-red-400" />}
                <span className={`text-sm font-medium ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                  {connectionStatus}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.header>

      <main className="flex-1 container mx-auto p-6 md:p-10 relative z-10">
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h2 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
            Live Dashboard
          </h2>
          <p className="text-xl text-muted-foreground flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Real-time microgrid monitoring via ThingSpeak
          </p>
        </motion.div>

        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <DataCard 
            title="Bus Voltage" 
            value={voltage} 
            unit="V" 
            icon={Zap} 
            gradient="from-amber-400 to-orange-500"
            delay={0}
            isLoading={isLoading}
          />
          <DataCard 
            title="Current Flow" 
            value={current} 
            unit="mA" 
            icon={Gauge} 
            gradient="from-cyan-400 to-blue-500"
            delay={0.1}
            isLoading={isLoading}
          />
          <DataCard 
            title="Power Output" 
            value={power} 
            unit="mW" 
            icon={Power} 
            gradient="from-green-400 to-emerald-500"
            delay={0.2}
            isLoading={isLoading}
          />
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            style={{ animationDelay: '0.3s' }}
          >
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-10"></div>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-5"
                whileHover={{ opacity: 0.2 }}
                transition={{ duration: 0.3 }}
              ></motion.div>
              
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  System Status
                  <Battery className="h-3 w-3 text-purple-400" />
                </CardTitle>
                <motion.div 
                  className="rounded-xl p-3 bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg"
                  variants={iconVariants}
                  animate={isLoading ? "pulse" : "idle"}
                  whileHover="hover"
                >
                  <ShieldCheck className="h-5 w-5 text-white drop-shadow-sm" />
                </motion.div>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", bounce: 0.5 }}
                >
                  <Badge 
                    variant="outline" 
                    className={`text-2xl font-bold px-6 py-3 border-2 backdrop-blur-sm ${
                      systemStatus === 'GENERATING' 
                        ? 'border-green-400/50 text-green-300 bg-green-500/10' 
                        : systemStatus === 'CONSUMING'
                        ? 'border-amber-400/50 text-amber-300 bg-amber-500/10'
                        : 'border-purple-400/50 text-purple-300 bg-purple-500/10'
                    }`}
                  >
                    <motion.span
                      animate={isLoading ? { opacity: [0.5, 1, 0.5] } : { opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {systemStatus}
                    </motion.span>
                  </Badge>
                </motion.div>
                <motion.p 
                  className="text-xs text-muted-foreground pt-3 flex items-center gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <motion.span
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    ⚡
                  </motion.span>
                  {systemStatus === 'GENERATING' ? 'Power Generation Mode' : systemStatus === 'CONSUMING' ? 'Power Consumption Mode' : 'Status Unknown'}
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <Card className="border-0 shadow-xl bg-black/20 backdrop-blur-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-green-500/5"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Live Power & Current Analytics
                  </CardTitle>
                  <CardDescription className="text-lg mt-2 flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Activity className="h-4 w-4 text-green-400" />
                    </motion.div>
                    Last updated: {lastUpdated}
                  </CardDescription>
                </div>
                <motion.div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                    isConnected 
                      ? 'bg-green-500/20 border-green-500/30' 
                      : 'bg-red-500/20 border-red-500/30'
                  }`}
                  variants={pulseVariants}
                  animate={isConnected ? "pulse" : ""}
                >
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className={`text-sm font-medium ${isConnected ? 'text-green-300' : 'text-red-300'}`}>
                    {isConnected ? 'Live Data' : 'Disconnected'}
                  </span>
                </motion.div>
              </div>
            </CardHeader>
            
            <CardContent className="h-[500px] w-full p-6 relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="h-full"
              >
                {chartData.datasets.length > 0 && (
                  <Line ref={chartRef} options={chartOptions} data={chartData} />
                )}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <motion.footer 
        className="border-t border-white/10 bg-black/20 backdrop-blur-xl relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <div className="container mx-auto py-6 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                ⚡
              </motion.div>
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-medium">
                RenuGrid Microgrid Monitor
              </span>
              <span>&copy; {new Date().getFullYear()}</span>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-400" />
                )}
                <span className="text-muted-foreground">
                  Status: <span className={isConnected ? 'text-green-400' : 'text-red-400'}>{connectionStatus}</span>
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Wifi className="h-4 w-4" />
                <span>ThingSpeak Channel: 3064301</span>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}