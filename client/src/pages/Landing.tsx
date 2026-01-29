import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { TrendingUp, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (user) return <Redirect to="/" />;

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Nav */}
      <nav className="max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
            <TrendingUp className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-display font-bold text-white">CandleAlert</span>
        </div>
        <Button 
          onClick={handleLogin}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md rounded-full px-6"
        >
          Log In
        </Button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-4 relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Live Indian Stock Market Signals
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Master the Market with <br /> Precision Alerts
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Automated monthly candlestick analysis for Indian stocks. Get instant Buy & Sell signals directly to your dashboard and email.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleLogin}
              className="text-lg px-8 py-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 transition-all hover:-translate-y-1"
            >
              Get Started Now
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 rounded-full border-white/10 hover:bg-white/5 bg-transparent backdrop-blur-sm"
            >
              View Features
            </Button>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full"
        >
          <FeatureCard 
            icon={<TrendingUp className="w-6 h-6 text-green-400" />}
            title="Monthly Patterns"
            description="Algorithmic detection of bullish and bearish monthly candlestick formations."
          />
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-yellow-400" />}
            title="Instant Alerts"
            description="Real-time notifications via email and dashboard when signals are confirmed."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6 text-blue-400" />}
            title="Verified Data"
            description="Reliable data pipeline covering top Indian market indices and stocks."
          />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-muted-foreground text-sm border-t border-white/5 mt-10">
        <p>© 2024 CandleAlert. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all text-left">
      <div className="w-12 h-12 rounded-lg bg-black/30 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
