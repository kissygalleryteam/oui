KISSY.add(function() {
  return {
  "meta": {
    "baseTag": 'form',
    "tag": "searchform",
    "template-module": "components/SearchForm/template.mustache",
    "define1": [
      "input",
      "suggests"
    ]
  },
  "input": {
    "selector": "input[type=search]",
    "bind": {
      "click": "hideSuggests",
      "input": "showSuggests",
    }
  },
  "suggests": {
    "selector": "x-searchsuggests"
  }
}
});