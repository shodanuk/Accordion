// TODO:
//
// Add auto close mode. Ie. only one slide open at a time, other automatically close.
//
// Clean up code, break down into smaller methods
//
// Configurable class names / markup

Accordion = Class.create({
  initialize : function(element, options) {
    this.element = $(element);
    //this.prevPanelHeight = 0;
    this.options = Object.extend({
      fxDuration : .4,
      transition : 'sinusoidal'
    }, options||{});
    this.build();
  },

  build : function() {
    this.contentHeights = [];
    this.panels = this.element.select('li.panel');
    this.panels.each(function(el, idx) {
      var content = el.down('div.acc-bd');
      this.contentHeights[idx] = parseInt(content.getStyle('height'), 10);
      content.setStyle({
        overflow : 'hidden',
        height : 0
      }).hide();
    }, this);

    this.panels[0].addClassName('open');
    var content = this.panels[0].down('div.acc-bd');

    content.setStyle({
      height: this.contentHeights[0]+'px'
    }).show();

    this.headers = this.element.select('.acc-hd');
    this.headers.each(function(el, idx) {
      el.observe('click', function(e) {

        var panel = this.panels[idx];
        var content = panel.down('div.acc-bd');
        var height = this.contentHeights[idx];

        if(panel.hasClassName('open')){
          var fx = new S2.FX.Morph(content, {
            style : 'height : 0',
            after : function(){
              content.hide();
              panel.removeClassName('open');
            },
            before : function(){
              document.fire('accordion:open', {
                el : this.element,
                value : -height
              });
            }.bind(this),
            position : 'parallel'
          });

        }else{
          var fx = new S2.FX.Morph(content, {
            style : 'height : '+this.contentHeights[idx]+'px',
            after : function(){
              panel.addClassName('open');
            },
            before : function(){
              content.show();
              document.fire('accordion:open', {
                el : this.element,
                value : height
              });
            }.bind(this),
            position : 'parallel'
          });
        }

        fx.play();
      }.bindAsEventListener(this));
    }, this);
  },

  slide : function(element, height, options){
    Object.extend(options, {
      style : 'height:'+height,
      transition : this.options.transition
    })

    return new S2.FX.Morph(element, options);
  }
});