<template>
  <div class="category">
    <button
      class="btn btn-secondary dropdown-toggle btn-raised"
      type="button"
      @click="dropdown()"
    >
      <i class="fa fa-folder"></i> {{category ? category.title : "Unassigned"}}
    </button>
    <nav
      v-if="showCategorySelector"
      class="selector"
    >
      <ul
        class="selector-group"
        @blur="close()"
      >
        <li class="selector-item zebra">
          <span @click="selected(null)">Unassigned</span>
        </li>
        <category-item
          v-for="(item, index) in categories"
          :key="index"
          v-on:itemSelected="selected"
          :model="item"
        />
      </ul>
    </nav>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import CategoryItem from './category-item.vue';

export default {
  name: "CategorySelector",

  props: {
    category: { type: Object, default: null }
  },

  components: {
    CategoryItem
  },

  created() {
    this.$store.dispatch("Categories/fetchAll");
  },

  data() {
    return {
      showCategorySelector: false
    };
  },

  computed: {
    ...mapState("Categories", { categories: "itemTree" }),
  },

  methods: {
    dropdown() {
      this.showCategorySelector = !this.showCategorySelector;
    },

    close() {
      this.showCategorySelector = false;

    },
    selected(category) {
      this.$emit("selected", category);
      this.showCategorySelector = false;
    }
  },

  updated() {
    // console.log('category', this.category, this.categories);
    // QnD hack for zebra stripes
    const zebraElements = [].slice.call(document.getElementsByClassName('zebra'));
    var counter = 0;
    zebraElements.forEach(element => {
      if (counter % 2 == 0) {
        element.className = element.className + " even";
      } else {
        element.className = element.className + " odd";
      }
      counter++;
    });
  }

}
</script>

<style lang="scss" scoped>
@import "../scss/__category_selector.scss";
</style>
