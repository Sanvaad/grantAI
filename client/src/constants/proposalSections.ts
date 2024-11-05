// src/constants/proposalSections.ts
import { 
    FileText, 
    Target, 
    Users, 
    DollarSign, 
    Calendar, 
    BarChart, 
    Lightbulb,
    ClipboardList,
    TrendingUp
  } from 'lucide-react';
  
  export const proposalSections: Section[] = [
    {
      id: "overview",
      title: "Project Overview",
      icon: <FileText className="h-5 w-5" />,
      description: "Provide a comprehensive overview of your project",
      fields: [
        {
          id: "projectTitle",
          label: "Project Title",
          type: "text",
          required: true,
          tooltip: "Choose a clear, descriptive title for your project",
          validation: (value) =>
            value.length < 5 ? "Title must be at least 5 characters" : null,
        },
        {
          id: "projectType",
          label: "Project Type",
          type: "select",
          options: [
            "Research",
            "Community Development",
            "Education",
            "Healthcare",
            "Infrastructure",
            "Technology",
            "Environmental",
            "Arts and Culture",
            "Social Services",
            "Other",
          ],
          required: true,
        },
        {
          id: "organizationType",
          label: "Organization Type",
          type: "select",
          options: [
            "Nonprofit",
            "Educational Institution",
            "Government Agency",
            "Research Institution",
            "Community Organization",
            "Other",
          ],
          required: true,
        },
        {
          id: "summary",
          label: "Executive Summary",
          type: "textarea",
          required: true,
          placeholder: "Provide a brief summary of your project...",
          tooltip: "Summarize your project in 2-3 paragraphs",
        }
      ],
      tips: [
        "Keep your title clear and specific",
        "Focus on the main problem you're addressing",
        "Highlight the unique aspects of your approach",
        "Include your project's potential impact",
      ]
    },
    {
      id: "need",
      title: "Statement of Need",
      icon: <Target className="h-5 w-5" />,
      description: "Explain why this project is necessary and the problem it addresses",
      fields: [
        {
          id: "problemStatement",
          label: "Problem Statement",
          type: "textarea",
          required: true,
          placeholder: "Describe the problem or need your project addresses...",
        },
        {
          id: "targetPopulation",
          label: "Target Population",
          type: "textarea",
          required: true,
          placeholder: "Describe who will benefit from this project...",
        },
        {
          id: "evidenceOfNeed",
          label: "Evidence of Need",
          type: "textarea",
          required: true,
          placeholder: "Provide data and research supporting the need...",
        }
      ],
      tips: [
        "Use current statistics and research",
        "Make a compelling case for urgency",
        "Be specific about who is affected",
        "Connect to larger community impact",
      ]
    },
    {
      id: "goals",
      title: "Goals and Objectives",
      icon: <TrendingUp className="h-5 w-5" />,
      description: "Define your project's specific goals and measurable objectives",
      fields: [
        {
          id: "projectGoal",
          label: "Overall Project Goal",
          type: "textarea",
          required: true,
          placeholder: "State the main goal of your project...",
        },
        {
          id: "specificObjectives",
          label: "Specific Objectives",
          type: "textarea",
          required: true,
          placeholder: "List 3-5 specific, measurable objectives...",
        },
        {
          id: "outcomes",
          label: "Expected Outcomes",
          type: "textarea",
          required: true,
          placeholder: "Describe the expected outcomes and impact...",
        }
      ],
      tips: [
        "Make objectives SMART (Specific, Measurable, Achievable, Relevant, Time-bound)",
        "Include both short-term and long-term outcomes",
        "Be realistic about what you can achieve",
        "Connect objectives to your needs statement",
      ]
    },
    {
      id: "methodology",
      title: "Methodology",
      icon: <ClipboardList className="h-5 w-5" />,
      description: "Describe how you will implement your project",
      fields: [
        {
          id: "projectApproach",
          label: "Project Approach",
          type: "textarea",
          required: true,
          placeholder: "Describe your approach and methods...",
        },
        {
          id: "timeline",
          label: "Project Timeline",
          type: "textarea",
          required: true,
          placeholder: "Provide a detailed timeline of activities...",
        },
        {
          id: "staffing",
          label: "Staffing Plan",
          type: "textarea",
          required: true,
          placeholder: "Describe the team and their roles...",
        }
      ],
      tips: [
        "Be specific about your methods",
        "Include a realistic timeline",
        "Describe staff qualifications",
        "Address potential challenges",
      ]
    },
    {
      id: "evaluation",
      title: "Evaluation Plan",
      icon: <BarChart className="h-5 w-5" />,
      description: "Explain how you will measure success",
      fields: [
        {
          id: "evaluationMethods",
          label: "Evaluation Methods",
          type: "textarea",
          required: true,
          placeholder: "Describe how you will measure outcomes...",
        },
        {
          id: "successMetrics",
          label: "Success Metrics",
          type: "textarea",
          required: true,
          placeholder: "List specific metrics and indicators...",
        },
        {
          id: "dataCollection",
          label: "Data Collection Plan",
          type: "textarea",
          required: true,
          placeholder: "Explain how you will collect and analyze data...",
        }
      ],
      tips: [
        "Include both quantitative and qualitative measures",
        "Explain how data will be collected",
        "Describe how results will be used",
        "Connect metrics to objectives",
      ]
    },
    {
      id: "budget",
      title: "Budget",
      icon: <DollarSign className="h-5 w-5" />,
      description: "Provide detailed budget information",
      fields: [
        {
          id: "totalRequest",
          label: "Total Amount Requested",
          type: "number",
          required: true,
          tooltip: "Enter the total funding amount you're requesting",
        },
        {
          id: "budgetBreakdown",
          label: "Budget Breakdown",
          type: "textarea",
          required: true,
          placeholder: "Provide a detailed breakdown of costs...",
        },
        {
          id: "budgetJustification",
          label: "Budget Justification",
          type: "textarea",
          required: true,
          placeholder: "Explain why each cost is necessary...",
        }
      ],
      tips: [
        "Be specific about each cost",
        "Justify all expenses",
        "Include any matching funds",
        "Consider long-term sustainability",
      ]
    },
    {
      id: "sustainability",
      title: "Sustainability Plan",
      icon: <Lightbulb className="h-5 w-5" />,
      description: "Explain how the project will continue beyond the grant period",
      fields: [
        {
          id: "futureOperations",
          label: "Future Operations",
          type: "textarea",
          required: true,
          placeholder: "Describe how the project will continue...",
        },
        {
          id: "futureFunding",
          label: "Future Funding",
          type: "textarea",
          required: true,
          placeholder: "Explain plans for future funding sources...",
        }
      ],
      tips: [
        "Describe long-term funding plans",
        "Include community support",
        "Explain capacity building",
        "Consider partnerships",
      ]
    }
  ];