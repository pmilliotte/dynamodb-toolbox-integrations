"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirstItem = void 0;
exports.getFirstItem = (entity) => {
    const { attributes } = entity.schema;
    const params = Object.keys(entity.attributes).reduce((temporaryParams, attributeKey) => {
        var _a;
        const attributeMap = (_a = attributes[attributeKey].map) !== null && _a !== void 0 ? _a : attributeKey;
        return {
            ...temporaryParams,
            [`${attributeMap}.$`]: `$.object.${attributeMap}[0][0]`,
        };
    }, {});
    return params;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0Rmlyc3RJdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2V0Rmlyc3RJdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVhLFFBQUEsWUFBWSxHQUFHLENBQUMsTUFBYyxFQUEwQixFQUFFO0lBQ3JFLE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0lBRXJDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQ3hCLE1BQU0sQ0FBQyxVQUE4QyxDQUN0RCxDQUFDLE1BQU0sQ0FBQyxDQUFDLGVBQWUsRUFBRSxZQUFZLEVBQUUsRUFBRTs7UUFDekMsTUFBTSxZQUFZLFNBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsbUNBQUksWUFBWSxDQUFDO1FBRWxFLE9BQU87WUFDTCxHQUFHLGVBQWU7WUFDbEIsQ0FBQyxHQUFHLFlBQVksSUFBSSxDQUFDLEVBQUUsWUFBWSxZQUFZLFFBQVE7U0FDeEQsQ0FBQztJQUNKLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUVQLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVudGl0eSB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5leHBvcnQgY29uc3QgZ2V0Rmlyc3RJdGVtID0gKGVudGl0eTogRW50aXR5KTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9PiB7XG4gIGNvbnN0IHsgYXR0cmlidXRlcyB9ID0gZW50aXR5LnNjaGVtYTtcblxuICBjb25zdCBwYXJhbXMgPSBPYmplY3Qua2V5cyhcbiAgICBlbnRpdHkuYXR0cmlidXRlcyBhcyBSZWNvcmQ8c3RyaW5nLCB7IHR5cGU6IHN0cmluZyB9PlxuICApLnJlZHVjZSgodGVtcG9yYXJ5UGFyYW1zLCBhdHRyaWJ1dGVLZXkpID0+IHtcbiAgICBjb25zdCBhdHRyaWJ1dGVNYXAgPSBhdHRyaWJ1dGVzW2F0dHJpYnV0ZUtleV0ubWFwID8/IGF0dHJpYnV0ZUtleTtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi50ZW1wb3JhcnlQYXJhbXMsXG4gICAgICBbYCR7YXR0cmlidXRlTWFwfS4kYF06IGAkLm9iamVjdC4ke2F0dHJpYnV0ZU1hcH1bMF1bMF1gLFxuICAgIH07XG4gIH0sIHt9KTtcblxuICByZXR1cm4gcGFyYW1zO1xufTtcbiJdfQ==