<template>
  <section class="card bg-light mx-1 my-2">
    <header class="card-header note-title-row">
      <span @dblclick="edit()">{{ note.title }}&nbsp;</span>
      <button
        class="btn-small btn-danger"
        @click="remove()"
      ><i class="fa fa-trash"></i></button>
      <button
        class="btn-small btn-warning"
        @click="edit()"
      ><i class="fa fa-edit"></i></button>
      <button
        class="btn-small btn-primary"
        @click="archive()"
      ><i class="fas fa-archive"></i></button>
      <button
        class="btn-small btn-primary"
        @click="pin()"
      ><i class="fas fa-bookmark"></i></button>
    </header>
    <section class="card-body p-2 m-0">
      <vue-markdown :source="note.content"></vue-markdown>
    </section>
    <footer class="card-footer p-2">

      <div class="footer-tagline">
        <i class="fa fa-tags"></i>
        <ul class="tags">
          <li
            v-for="tag in note.tags"
            :key="tag"
            class="tag"
          >{{tag}}</li>
        </ul>
      </div>
      <i class="fa fa-folder"></i> {{note.category ? note.category.title : "Unassigned"}}
    </footer>
  </section>

</template>

<script>
export default {
  props: ['note'],
  computed: {
  },
  methods: {
    edit() {
      this.$emit('editNote');
    },
    remove() {
      this.$emit('removeNote');
    },
    pin() {
      this.$emit('pinNote');
    },
    archive() {
      this.$emit('archiveNote');
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
@import "../../scss/_tag-input.scss";
header {
  &.note-title-row {
    display: flex;
    overflow: hidden;
    align-items: center;
    justify-items: center;
    padding: 2px 8px !important;
    span {
      flex-grow: 1;
      font-size: 14pt;
    }
    button {
      margin: 0 0.125em;
      width: 28px;
      height: 28px;
    }
  }
}

footer {
  .footer-tagline {
    display: flex;
    overflow: hidden;
    align-items: center;
    justify-items: center;
    padding: 0 4px;
    // border: 1px solid $gray-600;
  }
}
</style>
