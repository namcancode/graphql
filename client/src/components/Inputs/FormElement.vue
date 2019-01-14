<template>
    <div :class="size" class="form-element">
        <label>{{title}}</label>
        <slot></slot>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  name: "form-element",
  props: {
    size: { type: String, default: "col-12" },
    title: String
  }
})
export default class FormElement extends Vue {}
</script>

<style lang="scss" scoped>
label {
  display: block;
}
.form-element {
  margin-top: 20px;
}
</style>
