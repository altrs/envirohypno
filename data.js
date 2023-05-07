window.onload = function() {

  var inputElement = document.getElementById('input-text');
  var saveButton = document.getElementById('save-button');


  saveButton.addEventListener('click', function() {
    var textValue = inputElement.value;
    localStorage.setItem('textValue', textValue);

    var savedTextDiv = document.createElement('div');
    var savedText = document.createTextNode(textValue);
    savedTextDiv.appendChild(savedText);
    document.body.appendChild(savedTextDiv);

    savedTextDiv.style.padding = '10px';
    savedTextDiv.style.border = '1px solid';
    savedTextDiv.style.marginBottom = '10px';
    savedTextDiv.style.fontSize = '12px';
    savedTextDiv.style.width = '400px';
    savedTextDiv.style.margin = '20px auto';


    inputElement.value = '';

  });

  // check if text has been saved previously
  if (localStorage.getItem('textValue')) {
    var savedText = localStorage.getItem('textValue');
    var savedTextDiv = document.createElement('div');
    var savedText = document.createTextNode(savedText);

    savedTextDiv.style.padding = '10px';
    savedTextDiv.style.border = '1px solid';
    savedTextDiv.style.marginBottom = '10px';
    savedTextDiv.style.fontSize = '12px';
    savedTextDiv.style.width = '400px';
    savedTextDiv.style.margin = '20px auto';

    savedTextDiv.appendChild(savedText);
    document.body.appendChild(savedTextDiv);
  }
};