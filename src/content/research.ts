export interface ResearchEntry {
  id: string;
  lab: string;
  institution: string;
  location: string;
  role: string;
  period: string;
  summary: string;
  tags?: string[];
  link?: string;
}

export const research: ResearchEntry[] = [
  {
    id: "ssil",
    lab: "Scalable Spatial Intelligence Laboratory",
    institution: "University of Michigan",
    location: "Ann Arbor, USA",
    role: "Undergraduate Researcher",
    period: "Feb 2026 - Present",
    summary:
      "Building open-vocabulary multi-robot spatial representation and coordination in Isaac Sim. Exploring zero-shot semantic capability-task binding across heterogeneous robot teams.",
  },
  {
    id: "carl",
    lab: "Computational Autonomy and Robotics Laboratory",
    institution: "University of Michigan",
    location: "Ann Arbor, USA",
    role: "Undergraduate Researcher",
    period: "Oct 2025 - Present",
    summary:
      "Designed a diagnostic benchmark to evaluate VLMs' sensorimotor mapping. Developing a Vision-and-Language Navigation framework with scene graph generation and semantic world models.",
  },
  {
    id: "fda",
    lab: "Flow Diagnostics and Analysis Lab",
    institution: "Shanghai Jiao Tong University",
    location: "Shanghai, China",
    role: "Undergraduate Researcher",
    period: "Apr 2024 - Aug 2025",
    summary:
      "Engineered a high-fidelity fluid-structure interaction platform, adopted as the lab's standard setup. Integrated high-speed vision with piezoelectric sensors for synchronized micro-impact analysis.",
  },
  {
    id: "tsinghua",
    lab: "Shenzhen International Graduate School",
    institution: "Tsinghua University",
    location: "Shenzhen, China",
    role: "Research Intern",
    period: "Dec 2023 - Feb 2024",
    summary:
      "Identified bottlenecks in edge-deployed active perception for UAVs. Contributed to a hybrid exploration algorithm and validated it on physical platforms.",
  },
];
