import io from '@/services/io';
import common from '@/store/_common';

class Filter {
  constructor() {
    this.all = (items) => items.filter(item => !item.is_archived);
    this.active = (items) => items.filter(item => !item.is_completed && !item.is_archived);
    this.completed = (items) => items.filter(item => item.is_completed && !item.is_archived);
  }

  _category(items, categoryId) {
    if (categoryId === 'all') {
      return items;
    } else if (categoryId === 'unassigned') {
      return items.filter(item => !item.category);
    } else {
      return items.filter(item => item.category && item.category.id == categoryId);
    }
  };

  _milestone(items, milestoneId) {
    return items;
  };

  _all(items, milestoneId, categoryId) { return this._category(this._milestone(items, milestoneId), categoryId); }
};

var filters = new Filter();

export default {
  namespaced: true,

  state: {
    items: [],
    editingItem: null,
    beforeEditCache: "",
    visibility: "all",
    filteredItems: [],
    categoryFilter: 'all',
    milesonteFilter: 'all',
    isLoading: false
  },

  getters: {
    filtered: state => filters[state.visibility](state.filteredItems),
    remaining: state => filters.active(state.filteredItems).length,
    archived: state => state.filteredItems.filter(item => item.is_archived),
  },

  mutations: {
    ...common.mutations,

    show(state, filterName) {
      if (filters.hasOwnProperty(filterName)) { state.visibility = filterName; }
    },

    updateFilteredItems(state) {
      state.filteredItems = filters._all(
        state.items, state.milesonteFilter, state.categoryFilter
      )
    }
  },

  actions: {

    async fetchAll({ commit, dispatch }) {
      commit("fetchStart");
      const items = await io.tasks.fetchAll().catch(error => dispatch('UI/pushIOError', error, { root: true }));
      if (items) {
        commit("clear");
        commit("putAll", items);
      }
      commit("fetchEnd");
    },

    updateFilters({ state, commit }, { categoryId, milestoneId }) {
      commit("set", { property: "categoryFilter", value: categoryId });
      commit("set", { property: "milesonteFilter", value: milestoneId });
      commit("updateFilteredItems");
    },

    async addNew({ commit, dispatch }, value) {
      value.title = value.title && value.title.trim();
      if (!value.title) {
        return;
      }
      const item = await io.tasks.add({
        title: value.title,
        is_completed: false,
        category: value.category
      }).catch(error => dispatch('UI/pushIOError', error, { root: true }));
      if (!item) return;
      commit("put", item);
      commit("updateFilteredItems");

    },

    async toggleCompleted({ commit, dispatch }, item) {
      if (!item) {
        return;
      }
      item.is_completed = !item.is_completed;
      const edited = await io.tasks.edit(item).catch(error => dispatch('UI/pushIOError', error, { root: true }));
      if (!edited) return;
      commit("edit", edited);
      commit("updateFilteredItems");

    },

    startEdit({ dispatch, state }, item) {
      state.beforeEditCache = item.title;
      state.editingItem = item;
    },

    async doneEdit({ commit, state }, item) {
      if (!state.editingItem) {
        return;
      }

      if (item.title.trim() == state.beforeEditCache) {
        state.editingItem = null;
        return;
      }

      item.title = item.title.trim();
      // Remove when we've deleted the title and committed
      if (!item.title) {
        await io.tasks.remove(item).catch(error => dispatch('UI/pushIOError', error, { root: true }));
        commit("remove", item); // this will update filters anyway
      } else {
        // Save otherwise
        const edited = await io.tasks.edit(item).catch(error => dispatch('UI/pushIOError', error, { root: true }));
        if (!edited) return;
        commit("edit", edited);
        commit("updateFilteredItems");
      }
      state.editingItem = null;
    },

    cancelEdit({ dispatch, state }, item) {
      item.title = this.beforeEditCache;
      state.editingItem = null;
      this.beforeEditCache = "";
    },

    async remove({ commit }, item) {
      await io.tasks.remove(item).catch(error => dispatch('UI/pushIOError', error, { root: true }));
      commit("rm", item);
      commit("updateFilteredItems");
    },

    async toggleArchive({ commit, dispatch }, item) {
      item.is_archived = !item.is_archived;
      // completed && archived -> not completed && not archived
      item.is_completed = !item.is_archived ? false : item.is_completed;
      const edited = await io.tasks.edit(item).catch(error => dispatch('UI/pushIOError', error, { root: true }));
      if (!edited)
        return;
      commit("edit", edited);
    },

    archiveCompleted({ commit, dispatch, state }) {
      state.items.forEach(async element => {
        if (element.is_completed) {
          element.is_archived = true;
          const edited = await io.tasks.edit(element).catch(error => dispatch('UI/pushIOError', error, { root: true }));
          if (!edited) return;
          commit("edit", edited);
        }
      });
    },

    setAllDone({ commit, dispatch, state }) {
      state.items.forEach(async element => {
        if (!element.is_completed) {
          element.is_completed = true;
          const edited = await io.tasks.edit(element).catch(error => dispatch('UI/pushIOError', error, { root: true }));
          if (!edited) return;
          commit("edit", edited);
        }
      });
    }

  }

}
