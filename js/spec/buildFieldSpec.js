define(["spec/SpecHelper", "buildField"], function(SpecHelper, buildField) {

    describe("buildField", function() {

        var noWhitespace = function(str) {
            return str.replace(/\s+/g,'');
        };

        it("should be able to build a select input", function() {
            var result = buildField({
                "type": "select",
                "id": "yes_no_question",
                "description": "Yes or no?",
                "options": [
                    { "value": "1", "label": "No" },
                    { "value": "2", "label": "Yes" }
                ]
            });
            expect(noWhitespace(result)).toEqual(noWhitespace('\
                <div data-role="fieldcontain">\
                    <label for="yes_no_question" class="select">Yes or no?:</label>\
                    <select name="yes_no_question" id="yes_no_question">\
                        <option value="1">No</option>\
                        <option value="2">Yes</option>\
                    </select>\
                </div>\
            '));
        });

        it("should be able to build a textarea input", function() {
            var result = buildField({
                "type": "textarea",
                "id": "comments",
                "description": "Comments"
            });
            expect(noWhitespace(result)).toEqual(noWhitespace('\
                <div data-role="fieldcontain">\
                    <label for="comments">Comments:</label>\
                    <textarea name="comments" id="comments"></textarea>\
                </div>\
            '));
        });

        // xit("should be able to build a hidden input with a value");
        // xit("should be able to build a hidden input without a value");
        // xit("should raise an error if the field type is invalid");

    });

});

