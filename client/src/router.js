import Vue from 'vue'
import Router from 'vue-router'
import Todos from '@/components/Todos'
import Notes from '@/components/Notes'

Vue.use(Router)

// We'll need to put this into /router/*
// and slpit to separate files as we grow

export default new Router({
  routes: [
    {
      path: '/tasks',
      name: 'Todos',
      component: Todos
    },
    {
      path: '/',
      name: 'Notes',
      component: Notes
    }
  ]
})