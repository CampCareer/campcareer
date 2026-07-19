export type AuMajorCategoryHighlight = {
  demand: string
  salary: string
  outlook: string
}

// Category-level summaries derived from the reviewed AU major signals snapshot.
// Salary is the median of available representative-occupation medians, not a
// graduate starting salary. Outlook is the average available 2035 projection
// across the mapped study concepts. Refresh with the AU signals snapshot.
export const AU_MAJOR_CATEGORY_HIGHLIGHTS: Record<string, AuMajorCategoryHighlight> = {
  trades: {
    demand: "Licensed trade pathways with widespread shortage signals",
    salary: "Typical mapped pay A$91k",
    outlook: "2035 outlook +9%",
  },
  health: {
    demand: "Care, clinical and emergency pathways remain in demand",
    salary: "Typical mapped pay A$107k",
    outlook: "2035 outlook +29%",
  },
  technology: {
    demand: "Software, data and cyber skills support growing pathways",
    salary: "Typical mapped pay A$134k",
    outlook: "2035 outlook +26%",
  },
  engineering: {
    demand: "Infrastructure, manufacturing and resources drive demand",
    salary: "Typical mapped pay A$135k",
    outlook: "2035 outlook +19%",
  },
  business: {
    demand: "Broad professional pathways across every major sector",
    salary: "Typical mapped pay A$120k",
    outlook: "2035 outlook +22%",
  },
  education: {
    demand: "Teaching and community-service roles show strong shortage signals",
    salary: "Typical mapped pay A$117k",
    outlook: "2035 outlook +13%",
  },
  environment: {
    demand: "Sustainability, food and animal-health pathways are expanding",
    salary: "Typical mapped pay A$109k",
    outlook: "2035 outlook +19%",
  },
  design: {
    demand: "Built-environment and creative pathways reward strong portfolios",
    salary: "Typical mapped pay A$132k",
    outlook: "2035 outlook +21%",
  },
  hospitality: {
    demand: "Service and culinary roles offer practical entry pathways",
    salary: "Typical mapped pay A$78k",
    outlook: "2035 outlook +6%",
  },
  transport: {
    demand: "Automotive, aviation and maritime skills support essential networks",
    salary: "Typical mapped pay A$122k",
    outlook: "2035 outlook +14%",
  },
}
