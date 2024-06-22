import projectsJson from "@/data/projects.json";
import workItemsJson from "@/data/work-item.json";

export type WorkItemDuration = 0 | 0.25 | 0.5 | 0.75 | 1;

export interface WorkItemsList {
  id: string;
  taskDescription: string;
  date: Date;
  assignedBy: string;
  duration: WorkItemDuration;
  projectName: string;
  projectCode: string;
  projectDF: string;
  projectID: string;
}

export async function getWorkItems() {
  const data = workItemsJson.map((item) => {
    const project = projectsJson.find(
      (project) => project.id === item.projectID
    );
    if (!project) {
      throw new Error(`Project with code ${item.projectID} not found`);
    }

    return {
      ...item,
      date: new Date(item.date),
      projectName: project.name,
      projectCode: project.code,
      projectDF: project.df,
    };
  });

  return data as WorkItemsList[];
}

export async function addWorkItem(
  data: Omit<WorkItemsList, "id" | "projectName" | "projectCode" | "projectDF">
) {
  return data;
}

export async function updateWorkItem(
  data: Omit<WorkItemsList, "projectName" | "projectCode" | "projectDF">
) {
  return data;
}
