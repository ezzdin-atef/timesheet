import { db } from "@/config/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { getProjects } from "./projects";

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
  try {
    const workItemsList: WorkItemsList[] = [];

    const querySnapshot = await getDocs(collection(db, "work-items"));
    const projects = await getProjects();

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const project = projects.data.find(
        (project) => project.id === data.projectID
      );

      if (!project) return;

      workItemsList.push({
        id: doc.id,
        taskDescription: data.taskDescription,
        date: new Date(data.date.toDate()),
        assignedBy: data.assignedBy,
        duration: data.duration,
        projectName: project.name,
        projectCode: project.code,
        projectDF: project.df,
        projectID: project.id,
      });
    });

    return {
      status: 1,
      data: workItemsList,
    };
  } catch (error) {
    return {
      status: 0,
      message: error,
      data: [],
    };
  }
}

export async function addWorkItem(
  data: Omit<WorkItemsList, "id" | "projectName" | "projectCode" | "projectDF">
) {
  try {
    await addDoc(collection(db, "work-items"), data);
    return {
      status: 1,
    };
  } catch (error) {
    return {
      status: 0,
      message: error,
    };
  }
}

export async function updateWorkItem(
  data: Omit<WorkItemsList, "projectName" | "projectCode" | "projectDF">
) {
  try {
    await updateDoc(doc(db, "work-items", data.id), {
      taskDescription: data.taskDescription,
      date: data.date,
      assignedBy: data.assignedBy,
      duration: data.duration,
      projectID: data.projectID,
    });
    return {
      status: 1,
    };
  } catch (error) {
    return {
      status: 0,
      message: error,
    };
  }
}

export async function deleteWorkItem(id: string) {
  try {
    const docRef = doc(db, "work-items", id);
    await deleteDoc(docRef);

    return {
      status: 1,
    };
  } catch (error) {
    return {
      status: 0,
      message: error,
    };
  }
}
