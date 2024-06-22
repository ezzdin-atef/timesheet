import vacationJson from "@/data/vacation.json";

export type VacationType = "annual" | "sick" | "unpaid" | "holiday";

export interface VacationList {
  id: string;
  type: VacationType;
  date: Date;
}

export async function getVacation() {
  return vacationJson.map((el) => ({
    ...el,
    date: new Date(el.date),
  })) as VacationList[];
}

export async function addVacation(data: Omit<VacationList, "id">) {
  return data;
}

export async function updateVacation(data: VacationList) {
  return data;
}
