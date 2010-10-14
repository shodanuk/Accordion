document.observe("dom:loaded", function() {
  $$('.accordion').each(function(el) {
    new Accordion(el);
  });
});