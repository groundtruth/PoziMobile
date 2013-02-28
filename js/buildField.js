define(["mustache"], function(Mustache) {
    return function(fieldDef) {
        var template = '\
            <div data-role="fieldcontain">\
                <label for="{{ id }}" class="select">{{ description }}:</label>\
                <select name="{{ id }}" id="{{ id }}">\
                    {{ #options }}\
                    <option value="{{ value }}">{{ label }}</option>\
                    {{ /options }}\
                </select>\
            </div>\
        ';
        return Mustache.render(template, fieldDef);
    };
});

