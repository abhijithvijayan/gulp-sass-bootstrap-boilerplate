// js code
document.getElementById("js-btn").addEventListener("click", () => {
  alert("Warning");
});
// es6 code
const hello = name => {
  return `hello ${name}`;
};

// jquery code
$(document).ready(function() {
  $("#jquery-btn").click(function() {
    alert("The button was clicked.");
  });
});
