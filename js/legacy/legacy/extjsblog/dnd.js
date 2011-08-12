Ext.onReady(function() {
    Ext.QuickTips.init();
    // A list of method overrides
var overrides = {
    // Only called when element is dragged over the a dropzone with the same ddgroup
    onDragEnter : function(evtObj, targetElId) {
        // Colorize the drag target if the drag node's parent is not the same as the drop target
        if (targetElId != this.el.dom.parentNode.id) {
            this.el.addClass('dropOK');
        }
        else {
            // Remove the invitation
            this.onDragOut();
        }
    },
    // Only called when element is dragged out of a dropzone with the same ddgroup
    onDragOut : function(evtObj, targetElId) {
        this.el.removeClass('dropOK');
    },
    //Called when mousedown for a specific amount of time
    b4StartDrag : function() {
        if (!this.el) {
            this.el = Ext.get(this.getEl());
        }
        //this.el.highlight();
        //Cache the original XY Coordinates of the element, we'll use this later.
        this.originalXY = this.el.getXY();
    },
    // Called when element is dropped not anything other than a
    // dropzone with the same ddgroup
    onInvalidDrop : function() {
        this.invalidDrop = true;

    },
    endDrag : function() {
        if (this.invalidDrop === true) {
            this.el.removeClass('dropOK');

            var animCfgObj = {
                easing   : 'elasticOut',
                duration : 1,
                scope    : this,
                callback : function() {
                    this.el.dom.style.position = '';
                }
            };
            this.el.moveTo(this.originalXY[0], this.originalXY[1], animCfgObj);
            delete this.invalidDrop;
        }

    },
    // Called upon successful drop of an element on a DDTarget with the same
    onDragDrop : function(evtObj, targetElId) {
        // Wrap the drop target element with Ext.Element
        var dropEl = Ext.get(targetElId);

        // Perform the node move only if the drag element's parent is not the same as the drop target
        if (this.el.dom.parentNode.id != targetElId) {

            // Move the element
            dropEl.appendChild(this.el);

            // Remove the drag invitation
            this.onDragOut(evtObj, targetElId);

            // Clear the styles
            this.el.dom.style.position ='';
            this.el.dom.style.top = '';
            this.el.dom.style.left = '';
        }
        else {
            // This was an invalid drop, lets call onInvalidDrop to initiate a repair
            this.onInvalidDrop();
        }
    }
};

// Configure the cars to be draggable
var carElements = Ext.get('cars').select('div');
Ext.each(carElements.elements, function(el) {
    var dd = new Ext.dd.DD(el, 'carsDDGroup', {
        isTarget  : false
    });
    Ext.apply(dd, overrides);
});

var truckElements = Ext.get('trucks').select('div');
Ext.each(truckElements.elements, function(el) {
    var dd = new Ext.dd.DD(el, 'trucksDDGroup', {
        isTarget  : false
    });
    Ext.apply(dd, overrides);
});

//Instantiate instances of Ext.dd.DDTarget for the cars and trucks container
var carsDDTarget    = new Ext.dd.DDTarget('cars','carsDDGroup');
var trucksDDTarget = new Ext.dd.DDTarget('trucks', 'trucksDDGroup');

//Instantiate instnaces of DDTarget for the rented and repair drop target elements
var rentedDDTarget = new Ext.dd.DDTarget('rented', 'carsDDGroup');
var repairDDTarget = new Ext.dd.DDTarget('repair', 'carsDDGroup');

//Ensure that the rented and repair DDTargets will participate in the trucksDDGroup
rentedDDTarget.addToGroup('trucksDDGroup');
repairDDTarget.addToGroup('trucksDDGroup');


});