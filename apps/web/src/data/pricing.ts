export interface PricingPlan {
    name: string;
    price: string;
    period: string;
    description: string;
    popular: boolean;
    features: string[];
    cta: string;
}

export const pricingPlans: PricingPlan[] = [
    {
        name: 'Starter',
        price: 'Free',
        period: 'forever',
        description: 'Perfect for trying out RentalOne with basic features.',
        popular: false,
        features: [
            'Up to 50 inventory items',
            'Basic booking management',
            'Single user access',
            'Email support',
            'Dashboard overview',
        ],
        cta: 'Get Started Free',
    },
    {
        name: 'Growth',
        price: '$29',
        period: '/month',
        description: 'For growing rental businesses that need more power.',
        popular: true,
        features: [
            'Unlimited inventory items',
            'Advanced booking calendar',
            'Up to 5 team members',
            'QR & barcode scanning',
            'Digital contracts & e-signatures',
            'Email & chat support',
            'Revenue analytics',
            'Client management',
        ],
        cta: 'Start Free Trial',
    },
    {
        name: 'Enterprise',
        price: '$79',
        period: '/month',
        description: 'For multi-location operations with advanced needs.',
        popular: false,
        features: [
            'Everything in Growth',
            'Unlimited team members',
            'Multi-location inventory',
            'Custom roles & permissions',
            'API access & webhooks',
            'Priority phone & chat support',
            'Dedicated account manager',
            'Custom integrations',
            'SLA guarantee',
        ],
        cta: 'Contact Sales',
    },
];
