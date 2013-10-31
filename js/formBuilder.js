define(["underscore", "jquery", "mustache"], function(_, $, Mustache) {

    return {

        repopulateForm: function($scope, data) {
            // http://blog.mrnepal.com/2012/03/21/use-jquery-to-re-populate-form-with-json-data/
            $.each(data, function(name, val){
                var $el = $scope.find('[name="'+name+'"]');

                if ($el.is("input:checkbox")) {

                    $el.attr("checked", "input:checked");

                } else if ($el.is("input:radio")) {

                    $el.filter('[value="'+val+'"]').attr("checked", "checked");

                } else if ($el.is("select")) {

                    var existingValues = _($el.find("option")).map(function(option) { return option.value; });
                    if (! _(existingValues).contains(val)) {
                        $el.append('<option value="'+val+'">'+val+'</option>');
                    }
                    $el.val(val);

                } else {
                    $el.val(val);

                }

            });
        },

        buildField: function(fieldDef) {
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

                case "number":
                    if (!fieldDef.step) { fieldDef.step = 1; }
                    template = '\
                        <div data-role="fieldcontain">\
                            <label for="{{ id }}">{{ description }}:</label>\
                            <input type="number" name="{{ id }}" id="{{ id }}"\
                                 {{#min}}min="{{ min }}"{{/min}}\
                                 {{#max}}max="{{ max }}"{{/max}}\
                                 {{#step}}step="{{ step }}"{{/step}}\
                            >\
                        </div>\
                    ';
                    break;

                case "flip_switch":
                    template = '\
                        <div data-role="fieldcontain">\
                            <label for="{{ id }}">{{ description }}</label>\
                            <select name="{{ id }}" id="{{ id }}" data-role="slider">\
                                <option value="false">{{ off_label }}</option>\
                                <option value="true">{{ on_label }}</option>\
                            </select>\
                        </div>\
                    ';
                    break;

                case "hidden" :
                    template = '<input type="hidden" name="{{ id }}" id="{{ id }}" value="{{ value }}" />';
                    break;

                default: throw new Error("Invalid field type in form config.");
            }

            return Mustache.render(template, fieldDef);

        }

    };
});

