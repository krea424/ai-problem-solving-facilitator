import { Playbook } from '../types';

export const playbooks: Playbook[] = [
  {
    id: 'cost-efficiency-roadmap',
    name: 'Riduzione Costi & Efficiency Roadmap',
    objective: 'Ridurre il costo operativo complessivo del 12-15% entro 12 mesi per una PMI di servizi B2B.',
    description:
      'Percorso guidato per analizzare i costi, identificare sprechi e opportunità di ottimizzazione, quindi implementare iniziative di efficienza in una società di servizi italiana.',
    sector: 'Services',
    problemCategory: 'Operational',
    frameworks: [
      {
        id: 'cost-tree',
        name: 'Cost Tree Analysis',
        type: 'Analysis',
        description:
          'Scomposizione sistematica dei costi (personale, overhead, fornitori, IT) per identificare le aree di maggiore incidenza.',
        steps: [
          'Raccogli tutti i centri di costo e i ledger delle spese degli ultimi 12 mesi.',
          'Classifica i costi in Direct vs Indirect e Fissi vs Variabili.',
          'Calcola il peso percentuale di ciascuna categoria sul totale costi.',
          'Prioritizza le prime 3 categorie ad alto impatto.'
        ],
      },
      {
        id: 'abc',
        name: 'Activity-Based Costing',
        type: 'Analysis',
        description:
          'Attribuisce i costi alle attività (processi) piuttosto che ai soli centri di costo, per capire la redditività di ogni servizio offerto.',
        steps: [
          'Mappa i macro-processi (es. onboarding clienti, delivery servizi, fatturazione).',
          'Associa cost driver (ore/uomo, chiamate, ticket) a ciascun processo.',
          'Attribuisci costi diretti e indiretti ai processi in base ai driver.',
          'Confronta i costi di processo con i ricavi generati per identificare margin erosion.'
        ],
      },
      {
        id: 'lean-six-sigma',
        name: 'Lean Six Sigma (DMAIC)',
        type: 'Implementation',
        description:
          'Metodo per ridurre sprechi e variazioni nei processi chiave della delivery del servizio.',
        steps: [
          'Define: definisci il problema di inefficienza principale (es. tempo medio di delivery).',
          'Measure: raccogli dati sui processi attuali.',
          'Analyze: individua le cause radice degli sprechi.',
          'Improve: disegna soluzioni (standardizzazione, automazione).',
          'Control: implementa metriche di controllo (SLA, backlog).' 
        ],
      },
    ],
    implementationPlan: {
      phases: [
        {
          name: 'Diagnosi Costi',
          duration: '1 mese',
          activities: ['Analisi Cost Tree', 'Workshops con team Finance & Operations', 'Validazione ipotesi risparmi'],
          deliverables: ['Rapporto di Diagnosi Costi', 'Dashboard costi per categoria'],
          stakeholders: ['CFO', 'Responsabile Operazioni'],
          risks: [
            {
              riskName: 'Qualità dati contabili',
              probability: 3,
              impact: 4,
              mitigationStrategy: 'Cross-check con estratti conto e contratti fornitori',
              contingencyPlan: 'Eseguire campionamento manuale',
              owner: 'Controller',
            },
          ],
        },
        {
          name: 'Design Iniziative',
          duration: '1,5 mesi',
          activities: ['Workshops Lean', 'Business case iniziative', 'Prioritizzazione quick wins'],
          deliverables: ['Portafoglio iniziative', 'Business Case economico'],
          stakeholders: ['COO', 'Team Continuous Improvement'],
          risks: [
            {
              riskName: 'Resistenza al cambiamento',
              probability: 4,
              impact: 5,
              mitigationStrategy: 'Piano di comunicazione e incentivi',
              contingencyPlan: 'Coinvolgere early adopters come evangelist',
              owner: 'HR Manager',
            },
          ],
        },
        {
          name: 'Implementazione & Monitoraggio',
          duration: '9 mesi',
          activities: ['Implementazione automazione RPA', 'Rinegoziazione contratti fornitori', 'Formazione personale'],
          deliverables: ['KPI Report mensile', 'Aggiornamento procedure'],
          stakeholders: ['IT Manager', 'Procurement'],
          risks: [
            {
              riskName: 'Slittamento timeline IT',
              probability: 3,
              impact: 4,
              mitigationStrategy: 'Project governance stretta, milestone chiare',
              contingencyPlan: 'Risorse aggiuntive di sviluppo',
              owner: 'PMO',
            },
          ],
        },
      ],
      kpis: [
        { metric: 'Costo Operativo Totale', target: '-15%', frequency: 'Mensile' },
        { metric: 'Costo del Personale / Ricavi', target: '-3pp', frequency: 'Mensile' },
        { metric: 'SLA Delivery Servizi', target: '+10%', frequency: 'Mensile' },
      ],
    },
    stakeholderTemplates: [
      {
        stakeholderName: 'CFO',
        influence: 9,
        interest: 8,
        engagement: 'Champion',
        actions: ['Presentare business case', 'Condividere quick wins'],
      },
      {
        stakeholderName: 'Responsabile Operazioni',
        influence: 8,
        interest: 9,
        engagement: 'Supporter',
        actions: ['Workshop processi', 'Definire target KPI'],
      },
    ],
    riskTemplates: [
      {
        riskName: 'Turnover personale chiave',
        probability: 2,
        impact: 4,
        mitigationStrategy: 'Retention plan',
        contingencyPlan: 'Formazione figure junior',
        owner: 'HR Manager',
      },
    ],
    kpis: [
      { metric: 'Margine EBITDA', target: '+2pp', frequency: 'Trimestrale' },
    ],
  },
  {
    id: 'digital-transformation-assessment',
    name: 'Digital Transformation Assessment',
    objective: 'Valutare la maturità digitale e definire una roadmap prioritaria di iniziative per una PMI di servizi.',
    description:
      'Percorso per eseguire un assessment di maturità digitale e identificare investimenti IT ad alto ROI in ambito servizi B2B.',
    sector: 'Services',
    problemCategory: 'Digital',
    frameworks: [
      {
        id: 'as-is-process',
        name: 'As-Is Process Mapping',
        type: 'Analysis',
        description:
          'Mappatura dei processi esistenti per identificare colli di bottiglia e livelli di digitalizzazione.',
        steps: [
          'Identifica i 5 processi core (es. sales, delivery, customer support).',
          'Documenta flusso, sistemi utilizzati e pain-points.',
          'Misura lead time e sforzo manuale per step.',
          'Quantifica costi di processo e inefficienze.'
        ],
      },
      {
        id: 'digital-maturity',
        name: 'Digital Maturity Model',
        type: 'Analysis',
        description:
          "Valuta la maturità digitale su 5 dimensioni: Strategia, Processi, Tecnologia, Persone, Dati.",
        steps: [
          'Definisci criteri di valutazione per ciascuna dimensione (livello 1-5).',
          'Conduci interviste ai responsabili di funzione.',
          'Attribuisci punteggio attuale e target a 18 mesi.',
          'Identifica gap di maturità e priorità di intervento.'
        ],
      },
      {
        id: 'technology-fit-gap',
        name: 'Technology Fit-Gap Analysis',
        type: 'Analysis',
        description:
          'Analizza la copertura funzionale dei sistemi IT rispetto ai requisiti di business e alle best practice.',
        steps: [
          'Elenca requisiti chiave (automazione workflow, tracciamento KPI, integrazione CRM).',
          'Mappa le funzionalità attuali dei sistemi (ERP, CRM, ticketing).',
          'Evidenzia gap critici e potenziali quick wins tecnologici.',
          'Prioritizza le iniziative di upgrade o sostituzione sistemi.'
        ],
      },
    ],
    implementationPlan: {
      phases: [
        {
          name: 'Digital Assessment',
          duration: '1 mese',
          activities: ['Workshops mapping processi', 'Somministrazione survey maturità', 'Analisi dati KPI digitali'],
          deliverables: ['Rapporto Maturità Digitale', 'Process Map As-Is', 'Gap Analysis'],
          stakeholders: ['CEO', 'IT Manager'],
          risks: [
            {
              riskName: 'Disponibilità stakeholder',
              probability: 3,
              impact: 3,
              mitigationStrategy: 'Pianificazione incontri con largo anticipo',
              contingencyPlan: 'Sessioni one-to-one',
              owner: 'Project Lead',
            },
          ],
        },
        {
          name: 'Roadmap Design',
          duration: '1 mese',
          activities: ['Ideazione iniziative', 'Business case digitale', 'Prioritizzazione secondo ROI'],
          deliverables: ['Roadmap 18 mesi', 'Budget Capex/Opex'],
          stakeholders: ['CFO', 'CTO'],
          risks: [
            {
              riskName: 'Limitazioni budget',
              probability: 4,
              impact: 4,
              mitigationStrategy: 'Fase investimenti in wave',
              contingencyPlan: 'Ricerca incentivi fiscali',
              owner: 'Finance Team',
            },
          ],
        },
        {
          name: 'Implementation Quick Wins',
          duration: '3 mesi',
          activities: ['Automazione RPA ticketing', 'Integrazione CRM-ERP', 'Upskilling team'],
          deliverables: ['Tools implementati', 'Training completato'],
          stakeholders: ['Operations Manager', 'HR Manager'],
          risks: [
            {
              riskName: 'Scarsa adozione utenti',
              probability: 4,
              impact: 5,
              mitigationStrategy: 'Change management, sessioni formazione',
              contingencyPlan: 'Supporto on-the-job',
              owner: 'Change Lead',
            },
          ],
        },
      ],
      kpis: [
        { metric: 'Digital Maturity Score', target: '+1 punto', frequency: 'Semestrale' },
        { metric: 'Automation Rate processi chiave', target: '+20%', frequency: 'Trimestrale' },
        { metric: 'Customer Satisfaction (NPS)', target: '+5', frequency: 'Trimestrale' },
      ],
    },
    stakeholderTemplates: [
      {
        stakeholderName: 'CEO',
        influence: 9,
        interest: 9,
        engagement: 'Champion',
        actions: ['Allineare visione digitale', 'Garantire sponsorship'],
      },
      {
        stakeholderName: 'IT Manager',
        influence: 8,
        interest: 8,
        engagement: 'Supporter',
        actions: ['Fornire dati sistemi', 'Coordinare soluzioni IT'],
      },
    ],
    riskTemplates: [
      {
        riskName: 'Obsolescenza tecnologica rapida',
        probability: 2,
        impact: 4,
        mitigationStrategy: 'Architettura modulare e scalabile',
        contingencyPlan: 'Contratti SaaS flessibili',
        owner: 'CTO',
      },
    ],
    kpis: [
      { metric: 'Tempo Medio Risoluzione Ticket', target: '-20%', frequency: 'Mensile' },
    ],
  },
  {
    id: 'esg-roadmap',
    name: 'ESG Sustainability Roadmap',
    objective: 'Definire e implementare una roadmap ESG triennale che migliori il rating di sostenibilità e riduca le emissioni Scope 1+2 del 20 % per una PMI di servizi.',
    description: 'Percorso guidato per identificare tematiche materiali ESG, determinare baseline di emissioni e costruire un piano di iniziative sostenibili con KPI monitorabili.',
    sector: 'Services',
    problemCategory: 'Strategic',
    frameworks: [
      {
        id: 'materiality-assessment',
        name: 'ESG Materiality Assessment',
        type: 'Analysis',
        description: 'Identifica e priorizza i temi ESG più rilevanti per l’azienda e i suoi stakeholder.',
        steps: [
          'Mappa i principali stakeholder interni ed esterni (dipendenti, clienti, fornitori, comunità).',
          'Costruisci una lista iniziale di temi ESG (es. carbon footprint, diversity, data privacy).',
          'Somministra survey/ interviste per valutarne l’importanza percepita.',
          'Crea matrice di materialità (asse x: importanza stakeholder, asse y: impatto business) e identifica top 5 temi.'
        ],
      },
      {
        id: 'carbon-baseline',
        name: 'Carbon Footprint Baseline',
        type: 'Analysis',
        description: 'Calcola le emissioni Scope 1 & 2 attuali per definire obiettivi di riduzione.',
        steps: [
          'Raccogli dati consumo energia elettrica e combustibili ultimi 12 mesi.',
          'Applica fattori di emissione standard (ISPRA/ GHG Protocol).',
          'Calcola tonnellate CO2e totali e intensità (per FTE o fatturato).',
          'Identifica fonti di emissione principali (>80 %).'
        ],
      },
      {
        id: 'esg-strategy-canvas',
        name: 'ESG Strategy Canvas',
        type: 'Strategy',
        description: 'Visualizza le iniziative ESG su un canvas con impatto vs effort per prioritizzare.',
        steps: [
          'Elenca iniziative possibili (LED retrofit, smart working, codice etico fornitori, volontariato).',
          'Valuta impatto (CO2e risparmiate, rating ESG) e effort (costo, complessità).',
          'Posiziona ogni iniziativa sulla matrice 2×2 Quick Wins / Major Projects.',
          'Seleziona roadmap triennale bilanciando quick wins e progetti strutturali.'
        ],
      }
    ],
    implementationPlan: {
      phases: [
        {
          name: 'Assessment & Baseline',
          duration: '2 mesi',
          activities: ['Materiality workshop', 'Raccolta dati consumo energia', 'Audit processi HR e supply chain'],
          deliverables: ['Matrice materialità', 'Carbon Footprint Report', 'Gap analysis ESG'],
          stakeholders: ['Sustainability Manager', 'CFO'],
          risks: [
            {
              riskName: 'Dati consumo incompleti',
              probability: 3,
              impact: 3,
              mitigationStrategy: 'Coinvolgere facility manager, standardizzare template raccolta',
              contingencyPlan: 'Stima proxy su fatture',
              owner: 'Controller',
            },
          ],
        },
        {
          name: 'Roadmap Design',
          duration: '1 mese',
          activities: ['ESG Strategy Canvas', 'Business case iniziative', 'Definizione target 2030'],
          deliverables: ['Roadmap ESG 3 anni', 'Budget Capex/Opex', 'Policy sostenibilità'],
          stakeholders: ['CEO', 'HR Manager'],
          risks: [
            {
              riskName: 'Budget limitato',
              probability: 4,
              impact: 3,
              mitigationStrategy: 'Prioritizzare quick wins, ricercare incentivi fiscali',
              contingencyPlan: 'Scaglionare investimenti in ondate',
              owner: 'CFO',
            },
          ],
        },
        {
          name: 'Implementation & Monitoring',
          duration: '6 mesi',
          activities: ['Installazione LED', 'Programma Diversity & Inclusion', 'Formazione ESG awareness', 'Implementazione software reporting'],
          deliverables: ['Rapporti trimestrali KPI', 'Comunicazione stakeholder'],
          stakeholders: ['Operations Manager', 'Marketing'],
          risks: [
            {
              riskName: 'Scarsa adozione cultura ESG',
              probability: 3,
              impact: 4,
              mitigationStrategy: 'Campagne interne di sensibilizzazione',
              contingencyPlan: 'Incentivi legati a performance ESG',
              owner: 'HR Manager',
            },
          ],
        },
      ],
      kpis: [
        { metric: 'Emissioni Scope 1+2 (tCO2e)', target: '-20%', frequency: 'Annuale' },
        { metric: 'Energy Intensity (kWh/FTE)', target: '-15%', frequency: 'Annuale' },
        { metric: 'Waste Recycling Rate', target: '+25%', frequency: 'Semestrale' },
        { metric: 'ESG Rating Score', target: '+10 punti', frequency: 'Annuale' },
      ],
    },
    stakeholderTemplates: [
      {
        stakeholderName: 'Sustainability Manager',
        influence: 8,
        interest: 10,
        engagement: 'Champion',
        actions: ['Guidare assessment', 'Coordinare reportistica'],
      },
      {
        stakeholderName: 'CFO',
        influence: 9,
        interest: 7,
        engagement: 'Supporter',
        actions: ['Allocare budget', 'Monitorare risparmi costi energia'],
      },
    ],
    riskTemplates: [
      {
        riskName: 'Pressure di costi iniziali',
        probability: 3,
        impact: 4,
        mitigationStrategy: 'Analisi ROI dettagliata, incentivi GSE',
        contingencyPlan: 'Posticipo iniziative non critiche',
        owner: 'Project Lead',
      },
    ],
    kpis: [
      { metric: 'Percentuale Fornitori con Codice Etico', target: '100%', frequency: 'Annuale' },
    ],
  }
];

export default playbooks; 