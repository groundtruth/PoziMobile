define(["mustache"], function(Mustache) {
    return function(fieldDef) {
        var template;

        switch (fieldDef.type) {

            case "select" :
                template = '\
                    <div data-role="fieldcontain">\
                        <label for="{{ id }}" class="select">{{ description }}:</label>\
                        <select name="{{ id }}" id="{{ id }}">\
                            {{ #options }}\
                            <option value="{{ value }}">{{ label }}</option>\
                            {{ /options }}\
                        </select>\
                    </div>\
                ';
                break;

            case "textarea" :
                template = '\
                    <div data-role="fieldcontain">\
                        <label for="{{ id }}">{{ description }}:</label>\
                        <textarea name="{{ id }}" id="{{ id }}"></textarea>\
                    </div>\
                ';
                break;

            case "hidden" :
                template = '<input type="hidden" name="{{ id }}" id="{{ id }}" value="{{ value }}" />';
                break;

            // default: throw new Error("Invalid field type in form config.");
        }
        return Mustache.render(template, fieldDef);
    };
});

