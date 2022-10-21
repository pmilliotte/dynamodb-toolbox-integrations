"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keepRelevantValue = void 0;
exports.keepRelevantValue = (entity) => {
    const { attributes } = entity.schema;
    const params = Object.keys(entity.attributes).reduce((temporaryParams, attributeKey) => {
        var _a;
        const attributeMap = (_a = attributes[attributeKey].map) !== null && _a !== void 0 ? _a : attributeKey;
        return {
            ...temporaryParams,
            [`${attributeMap}.$`]: `$..arrays[?(@.attributeMap=='${attributeMap}' && @.length == 1)].value[0]`,
        };
    }, {});
    return params;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2VlcFJlbGV2YW50VmFsdWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJrZWVwUmVsZXZhbnRWYWx1ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFYSxRQUFBLGlCQUFpQixHQUFHLENBQUMsTUFBYyxFQUEwQixFQUFFO0lBQzFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0lBRXJDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQ3hCLE1BQU0sQ0FBQyxVQUE4QyxDQUN0RCxDQUFDLE1BQU0sQ0FBQyxDQUFDLGVBQWUsRUFBRSxZQUFZLEVBQUUsRUFBRTs7UUFDekMsTUFBTSxZQUFZLFNBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsbUNBQUksWUFBWSxDQUFDO1FBRWxFLE9BQU87WUFDTCxHQUFHLGVBQWU7WUFDbEIsQ0FBQyxHQUFHLFlBQVksSUFBSSxDQUFDLEVBQUUsZ0NBQWdDLFlBQVksK0JBQStCO1NBQ25HLENBQUM7SUFDSixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFUCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbnRpdHkgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuZXhwb3J0IGNvbnN0IGtlZXBSZWxldmFudFZhbHVlID0gKGVudGl0eTogRW50aXR5KTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9PiB7XG4gIGNvbnN0IHsgYXR0cmlidXRlcyB9ID0gZW50aXR5LnNjaGVtYTtcblxuICBjb25zdCBwYXJhbXMgPSBPYmplY3Qua2V5cyhcbiAgICBlbnRpdHkuYXR0cmlidXRlcyBhcyBSZWNvcmQ8c3RyaW5nLCB7IHR5cGU6IHN0cmluZyB9PlxuICApLnJlZHVjZSgodGVtcG9yYXJ5UGFyYW1zLCBhdHRyaWJ1dGVLZXkpID0+IHtcbiAgICBjb25zdCBhdHRyaWJ1dGVNYXAgPSBhdHRyaWJ1dGVzW2F0dHJpYnV0ZUtleV0ubWFwID8/IGF0dHJpYnV0ZUtleTtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi50ZW1wb3JhcnlQYXJhbXMsXG4gICAgICBbYCR7YXR0cmlidXRlTWFwfS4kYF06IGAkLi5hcnJheXNbPyhALmF0dHJpYnV0ZU1hcD09JyR7YXR0cmlidXRlTWFwfScgJiYgQC5sZW5ndGggPT0gMSldLnZhbHVlWzBdYCxcbiAgICB9O1xuICB9LCB7fSk7XG5cbiAgcmV0dXJuIHBhcmFtcztcbn07XG4iXX0=