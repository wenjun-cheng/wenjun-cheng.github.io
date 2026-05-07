import type { SectionId } from "../components/react/ThreeWorld";

export const identity = {
  name: "Wenjun Cheng",
  email: "wenjun.cheng.10@gmail.com",
  github: "https://github.com/wenjun-cheng",
  resume: "/resume.pdf",
  portrait: "/portrait.jpg",
} as const;

export const strings = {
  eyebrow: "Senior · University of Michigan\n& Shanghai Jiao Tong University",
  intro: "I build spatial AI systems for robots.",
  enter: "Enter",
  skills: "Skills",
  loading: "Loading GitHub projects...",
  githubFallback: "View projects on GitHub",
  githubFailed: "GitHub unreachable — view projects directly",
  aboutParagraphs: [
    "I am pursuing dual degrees in Robotics Engineering at the University of Michigan and Electrical & Computer Engineering at Shanghai Jiao Tong University. My work sits at the intersection of spatial AI, embodied perception, and robot coordination.",
    "I am currently building open-vocabulary multi-robot systems at UMich's Scalable Spatial Intelligence Lab and studying vision-language models for sensorimotor reasoning at the CAR Lab.",
  ],
  sectionMeta: {
    about: { title: "Wenjun Cheng" },
    research: { title: "Research" },
    projects: { title: "Projects" },
    fun: { title: "Fun" },
  } satisfies Record<SectionId, { title: string }>,
  pavilions: { research: "Research", projects: "Projects", fun: "Fun", intro: "Intro" },
};

export const skills: string[] = [
  "C++",
  "Python",
  "MATLAB",
  "Verilog",
  "ROS 2",
  "Isaac Sim",
  "Habitat",
  "SLAM",
  "VLM/VLN",
  "Docker",
  "SolidWorks",
  "Git/Linux",
];
