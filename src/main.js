// js code
document.getElementById("js-btn").addEventListener("click", () => {
  alert("JS compiles!!");
});
// es6 code
const hello = name => {
  return `hello ${name}`;
};

// jquery code
$(document).ready(function() {
  $("#jquery-btn").click(function() {
    alert("jQuery Works.");
  });
});