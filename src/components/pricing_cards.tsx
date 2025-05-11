"use client"
import { useState } from 'react';

export default function PricingModal() {
  const [isOpen, setIsOpen] = useState(false);

  const plans = [
    {
      name: "Starter",
      price: "$9",
      period: "/month",
      description: "Perfect for small teams",
      features: [
        "Up to 5 users",
        "10GB storage",
        "Basic analytics",
        "Email support",
        "API access",
        "Mobile app",
        "Custom branding"
      ],
      buttonText: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "Best for growing businesses",
      features: [
        "Up to 50 users",
        "100GB storage",
        "Advanced analytics",
        "Priority support",
        "API access",
        "White-labeling",
        "Custom integrations",
        "SSO authentication",
        "Advanced security"
      ],
      buttonText: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For large organizations",
      features: [
        "Unlimited users",
        "Unlimited storage",
        "Custom analytics",
        "Dedicated support",
        "Custom API",
        "Advanced workflow",
        "Data export",
        "Compliance tools",
        "SLA guarantee",
        "Multi-region hosting"
      ],
      buttonText: "Contact Sales",
      popular: false
    }
  ];

  return (
    <>
      {/* Trigger button */}
      <button 
        className="btn btn-outline btn-lg px-8 border-primary-foreground"
        onClick={() => setIsOpen(true)}
      >
        View Pricing
      </button>

      {/* Modal */}
      <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-6xl">
          <button 
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
          
          <h2 className="font-bold text-2xl mb-6 text-center">Choose Your Plan</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`card bg-base-100 shadow-xl ${
                  plan.popular ? 'ring-2 ring-primary ring-offset-2 ring-offset-base-100' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="badge badge-primary">Most Popular</div>
                  </div>
                )}
                
                <div className="card-body">
                  <h3 className="card-title text-xl">{plan.name}</h3>
                  <p className="text-sm opacity-70">{plan.description}</p>
                  
                  <div className="my-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-base-content/60">{plan.period}</span>
                  </div>
                  
                  <ul className="space-y-2 flex-grow">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <svg 
                          className="w-4 h-4 text-success mr-2"
                          fill="none" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="card-actions justify-center mt-6">
                    <button className={`btn btn-block ${
                      plan.popular ? 'btn-primary' : 'btn-outline'
                    }`}>
                      {plan.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="modal-action">
            <button 
              className="btn"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}