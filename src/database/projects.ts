import projectsJson from "@/data/projects.json";

export interface ProjectsList {
  id: string;
  name: string;
  code: string;
  description: string;
  df: string;
}

export async function getProjects() {
  return projectsJson as ProjectsList[];
}

export async function addProject(data: Omit<ProjectsList, "id">) {
  return data;
}

export async function updateProject(data: ProjectsList) {
  return data;
}
