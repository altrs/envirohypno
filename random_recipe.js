 document.addEventListener('DOMContentLoaded', function() {
    var gen = document.getElementById('generator');
    var randText = document.getElementById('random');
    var lines = [];

    fetch('recipes.txt')
      .then(response => response.text())
      .then(text => {
        lines = text.split(/\r?\n/);
      })
      .catch(error => console.error(error));

    gen.onclick = function() {
      var selectedLines = '';
      for (var i = 0; i < 5; i++) {
        var randomIndex = Math.floor(Math.random() * lines.length);
        selectedLines += lines[randomIndex] + '\n';
      }
      randText.textContent = selectedLines;
    };
  });