define(["underscore", "jquery", "mustache"], function(_, $, Mustache) {

    var to_s = function(value) {
        return (value === null) ? '' : value.toString();
    };

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

                    var existingValues = _($el.find("option")).map(function(option) { return to_s(option.value); });
                    if (! _(existingValues).contains(to_s(val))) {
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

                case "title" :
                    template = '\
                        <div>\
                            <hr>\
                            <h2 class="title">{{ description }}</h2>\
                            <hr>\
                        </div>\
                    ';
                    break;

                case "select" :
                    if (_(fieldDef).has('multiple')) { 
                        fieldDef['multiple'] = "multiple=multiple"; 
                        fieldDef['data-native-menu']="data-native-menu=false";
                    }

                    template = '\
                        <div data-role="fieldcontain">\
                            <label for="{{ id }}" class="select">{{ description }}:</label>\
                            <select name="{{ id }}" id="{{ id }}" {{ multiple }} {{ data-native-menu }}>\
                                {{ #options }}\
                                <option value="{{ value }}">{{ label }}</option>\
                                {{ /options }}\
                            </select>\
                        </div>\
                    ';
                    break;

                case "checkbox" :
                    template = '\
                        <div data-role="fieldcontain">\
                            <label for="{{ id }}" class="checkbox">{{ description }}</label>\
                            <input type="checkbox" name="{{ id }}" id="{{ id }}" value="{{ value }}" {{ #checked }}checked{{ /checked }}/>\
                        </div>\
                    ';
                    break;

                case "table" :
                    template = '\
                        <div role="main" class="ui-content">\
                            <table data-role="table" id="{{ id }}" data-mode="columntoggle">\
                                <thead>\
                                    <tr>\
                                        {{ #thead }}\
                                            <th data-priority="critical">{{ th }}</th>\
                                        {{ /thead }}\
                                    </tr>\
                                </thead>\
                                <tbody>\
                                    {{ #tbody }}\
                                        <tr>\
                                            {{ #tr }}\
                                                <td>{{ td }}</td>\
                                            {{ /tr }}\
                                        </tr>\
                                    {{ /tbody }}\
                                </tbody>\
                            </table>\
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

                case "textareareadonly" :
                    template = '\
                        <div data-role="fieldcontain">\
                            <label for="{{ id }}">{{ description }}:</label>\
                            <textarea name="{{ id }}" id="{{ id }}" disabled placeholder="{{ placeholder }}"></textarea>\
                        </div>\
                    ';
                    break;

                case "number":
                    if (_(fieldDef).has('min')) { fieldDef['min'] = to_s(fieldDef['min']); }
                    if (_(fieldDef).has('max')) { fieldDef['max'] = to_s(fieldDef['max']); }
                    if (_(fieldDef).has('step')) { fieldDef['step'] = to_s(fieldDef['step']); }
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

                case "date":
                    template = '\
                        <div data-role="fieldcontain">\
                            <label for="{{ id }}">{{ description }}:</label>\
                            <input type="date" name="{{ id }}" id="{{ id }}">\
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

                case "collapsible":
                    template = '\
                        <div data-role="collapsible">\
                          <h3>{{ description }}</h3>\
                          <div id="{{ id }}"><p>Loading ...</p></div>\
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

