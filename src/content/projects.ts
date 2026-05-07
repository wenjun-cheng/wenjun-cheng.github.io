export interface ProjectEntry {
  id: string;
  title: string;
  period?: string;
  subtitle?: string;
  body: string;
  href?: string;
}

export const manualProjects: ProjectEntry[] = [
  {
    id: "raccoon",
    title: "RACCOON",
    period: "Winter 2026",
    subtitle: "Independent Project",
    body: "Research-as-code: search, take notes, and conduct deep analysis in the IDE, organizing information as files.",
    href: "https://github.com/wenjun-cheng/RACCOON",
  },
  {
    id: "teg-slam",
    title: "TEG-SLAM",
    period: "Winter 2026",
    subtitle: "Course Project · University of Michigan",
    body: "Temporal Evidence Guided Monocular Gaussian SLAM with memory-aware uncertainty filtering — extends monocular Gaussian SLAM by accumulating dynamic evidence across frames for robust tracking in scenes with moving objects.",
    href: "https://github.com/chloeqxq/Rob530-Group20-TEG-SLAM",
  },
  {
    id: "ecg",
    title: "ECG 3D Visualization",
    period: "Winter 2025",
    subtitle: "Internship · Edan Instruments",
    body: "Prototyped the company's first interactive 3D electrocardiographic diagnostic system, approved for production integration.",
  },
];
