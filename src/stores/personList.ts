import { ref } from "vue";
import { defineStore } from "pinia";

// 定义人员列表
const usePersonList = defineStore({
  id: "personList",
  state: () => ({
    personList: ref([]) as unknown as Record<string, any>[],
  }),
  getters: {
    getPersonList: (state) => {
      return state.personList;
    },
  },
  actions: {
    setPersonList(personList: Record<string, any>[]) {
      this.personList = personList;
    },
  },
});

export default usePersonList;
