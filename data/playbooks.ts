import type { Playbook } from '../types';

export const playbooks: Playbook[] = [
  {
    id: 'playbook-1',
    name: 'Cost Reduction & Efficiency Roadmap',
    objective: 'Our goal is to conduct a comprehensive analysis of all operational and administrative costs within our national services company. We need to identify specific areas of inefficiency, waste, and redundancy to implement a targeted cost reduction strategy that improves our operating margin by 15% without negatively impacting service quality or employee morale.',
    context: 'We are a mid-sized B2B professional services firm with 500 employees, experiencing shrinking margins due to rising operational expenses and increased market competition. Our current processes are largely manual, and we suspect there are significant opportunities for optimization through technology and workflow improvements.',
    description: 'A guided process to analyze costs, identify waste and optimization opportunities, and then implement targeted initiatives in an Italian service company.',
    sector: 'Services',
    problemCategory: 'Operational',
    frameworks: [],
    implementationPlan: { phases: [], kpis: [] },
    stakeholderTemplates: [],
    riskTemplates: [],
    kpis: [],
  },
  {
    id: 'playbook-2',
    name: 'Digital Transformation Assessment',
    objective: 'We need to develop a clear and actionable digital transformation roadmap. This involves assessing our current digital maturity across all business units, identifying key technology gaps and investment opportunities, and prioritizing initiatives that will deliver the highest ROI in a B2B environment by enhancing customer experience and operational efficiency.',
    context: 'We are a traditional manufacturing company with a strong offline presence but limited digital capabilities. Our sales process is heavily reliant on a field sales team, and our online customer engagement is minimal. We need to embrace digital to stay competitive, improve our supply chain, and open new B2B sales channels.',
    description: 'A process to perform a digital maturity assessment and identify high-ROI IT investments in a B2B context.',
    sector: 'Manufacturing',
    problemCategory: 'Digital',
    frameworks: [],
    implementationPlan: { phases: [], kpis: [] },
    stakeholderTemplates: [],
    riskTemplates: [],
kpis: [],
  },
  {
    id: 'playbook-3',
    name: 'ESG Sustainability Roadmap',
    objective: 'The objective is to establish a foundational ESG (Environmental, Social, and Governance) strategy by identifying material ESG topics relevant to our industry. We need to determine our current emissions baseline, define clear sustainability goals, and build a roadmap of credible, monitorable initiatives to improve our corporate citizenship and meet growing stakeholder expectations.',
    context: 'As a publicly-listed consumer goods company, we are facing increasing pressure from investors, regulators, and customers to demonstrate a clear commitment to sustainability. We currently lack a formal ESG strategy, and our data collection for key metrics like carbon emissions is inconsistent. We need a structured approach to build a credible and impactful program.',
    description: 'A guided process to identify material ESG themes, determine emission baselines, and build a plan of sustainable and monitorable initiatives.',
    sector: 'Retail',
    problemCategory: 'Strategic',
    frameworks: [],
    implementationPlan: { phases: [], kpis: [] },
    stakeholderTemplates: [],
    riskTemplates: [],
    kpis: [],
  },
];

export default playbooks; 