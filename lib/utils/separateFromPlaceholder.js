"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.separateFromPlaceholder = void 0;
exports.separateFromPlaceholder = (entity) => {
    const { attributes } = entity.schema;
    const params = Object.keys(entity.attributes).reduce((temporaryParams, attributeKey) => {
        var _a;
        const attributeMap = (_a = attributes[attributeKey].map) !== null && _a !== void 0 ? _a : attributeKey;
        return {
            ...temporaryParams,
            [`${attributeMap}.placeholder`]: {
                "value.$": `$.array[?(@.attributeMap=='${attributeMap}' && @.isPlaceholder == true)].nullValue`,
                // 0 or 1
                "length.$": `States.ArrayLength($.array[?(@.attributeMap=='${attributeMap}' && @.isPlaceholder == true)].nullValue)`,
                attributeMap,
            },
            [`${attributeMap}.null`]: {
                "value.$": `$.array[?(@.attributeMap=='${attributeMap}' && @.isNull == true)].null2Value`,
                // 0 or 1
                "length.$": `States.ArrayLength($.array[?(@.attributeMap=='${attributeMap}' && @.isNull == true)].null2Value)`,
                attributeMap,
            },
            [`${attributeMap}.input`]: {
                "value.$": `$.array[?(@.attributeMap=='${attributeMap}' && @.isPlaceholder == false && @.isNull == false)].value`,
                // 0 or 1
                "length.$": `States.ArrayLength($.array[?(@.attributeMap=='${attributeMap}' && @.isPlaceholder == false && @.isNull == false)].value)`,
                attributeMap,
            },
        };
    }, {});
    return params;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VwYXJhdGVGcm9tUGxhY2Vob2xkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXBhcmF0ZUZyb21QbGFjZWhvbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFYSxRQUFBLHVCQUF1QixHQUFHLENBQ3JDLE1BQWMsRUFDVSxFQUFFO0lBQzFCLE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0lBRXJDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQ3hCLE1BQU0sQ0FBQyxVQUFxQyxDQUM3QyxDQUFDLE1BQU0sQ0FBQyxDQUFDLGVBQWUsRUFBRSxZQUFZLEVBQUUsRUFBRTs7UUFDekMsTUFBTSxZQUFZLFNBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsbUNBQUksWUFBWSxDQUFDO1FBRWxFLE9BQU87WUFDTCxHQUFHLGVBQWU7WUFDbEIsQ0FBQyxHQUFHLFlBQVksY0FBYyxDQUFDLEVBQUU7Z0JBQy9CLFNBQVMsRUFBRSw4QkFBOEIsWUFBWSwwQ0FBMEM7Z0JBQy9GLFNBQVM7Z0JBQ1QsVUFBVSxFQUFFLGlEQUFpRCxZQUFZLDJDQUEyQztnQkFDcEgsWUFBWTthQUNiO1lBQ0QsQ0FBQyxHQUFHLFlBQVksT0FBTyxDQUFDLEVBQUU7Z0JBQ3hCLFNBQVMsRUFBRSw4QkFBOEIsWUFBWSxvQ0FBb0M7Z0JBQ3pGLFNBQVM7Z0JBQ1QsVUFBVSxFQUFFLGlEQUFpRCxZQUFZLHFDQUFxQztnQkFDOUcsWUFBWTthQUNiO1lBQ0QsQ0FBQyxHQUFHLFlBQVksUUFBUSxDQUFDLEVBQUU7Z0JBQ3pCLFNBQVMsRUFBRSw4QkFBOEIsWUFBWSw0REFBNEQ7Z0JBQ2pILFNBQVM7Z0JBQ1QsVUFBVSxFQUFFLGlEQUFpRCxZQUFZLDZEQUE2RDtnQkFDdEksWUFBWTthQUNiO1NBQ0YsQ0FBQztJQUNKLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUVQLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVudGl0eSB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5leHBvcnQgY29uc3Qgc2VwYXJhdGVGcm9tUGxhY2Vob2xkZXIgPSAoXG4gIGVudGl0eTogRW50aXR5XG4pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0+IHtcbiAgY29uc3QgeyBhdHRyaWJ1dGVzIH0gPSBlbnRpdHkuc2NoZW1hO1xuXG4gIGNvbnN0IHBhcmFtcyA9IE9iamVjdC5rZXlzKFxuICAgIGVudGl0eS5hdHRyaWJ1dGVzIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+XG4gICkucmVkdWNlKCh0ZW1wb3JhcnlQYXJhbXMsIGF0dHJpYnV0ZUtleSkgPT4ge1xuICAgIGNvbnN0IGF0dHJpYnV0ZU1hcCA9IGF0dHJpYnV0ZXNbYXR0cmlidXRlS2V5XS5tYXAgPz8gYXR0cmlidXRlS2V5O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnRlbXBvcmFyeVBhcmFtcyxcbiAgICAgIFtgJHthdHRyaWJ1dGVNYXB9LnBsYWNlaG9sZGVyYF06IHtcbiAgICAgICAgXCJ2YWx1ZS4kXCI6IGAkLmFycmF5Wz8oQC5hdHRyaWJ1dGVNYXA9PScke2F0dHJpYnV0ZU1hcH0nICYmIEAuaXNQbGFjZWhvbGRlciA9PSB0cnVlKV0ubnVsbFZhbHVlYCxcbiAgICAgICAgLy8gMCBvciAxXG4gICAgICAgIFwibGVuZ3RoLiRcIjogYFN0YXRlcy5BcnJheUxlbmd0aCgkLmFycmF5Wz8oQC5hdHRyaWJ1dGVNYXA9PScke2F0dHJpYnV0ZU1hcH0nICYmIEAuaXNQbGFjZWhvbGRlciA9PSB0cnVlKV0ubnVsbFZhbHVlKWAsXG4gICAgICAgIGF0dHJpYnV0ZU1hcCxcbiAgICAgIH0sXG4gICAgICBbYCR7YXR0cmlidXRlTWFwfS5udWxsYF06IHtcbiAgICAgICAgXCJ2YWx1ZS4kXCI6IGAkLmFycmF5Wz8oQC5hdHRyaWJ1dGVNYXA9PScke2F0dHJpYnV0ZU1hcH0nICYmIEAuaXNOdWxsID09IHRydWUpXS5udWxsMlZhbHVlYCxcbiAgICAgICAgLy8gMCBvciAxXG4gICAgICAgIFwibGVuZ3RoLiRcIjogYFN0YXRlcy5BcnJheUxlbmd0aCgkLmFycmF5Wz8oQC5hdHRyaWJ1dGVNYXA9PScke2F0dHJpYnV0ZU1hcH0nICYmIEAuaXNOdWxsID09IHRydWUpXS5udWxsMlZhbHVlKWAsXG4gICAgICAgIGF0dHJpYnV0ZU1hcCxcbiAgICAgIH0sXG4gICAgICBbYCR7YXR0cmlidXRlTWFwfS5pbnB1dGBdOiB7XG4gICAgICAgIFwidmFsdWUuJFwiOiBgJC5hcnJheVs/KEAuYXR0cmlidXRlTWFwPT0nJHthdHRyaWJ1dGVNYXB9JyAmJiBALmlzUGxhY2Vob2xkZXIgPT0gZmFsc2UgJiYgQC5pc051bGwgPT0gZmFsc2UpXS52YWx1ZWAsXG4gICAgICAgIC8vIDAgb3IgMVxuICAgICAgICBcImxlbmd0aC4kXCI6IGBTdGF0ZXMuQXJyYXlMZW5ndGgoJC5hcnJheVs/KEAuYXR0cmlidXRlTWFwPT0nJHthdHRyaWJ1dGVNYXB9JyAmJiBALmlzUGxhY2Vob2xkZXIgPT0gZmFsc2UgJiYgQC5pc051bGwgPT0gZmFsc2UpXS52YWx1ZSlgLFxuICAgICAgICBhdHRyaWJ1dGVNYXAsXG4gICAgICB9LFxuICAgIH07XG4gIH0sIHt9KTtcblxuICByZXR1cm4gcGFyYW1zO1xufTtcbiJdfQ==