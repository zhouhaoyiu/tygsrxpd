import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import usePersonList from "../stores/personList";

describe("person list store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("updates the exposed person list", () => {
    const store = usePersonList();
    const people = [{ personId: "1", personName: "Alice", personWx: "alice" }];

    store.setPersonList(people);

    expect(store.getPersonList).toEqual(people);
  });
});
