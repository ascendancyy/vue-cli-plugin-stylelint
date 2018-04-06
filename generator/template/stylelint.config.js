module.exports = {
  root: true,
  extends: [
    <% if (config) { _%>'<%- config %>',<%_ } %>
  ],
};
