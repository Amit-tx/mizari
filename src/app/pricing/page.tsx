'use client';

import Link from 'next/link';
import { useState } from 'react';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    description: 'Perfect for getting started with your link-in-bio page.',
    features: [
      { text: '1 Profile', included: true },
      { text: 'Up to 5 Links', included: true },
      { text: '10 Basic Themes', included: true },
      { text: 'Basic Click Analytics', included: true },
      { text: 'Mizari Branding', included: true },
      { text: 'QR Code', included: true },
      { text: 'Product Store', included: false },
      { text: 'Link Scheduling', included: false },
      { text: 'Password Protected Links', included: false },
      { text: 'Priority Support', included: false },
    ],
    cta: 'Get Started Free',
    ctaLink: '/signup',
    highlighted: false,
    badge: '',
  },
  {
    name: 'Pro',
    price: '₹199',
    period: '/month',
    description: 'For creators who want full customization and analytics.',
    features: [
      { text: 'Up to 3 Profiles', included: true },
      { text: 'Unlimited Links', included: true },
      { text: 'All 20+ Premium Themes', included: true },
      { text: 'Full Analytics Dashboard', included: true },
      { text: 'No Mizari Branding', included: true },
      { text: 'QR Code for Every Link', included: true },
      { text: 'Product Store & Affiliate', included: true },
      { text: 'Link Scheduling', included: true },
      { text: 'Password Protected Links', included: true },
      { text: 'Priority Support', included: false },
    ],
    cta: 'Upgrade to Pro',
    ctaLink: '/signup',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Business',
    price: '₹499',
    period: '/month',
    description: 'For brands and businesses who need everything.',
    features: [
      { text: 'Up to 10 Profiles', included: true },
      { text: 'Unlimited Links', included: true },
      { text: 'All Themes + Custom Builder', included: true },
      { text: 'Advanced Analytics & Export', included: true },
      { text: 'No Mizari Branding', included: true },
      { text: 'QR Code for Every Link', included: true },
      { text: 'Product Store & Affiliate', included: true },
      { text: 'Link Scheduling', included: true },
      { text: 'Password Protected Links', included: true },
      { text: 'Priority Support & Custom Domain', included: true },
    ],
    cta: 'Go Business',
    ctaLink: '/signup',
    highlighted: false,
    badge: 'Best Value',
  },
];

const faqs = [
  {
    question: 'Can I switch plans anytime?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated.',
  },
  {
    question: 'Is there a free trial for Pro?',
    answer: 'Yes, all new users get a 7-day free trial of the Pro plan. No credit card required.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept UPI, Credit Cards, Debit Cards, Net Banking, and all major wallets through Razorpay.',
  },
  {
    question: 'Can I cancel my subscription?',
    answer: 'Absolutely. You can cancel anytime from your dashboard. Your features will remain active until the end of your billing period.',
  },
  {
    question: 'What happens to my data if I downgrade?',
    answer: 'Your data is never deleted. If you exceed the free plan limits, extra links/profiles will be hidden but preserved. Upgrade again to restore them.',
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.price === '₹0') return '₹0';
    const monthly = parseInt(plan.price.replace('₹', ''));
    if (billingCycle === 'yearly') {
      const yearly = Math.round(monthly * 10); // 2 months free
      return `₹${yearly}`;
    }
    return plan.price;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white via-orange-50/30 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        
        {/* Header */}
        <div className="text-center">
          <span className="inline-block rounded-full bg-gradient-to-r from-[#FF6B6B]/10 to-[#EE5A24]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#FF6B6B]">
            Pricing
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
            Start free. Upgrade when you need more power. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <span className={`text-sm font-semibold ${billingCycle === 'monthly' ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 ${
              billingCycle === 'yearly' ? 'bg-[#FF6B6B]' : 'bg-gray-300 dark:bg-slate-600'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-semibold ${billingCycle === 'yearly' ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
            Yearly
          </span>
          {billingCycle === 'yearly' && (
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Save 2 months 🎉
            </span>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-3xl border p-8 transition-all duration-300 hover:shadow-xl ${
                plan.highlighted
                  ? 'border-[#FF6B6B] bg-white shadow-lg shadow-[#FF6B6B]/10 dark:bg-slate-800 scale-[1.02]'
                  : 'border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800/50'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md ${
                    plan.highlighted ? 'bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24]' : 'bg-slate-800 dark:bg-slate-600'
                  }`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan Name & Price */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                    {getPrice(plan)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-slate-400">
                    {plan.price === '₹0' ? '/forever' : billingCycle === 'yearly' ? '/year' : plan.period}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">{plan.description}</p>
              </div>

              {/* CTA Button */}
              <Link
                href={plan.ctaLink}
                className={`mb-6 block w-full rounded-2xl py-3 text-center text-sm font-bold transition-all duration-200 ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] text-white shadow-md hover:shadow-lg hover:brightness-110'
                    : 'border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {plan.cta}
              </Link>

              {/* Features List */}
              <ul className="flex-1 space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    {feature.included ? (
                      <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className={`text-sm ${feature.included ? 'text-gray-700 dark:text-slate-300' : 'text-gray-400 dark:text-slate-500'}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mt-20">
          <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Compare all features
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800">
                  <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900 dark:text-white">Free</th>
                  <th className="px-6 py-4 text-center font-semibold text-[#FF6B6B]">Pro</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900 dark:text-white">Business</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {[
                  ['Profiles', '1', '3', '10'],
                  ['Links', '5', 'Unlimited', 'Unlimited'],
                  ['Themes', '10 Basic', 'All 20+', 'All + Custom'],
                  ['Analytics', 'Basic Clicks', 'Full Dashboard', 'Full + Export'],
                  ['Product Store', '—', '✅', '✅'],
                  ['Link Scheduling', '—', '✅', '✅'],
                  ['Password Links', '—', '✅', '✅'],
                  ['QR Codes', '✅', '✅', '✅'],
                  ['Remove Branding', '—', '✅', '✅'],
                  ['Tanabata Wish Tree', '✅', '✅', '✅'],
                  ['Seasonal Animations', '✅', '✅', '✅'],
                  ['Custom Domain', '—', '—', '✅'],
                  ['Priority Support', '—', '—', '✅'],
                  ['API Access', '—', '—', '✅'],
                ].map(([feature, free, pro, business], i) => (
                  <tr key={i} className="bg-white dark:bg-slate-900/50">
                    <td className="px-6 py-3 font-medium text-gray-700 dark:text-slate-300">{feature}</td>
                    <td className="px-6 py-3 text-center text-gray-500 dark:text-slate-400">{free}</td>
                    <td className="px-6 py-3 text-center text-gray-700 dark:text-slate-300 font-medium">{pro}</td>
                    <td className="px-6 py-3 text-center text-gray-700 dark:text-slate-300 font-medium">{business}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800/50 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{faq.question}</span>
                  <span className={`text-gray-400 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}>
                    ▾
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center rounded-3xl bg-gradient-to-r from-[#FF6B6B]/5 to-[#EE5A24]/5 border border-[#FF6B6B]/10 p-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Ready to level up your online presence?
          </h2>
          <p className="mt-3 text-gray-600 dark:text-slate-400">
            Join thousands of creators using Mizari to share their world.
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-block rounded-2xl bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] px-8 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg hover:brightness-110 transition-all"
          >
            Get Started for Free 🚀
          </Link>
        </div>

      </div>
    </div>
  );
}
