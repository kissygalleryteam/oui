KISSY.add(function() {
  return {
  "meta": {
    "tag": "multipleinput",
    "template-module": "components/multiple-input/template.mustache",
    "define1": ["defaultInput", "lastItem"],
    "define": ["addButton", "removeButton", "items"],
    "options": ["maxCount", "required"]
  },
  "defaultInput": {
  	"selector": "input"
  },
  "addButton": {
  	"selector": ".x-multipleinput-add-button",
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
  	"selector": ".x-multipleinput-remove-button",
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
  },
  "required": {
    "defalutValue": -1,
    "attribute": true
  }
}
});