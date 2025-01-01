"use client";

import { Button2 } from "./button2.js";
import { Card } from "./card.js";
import { Check } from "lucide-react";

const plans = [
  {
    title: "Personal",
    price: "Free",
    description: "Perfect for individual users",
    features: [
      "Send money to friends & family",
      "Digital wallet management",
      "Mobile app access",
      "Real-time notifications",
      "Standard support",
      "Basic analytics",
    ],
    buttonText: "Get Started",
    popular: false,
  },
  {
    title: "Business",
    price: "$29",
    description: "Ideal for growing businesses",
    features: [
      "Everything in Personal, plus:",
      "Accept online payments",
      "Multiple team members",
      "Advanced analytics",
      "Priority support",
      "Custom payment pages",
    ],
    buttonText: "Start Free Trial",
    popular: true,
  },
  {
    title: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: [
      "Everything in Business, plus:",
      "Custom integration support",
      "Dedicated account manager",
      "Custom contracts & SLAs",
      "24/7 phone support",
      "Advanced security features",
    ],
    buttonText: "Contact Sales",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your needs. No hidden fees, no
            surprises.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative p-8 ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 mr-3 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button2
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                size="lg"
              >
                {plan.buttonText}
              </Button2>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
