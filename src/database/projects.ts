import { db } from "@/config/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

export interface ProjectsList {
  id: string;
  name: string;
  code: string;
  description: string;
  df: string;
}

export async function getProjects() {
  try {
    const projectsList: ProjectsList[] = [];

    const querySnapshot = await getDocs(collection(db, "projects"));

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      projectsList.push({
        id: doc.id,
        name: data.name,
        code: data.code,
        description: data.description,
        df: data.df,
      });
    });

    return {
      status: 1,
      data: projectsList,
    };
  } catch (error) {
    return {
      status: 0,
      message: error,
      data: [],
    };
  }
}

export async function addProject(data: Omit<ProjectsList, "id">) {
  try {
    await addDoc(collection(db, "projects"), data);
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

export async function updateProject(data: ProjectsList) {
  try {
    await updateDoc(doc(db, "projects", data.id), {
      name: data.name,
      code: data.code,
      description: data.description,
      df: data.df,
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

export async function deleteProject(id: string) {
  try {
    const docRef = doc(db, "projects", id);
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
