module.exports = {
  root: true,
  extends: [
    <% if (config) { _%>'<%- JSON.stringify(config) %>',<%_ } %>
  ],
};
