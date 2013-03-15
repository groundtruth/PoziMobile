define(["jquery", "mustache"], function($, Mustache) {

    return {

        repopulateForm: function($scope, data) {
            // http://blog.mrnepal.com/2012/03/21/use-jquery-to-re-populate-form-with-json-data/
            $.each(data, function(name, val){
                var $el = $scope.find('[name="'+name+'"]');
                switch($el.attr("type")) {
                    case "checkbox":
                        $el.attr("checked", "checked");
                        break;
                    case 'radio':
                        $el.filter('[value="'+val+'"]').attr("checked", "checked");
                        break;
                    default:
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

                case "hidden" :
                    template = '<input type="hidden" name="{{ id }}" id="{{ id }}" value="{{ value }}" />';
                    break;

                default: throw new Error("Invalid field type in form config.");
            }

            return Mustache.render(template, fieldDef);

        }

    };
});

