KISSY.add(function() {
  return {
  "meta": {
    "tag": "searchsuggests",
    "define": [
      "options"
    ],
    "parent": [
      "form"
    ],
    "data": [
      "data"
    ],
    "options": [
      "suggestsMax",
      "suggestsKeyLoop",
      "dataType",
      "action",
      "method",
      "key"
    ]
  },
  "suggestsMax": 6,
  "suggestsKeyLoop": false,
  "action": {
    "attribute": true
  },
  "method": {
    "attribute": true
  },
  "key": {
    "attribute": true
  },
  "options": {
    "selector": ".pop-layer li, .pop-layer .view-more",
    "template-module": "components/SearchSuggests/options.mustache",
    "bind": {
      "mouseenter": "selectOption($target)"
    }
  },
  "form": {
    "selector": "form"
  },
  "data": {
    // "api": "http://localhost/json/suggests.json",
    // "method": "post",
    // "data": "q={{key}}",
    // "dataType": "json",
    "debounce": 500
  },
  "handleArrowKey": {
    // "keyCodes": [75, 74]
    "keyCodes": [38, 40]
  },
  "handleEnterKey": {
    "keyCodes": [
      13,
      108
    ]
  }
}
});