define(["spec/SpecHelper", "buildField"], function(SpecHelper, buildField) {

    describe("buildField", function() {

        var noWhitespace = function(str) {
            return str.replace(/\s+/g,'');
        };

        it("should be able to build a select input", function() {
            var inputConfig = {
                "type": "select",
                "id": "yes_no_question",
                "description": "Yes or no?",
                "options": [
                    { "value": "1", "label": "No" },
                    { "value": "2", "label": "Yes" }
                ]
            };
            var expectedHTML = '\
                <div data-role="fieldcontain">\
                    <label for="yes_no_question" class="select">Yes or no?:</label>\
                    <select name="yes_no_question" id="yes_no_question">\
                        <option value="1">No</option>\
                        <option value="2">Yes</option>\
                    </select>\
                </div>\
            ';
            var result = buildField(inputConfig);
            expect( noWhitespace(result) ).toEqual( noWhitespace(expectedHTML) );
        });

    });

});

