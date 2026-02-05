import { BankLogo } from '@/components/BankLogo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Shield, TrendingUp, Zap, CreditCard, Landmark, MousePointer2, Smartphone } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <BankLogo className="text-primary" />
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#services" className="hover:text-primary transition-colors">Services</Link>
            <Link href="#about" className="hover:text-primary transition-colors">About Us</Link>
          </div>
          <div className="flex gap-2 sm:gap-4">
            <Link href="/login">
              <Button variant="ghost" className="hidden sm:inline-flex px-3 sm:px-4">
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md px-3 sm:px-6">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold mb-6">
                <Shield size={14} /> TRUSTED BY 2M+ CUSTOMERS
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.1]">
                Banking that <span className="text-primary">moves</span> with your life.
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
                Experience the next generation of digital banking. Secure, intuitive, and designed to help you reach your financial goals faster.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-7 text-lg rounded-xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                    Open Your Account <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                <div className="flex items-center gap-4 px-2">
                    <div className="flex -space-x-3">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                                <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                    <div className="text-xs font-medium text-muted-foreground">
                        <span className="text-foreground font-bold">4.9/5</span> rating from <br/>our active users
                    </div>
                </div>
              </div>
            </div>
            <div className="relative w-full">
              <div className="absolute -top-10 sm:-top-20 -right-10 sm:-right-20 w-64 sm:w-96 h-64 sm:h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border aspect-[4/3] w-full bg-muted group transition-transform duration-500 hover:scale-[1.02]">
                <img 
                  src="https://images.pexels.com/photos/258160/pexels-photo-258160.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Modern Bank Building"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/20 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                            <Shield size={18} />
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-bold">Security Verification</p>
                            <p className="text-[10px] sm:text-xs opacity-80">Encryption active & monitored 24/7</p>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-primary font-bold text-sm tracking-wider uppercase mb-3">Core Features</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Designed for modern banking</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
              We've stripped away the complexity of traditional banking to give you a tool that actually works for your lifestyle.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: Smartphone, title: "Mobile First", desc: "Manage your finances on the go with our top-rated mobile application." },
              { icon: Shield, title: "Military-Grade", desc: "Your data is protected by the same encryption used by the world's leading banks." },
              { icon: Zap, title: "Instant Transfers", desc: "Send money to anyone, anywhere, at the speed of light with no hidden fees." },
              { icon: TrendingUp, title: "Wealth Growth", desc: "Smart savings tools and investment insights to help your money work harder." }
            ].map((feature, i) => (
              <div key={i} className="bg-card p-6 sm:p-8 rounded-2xl border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="text-primary" size={24} />
                </div>
                <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Showcase */}
      <section id="services" className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative w-full">
                <div className="bg-primary rounded-3xl p-6 sm:p-8 text-primary-foreground shadow-2xl relative overflow-hidden h-[350px] sm:h-[400px] flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                    <div>
                        <BankLogo className="text-white mb-8" />
                        <h4 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">Master your money with <br/>smart analytics.</h4>
                        <p className="text-sm sm:text-base opacity-80">Track every penny, set budgets, and visualize your spending habits automatically.</p>
                    </div>
                    <div className="flex gap-3 sm:gap-4">
                        <div className="bg-white/20 p-3 sm:p-4 rounded-xl backdrop-blur-md flex-1 text-center">
                            <p className="text-[10px] sm:text-xs opacity-70 mb-1 uppercase tracking-wider">Savings</p>
                            <p className="text-lg sm:text-xl font-bold">$12,450.00</p>
                        </div>
                        <div className="bg-white/20 p-3 sm:p-4 rounded-xl backdrop-blur-md flex-1 text-center">
                            <p className="text-[10px] sm:text-xs opacity-70 mb-1 uppercase tracking-wider">Monthly Growth</p>
                            <p className="text-lg sm:text-xl font-bold">+14.2%</p>
                        </div>
                    </div>
                </div>
                <div className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-6 bg-white p-3 sm:p-4 rounded-2xl shadow-2xl border border-border hidden sm:flex">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                            <TrendingUp size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] text-muted-foreground font-medium">Auto-Saving</p>
                            <p className="text-xs sm:text-sm font-bold">Successfully active</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-primary font-bold text-sm tracking-wider uppercase mb-3 text-left">Banking Services</h2>
              <h3 className="text-3xl sm:text-4xl font-bold mb-8 leading-tight">Complete financial ecosystem in your pocket.</h3>
              
              <div className="space-y-6">
                {[
                  { icon: Landmark, title: "Personal Banking", desc: "Checking and savings accounts tailored to your specific financial needs." },
                  { icon: CreditCard, title: "Smart Cards", desc: "Physical and virtual cards with zero monthly fees and instant freeze controls." },
                  { icon: MousePointer2, title: "One-Click Transfers", desc: "Manage beneficiaries and schedule recurring payments with ultimate ease." }
                ].map((service, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-full flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                      <service.icon className="text-muted-foreground group-hover:text-primary-foreground transition-colors duration-300" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{service.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{service.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto bg-primary rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 md:p-20 text-center text-primary-foreground relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -ml-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-400 rounded-full -mr-32 -mb-32 blur-3xl" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-8">Secure your financial future today.</h2>
            <p className="text-lg sm:text-xl opacity-80 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join 2 million people who have already switched to PTBank. Opening an account takes less than 3 minutes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup">
                <Button className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 px-8 py-7 text-lg sm:text-xl font-bold rounded-2xl transition-transform hover:scale-105 active:scale-95 shadow-xl">
                  Get Started for Free
                </Button>
              </Link>
              <Button variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 px-8 py-7 text-lg sm:text-xl font-bold rounded-2xl">
                View Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-16 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
            <div className="sm:col-span-2">
              <BankLogo className="mb-6" />
              <p className="text-muted-foreground text-sm sm:text-base max-w-sm mb-8 leading-relaxed">
                PTBank is a financial technology company, not a bank. Banking services provided by our partner banks.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Services</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="hover:text-primary transition-colors cursor-pointer">Personal Accounts</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Smart Savings</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Money Transfers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Support</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="hover:text-primary transition-colors cursor-pointer">Help Center</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Contact Support</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Security Guides</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Terms of Use</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Compliance</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-10 text-center flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-muted-foreground text-sm italic text-center sm:text-left">Designed for the future of finance.</p>
            <p className="text-muted-foreground text-sm font-medium">© 2024 PTBank. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
