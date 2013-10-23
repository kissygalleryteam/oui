KISSY.add(function() {
  return {
  "meta": {
    "tag": "multipleinput",
    "template-module": "components/multiple-input/template.mustache",
    "define1": ["defaultInput", "lastItem"],
    "define": ["addButton", "removeButton", "items"],
    "options": ["maxCount"]
  },
  "defaultInput": {
  	"selector": "input"
  },
  "addButton": {
  	"selector": "button.add",
  	"bind": {
  		"click": "add"
  	}
  },
  "lastItem": {
  	"selector": ".item:last-child input",
  	"bind": {
  		"keypress": "handleAdd($event), handleRemove($event)"
  	}
  },
  "removeButton": {
  	"selector": "button.remove",
  	"bind": {
  		"click": "remove($target)"
  	}
  },
  "items": {
  	"selector": "input"
  },
  "maxCount": {
  	"defaultValue": -1,
  	"attribute": true
  }
}
});