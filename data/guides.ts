import { GuideArticle } from '@/types';

export const guidesData: GuideArticle[] = [
  {
    id: 'understanding-amortization',
    slug: 'understanding-amortization',
    title: 'How Mortgage Interest Works',
    seoTitle: 'How Mortgage Interest Works | Metricores',
    seoDescription: 'Learn how mortgage interest, amortization, and principal reduction work over time.',
    excerpt: 'Demystifying how mortgage interest compounds over time and how small, structured prepayment cycles can shave years off your loan term.',
    category: 'Finance & Mortgages',
    readTime: '6 min read',
    publishedDate: 'June 28, 2026',
    relatedCalculators: ['mortgage', 'loan'],
    keywords: ['mortgage interest', 'amortization', 'loan payment'],
    content: `When you take out a long-term loan, such as a 30-year fixed mortgage, your monthly payments are calculated using an **amortization schedule**. This schedule is designed to ensure that you pay a set amount each month, while the ratio of your payment that goes toward interest versus principal shifts over time.

### How Amortization Works
In the early years of a mortgage, a massive percentage of your monthly payment is allocated toward paying off interest rather than reducing the actual principal balance. For example, on a $400,000 home with a 20% down payment ($320,000 loan) at a 6.5% interest rate:
- Your monthly payment is **$2,022.62**.
- In the first month, **$1,733.33** goes toward interest, and only **$289.29** goes toward reducing your loan balance.
- By year 15, the split is about **$1,200** toward interest and **$822** toward principal.
- Only in the final few years of the loan does the majority of the payment go toward the principal.

### The Power of Extra Payments
Because interest is calculated based on your remaining principal balance, any extra payment you make directly reduces the principal. This has a compounding effect, as you will pay less interest in all subsequent months.

Here are three popular strategies to shorten your amortization schedule:
1. **The Bi-Weekly Strategy**: Pay half of your monthly mortgage payment every two weeks. This results in 26 half-payments, or 13 full payments per year. This single extra payment each year can shave 4 to 5 years off a 30-year term.
2. **The Lump-Sum Annual Payment**: Utilize tax refunds, annual bonuses, or investment payouts to make a single, designated principal-only payment each year.
3. **Adding $100 to the Monthly Check**: Consistently adding even $100 extra to your monthly payment directly targets the principal, saving you tens of thousands of dollars in long-term interest charges.`
  },
  {
    id: 'marginal-vs-effective-tax-rates',
    slug: 'marginal-vs-effective-tax-rates',
    title: 'ROI Explained',
    seoTitle: 'ROI Explained | Metricores',
    seoDescription: 'Understand return on investment, annualized returns, and how to compare investment performance in practice.',
    excerpt: 'Demystifying Return on Investment: how to measure, interpret, and optimize your business or personal financial return metrics correctly.',
    category: 'Finance & Investing',
    readTime: '5 min read',
    publishedDate: 'July 2, 2026',
    relatedCalculators: ['roi', 'interest'],
    keywords: ['roi explained', 'return on investment', 'annualized return'],
    content: `To make informed financial decisions, both individuals and business owners must grasp how progressive income taxation functions. A very common misconception is that entering a higher tax bracket means your entire income is suddenly taxed at that new rate. Fortunately, that is not how it works.

### Progressive Tax Brackets
The United States, United Kingdom, Canada, and many European nations employ a **progressive tax system**. This means your taxable income is divided into segments, and each segment is taxed at a progressively higher rate.

For instance, under standard 2026 Single Filer tax brackets:
- The first **$11,600** of your taxable income is taxed at **10%**.
- Income between **$11,600** and **$47,150** is taxed at **12%**.
- Income between **$47,150** and **$100,525** is taxed at **22%**.

If your taxable income is **$70,000**, you are in the **22% marginal tax bracket**. However, you do not pay 22% on all $70,000. 

### What is the Marginal Tax Rate?
Your **marginal tax rate** is the percentage of tax applied to your *next* dollar of income. If you earn an extra $1,000, bringing your total taxable income to $71,000, that extra $1,000 is taxed at your marginal rate of 22% ($220 tax).

### What is the Effective Tax Rate?
Your **effective tax rate** is the actual, average percentage of your total income paid in tax. It is calculated by dividing your total tax liability by your total gross income.

For the $70,000 taxable income filer (assuming standard deductions of $15,000 on an $85,000 gross salary):
- Total Tax Due: **$10,453.00**
- Gross Income: **$85,000.00**
- **Effective Tax Rate**: **12.30%** ($10,453 / $85,000)

Your effective tax rate will always be lower than your marginal tax rate, unless you are in the very lowest bracket. Understanding this distinction is key to evaluating tax deductions, business expenditures, and salary increments.`
  },
  {
    id: 'gross-margin-vs-markup',
    slug: 'gross-margin-vs-markup',
    title: 'Profit Margin Guide',
    seoTitle: 'Profit Margin Guide | Metricores',
    seoDescription: 'Understand gross margin, markup, and pricing strategy with clearer business math.',
    excerpt: 'Confusing gross margin and markup is one of the leading causes of early-stage business failure. Here is how to price for profitability.',
    category: 'Business & Management',
    readTime: '7 min read',
    publishedDate: 'July 5, 2026',
    relatedCalculators: ['profit-margin', 'roi'],
    keywords: ['profit margin', 'gross margin', 'markup'],
    content: `Many new entrepreneurs use the terms "margin" and "markup" interchangeably. While both metrics are derived from the relationship between cost of goods sold (COGS) and selling price, they measure entirely different percentages. Confusing them can lead to underpriced inventory, tight margins, and eventual business insolvency.

### Defining the Terms
Let's establish a clear baseline:
- **Cost of Goods Sold (COGS)**: What you pay to acquire or produce a product (e.g., raw materials, manufacturing labor, wholesale cost).
- **Selling Price**: The final price your customer pays.
- **Gross Profit**: The actual dollar amount left over. **Gross Profit = Selling Price - Cost**.

### Gross Margin: The Retailer’s Focus
**Gross Margin** measures your gross profit relative to the *selling price*. It tells you what percentage of your revenue is profit.
- **Formula**: \`Margin (%) = (Gross Profit / Selling Price) * 100\`
- **Example**: If an item costs $60 to make and you sell it for $100, your gross profit is $40. Your gross margin is **40%** ($40 / $100).

### Markup: The Supplier’s Focus
**Markup** measures your gross profit relative to the *cost of production*. It tells you how much more you charged than what the item cost you to buy or build.
- **Formula**: \`Markup (%) = (Gross Profit / Cost) * 100\`
- **Example**: For the same $60 cost and $100 selling price ($40 profit), your markup is **66.67%** ($40 / $60).

### The Dangerous Pricing Trap
Imagine your business costs are $150,000 a year, and you need to achieve a **40% Gross Margin** on all product sales to break even. You purchase inventory items at a wholesale cost of $60 each.

If you mistakenly think markup and margin are the same, you might apply a **40% markup** to the cost:
- Cost = $60
- Markup (40%) = $24
- Selling Price = **$84**

Let’s check the actual Gross Margin at an $84 selling price:
- Gross Profit = $84 - $60 = $24
- Gross Margin = ($24 / $84) * 100 = **28.57%**

By confusing the two, you priced your items at $84 instead of the correct **$100** needed to reach your 40% margin. You have a massive cash deficit, which directly impacts your business survival. Always use a dedicated calculator to verify your target parameters before launching sales campaigns.`
  }
];

export function getGuideBySlug(slug: string): GuideArticle | undefined {
  return guidesData.find((guide) => guide.slug === slug || guide.id === slug);
}
