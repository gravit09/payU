import { Navbar } from "@repo/ui/navbar";
import { Footer } from "@repo/ui/footer";
import { Button2 } from "@repo/ui/button2";
import { ArrowRight } from "lucide-react";
import { Card } from "@repo/ui/card";
import { PricingSection } from "@repo/ui/PricingSection";
import { GradientText } from "@repo/ui/gradient-text";
import { StatBadge } from "@repo/ui/stat-badge";
import {
  Shield,
  Globe,
  Wallet,
  CreditCard,
  ChartBar,
  Lock,
  Zap,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Bank-Grade Security",
      description:
        "Enterprise-level encryption and advanced fraud protection systems safeguard every transaction.",
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Payments",
      description:
        "Send and receive money instantly across 150+ countries with competitive exchange rates.",
    },
    {
      icon: <Wallet className="h-8 w-8" />,
      title: "Smart Wallet",
      description:
        "Manage multiple currencies, track expenses, and earn rewards with our intelligent digital wallet.",
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "Virtual Cards",
      description:
        "Create virtual cards for online purchases with customizable spending limits and controls.",
    },
    {
      icon: <ChartBar className="h-8 w-8" />,
      title: "Advanced Analytics",
      description:
        "Gain insights into your spending patterns with detailed financial analytics and reports.",
    },
    {
      icon: <Lock className="h-8 w-8" />,
      title: "Secure Authentication",
      description:
        "Multi-factor authentication and biometric security keep your account protected.",
    },
  ];
  return (
    <div>
      <Navbar />
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.05),transparent_50%)]" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Stats Banner */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <StatBadge
              icon={<Globe className="h-4 w-4" />}
              value="150+"
              label="Countries"
            />
            <StatBadge
              icon={<Shield className="h-4 w-4" />}
              value="99.9%"
              label="Uptime"
            />
            <StatBadge
              icon={<Zap className="h-4 w-4" />}
              value="2M+"
              label="Users"
            />
          </div>

          {/* Main Content */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
              Revolutionizing <GradientText>Digital Payments</GradientText> for
              Everyone
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              Experience lightning-fast transactions, bank-grade security, and
              seamless cross-border payments. All in one platform.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <Button2 size="lg" className="text-lg h-14 px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button2>
              <Button2
                size="lg"
                variant="outline"
                className="text-lg h-14 px-8"
              >
                View Live Demo
              </Button2>
            </div>

            {/* Trust Indicators */}
            <div className="flex justify-center items-center gap-12 text-muted-foreground">
              <div className="text-sm">
                <div className="font-medium text-primary">Enterprise Ready</div>
                SOC2 Type II Certified
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-sm">
                <div className="font-medium text-primary">Highly Rated</div>
                4.9/5 on G2 Crowd
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-sm">
                <div className="font-medium text-primary">24/7 Support</div>
                Average Response &lt; 5min
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-24 bg-muted/100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Why Millions Choose Us
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the next generation of digital payments with our
              comprehensive feature set
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 p-6"
              >
                <div className="flex flex-col items-start">
                  <div className="p-3 bg-primary/10 rounded-lg mb-4 group-hover:bg-primary/20 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <PricingSection />
      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557264337-e8a93017fe92?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
              Ready to Transform Your Payments?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join millions of users who trust our platform for their payment
              needs. Experience the future of digital payments today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button2 size="lg" variant="secondary" className="text-lg px-8">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button2>
              <Button2
                size="lg"
                variant="outline"
                className="text-lg px-8 bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10"
              >
                Schedule Demo
              </Button2>
            </div>
          </div>
        </div>
      </section>
      {/* Footer Section */}
      <Footer />
    </div>
  );
}
