import { db } from "@/config/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

export type VacationType = "annual" | "sick" | "unpaid" | "holiday";

export interface VacationList {
  id: string;
  type: VacationType;
  date: Date;
}

export async function getVacation() {
  try {
    const vacationList: VacationList[] = [];
    const querySnapshot = await getDocs(collection(db, "vacation"));

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      vacationList.push({
        id: doc.id,
        type: data.type,
        date: new Date(data.date.toDate()),
      });
    });

    return {
      status: 1,
      data: vacationList,
    };
  } catch (error) {
    return {
      status: 0,
      message: error,
      data: [],
    };
  }
}

export async function addVacation(data: Omit<VacationList, "id">) {
  try {
    await addDoc(collection(db, "vacation"), data);
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

export async function updateVacation(data: VacationList) {
  try {
    await updateDoc(doc(db, "vacation", data.id), {
      type: data.type,
      date: data.date,
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

export async function deleteVacation(id: string) {
  try {
    await deleteDoc(doc(db, "vacation", id));
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
