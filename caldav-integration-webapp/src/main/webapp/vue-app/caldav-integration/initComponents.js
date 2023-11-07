const components = {
};

for (const key in components) {
  Vue.component(key, components[key]);
}