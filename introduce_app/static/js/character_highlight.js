$(document).ready(function() {
  $('.banner-text p').on('mouseover', function(event) {
    var text = $(this).text();
    var characterIndex = getCharacterIndex(event, this);

    var highlightedText = insertHighlightSpan(text, characterIndex);

    $(this).html(highlightedText);
  });

  $('.banner-text p').on('mouseout', function() {
    $(this).find('.highlight').contents().unwrap();
  });
});

function getCharacterIndex(event, element) {
  var textContent = $(element).text();
  var range = document.createRange();
  var textNode = element.firstChild;

  var len = textContent.length;
  for (var i = 0; i < len; i++) {
    range.setStart(textNode, i);
    range.setEnd(textNode, i + 1);
    var rect = range.getBoundingClientRect();
    if (event.clientX <= rect.right && event.clientY <= rect.bottom) {
      return i;
    }
  }
  return len;
}

function insertHighlightSpan(text, index) {
  var highlightedText = text.substring(0, index) +
    '<span class="highlight">' + text.charAt(index) + '</span>' +
    text.substring(index + 1);
  return highlightedText;
}
