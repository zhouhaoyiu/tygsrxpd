import { defineStore } from "pinia";

import type { Person } from "../types/domain";

// 定义人员列表
const usePersonList = defineStore("personList", {
  state: () => ({
    personList: [] as Person[],
  }),
  getters: {
    getPersonList: (state) => {
      return state.personList;
    },
  },
  actions: {
    setPersonList(personList: Person[]) {
      this.personList = personList;
    },
  },
});

export default usePersonList;
